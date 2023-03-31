// models
import Content from '../models/Content.js';
import User from '../models/User.js';
import random_sk from '../utils/generate-random-sk.js';
import calculatePositionNo from '../utils/calculate-position-no.js';
import ContentType from '../models/ContentTypes.js';
import tags from '../utils/tags.js';
import SelectedTags from '../utils/selected-tags.js';
import validateKey from '../utils/validate-key.js';
import ContentTypes from '../utils/content-types.js';

export default {
  onGetContentStatus: async (req, res) => {
    try {
      let { page, id, tableType } = req.query;
      let statusActiveContentCount = 0;
      let statusInactiveContentCount = 0;
      let statusSubmittedContentCount = 0;
      let statusActiveContent;
      let statusInactiveContent;
      let statusSubmittedContent;
      const skip = (page - 1) * 10;
      if (tableType === 'Active') {
        statusActiveContent = await Content.find({
          ContentStatus: 'active',
          User: id,
        })
          .sort({
            CreatedAt: -1,
          })
          .skip(skip)
          .limit(10);
      } else if (tableType === 'Rejected') {
        statusInactiveContent = await Content.find({
          ContentStatus: 'inactive',
          User: id,
        })
          .sort({
            CreatedAt: -1,
          })
          .skip(skip)
          .limit(10);
      } else if (tableType === 'Submitted') {
        statusSubmittedContent = await Content.find({
          ContentStatus: 'submitted',
          User: id,
        })
          .sort({
            CreatedAt: -1,
          })
          .skip(skip)
          .limit(10);
      } else {
        statusActiveContent = await Content.find({
          ContentStatus: 'active',
          User: id,
        })
          .sort({
            CreatedAt: -1,
          })
          .skip(skip)
          .limit(10);
        statusInactiveContent = await Content.find({
          ContentStatus: 'inactive',
          User: id,
        })
          .sort({
            CreatedAt: -1,
          })
          .skip(skip)
          .limit(10);

        statusSubmittedContent = await Content.find({
          ContentStatus: 'submitted',
          User: id,
        })
          .sort({
            CreatedAt: -1,
          })
          .skip(skip)
          .limit(10);
      }

      statusActiveContentCount = await Content.countDocuments({
        ContentStatus: 'active',
        User: id,
      }).exec();

      statusInactiveContentCount = await Content.countDocuments({
        ContentStatus: 'inactive',
        User: id,
      }).exec();

      statusSubmittedContentCount = await Content.countDocuments({
        ContentStatus: 'submitted',
        User: id,
      }).exec();

      res.status(200).json({
        success: true,
        data: {
          statusActiveContent,
          statusInactiveContent,
          statusSubmittedContent,
          statusActiveContentCount,
          statusInactiveContentCount,
          statusSubmittedContentCount,
        },
      });
    } catch (error) {
      res.status(400).json({ success: false });
    }
  },
  onGetContent: async (req, res) => {
    try {
      const contents = await Content.find({ ContentStatus: 'active' })
        .populate('User')
        .sort({
          Position: 1,
        });

      res.status(200).json({ success: true, data: contents });
    } catch (error) {
      res.status(400).json({ success: false });
    }
  },
  onGetContentById: async (req, res) => {
    try {
      const content = await Content.findById({ _id: req.query.id })
        .populate('User')
        .sort({
          Position: 1,
        });

      res.status(200).json({ success: true, data: content });
    } catch (error) {
      res.status(400).json({ success: false });
    }
  },
  onLikeContent: async (req, res) => {
    try {
      const data = req.body;
      let content;
      const existing_content = await Content.findOne({ _id: data._id });
      if (existing_content.LikedBy.includes(data.PublicKey)) {
        content = await Content.findOneAndUpdate(
          { _id: data._id },
          { $pull: { LikedBy: data.PublicKey } },
          {
            returnOriginal: false,
          }
        );
      } else {
        content = await Content.findOneAndUpdate(
          { _id: data._id },
          { $push: { LikedBy: data.PublicKey } },
          {
            returnOriginal: false,
          }
        );
      }
      res.status(200).json({ success: true, data: content });
    } catch (error) {
      res.status(400).json({ success: false });
    }
  },
  onUserMostPopularContent: async (req, res) => {
    const now = new Date();
    var lastTwoMonth = new Date(now.getFullYear(), now.getMonth() - 2, 0);

    try {
      const user = await User.findOne(
        { PublicKey: req.body.PublicKey },
        { _id: 1 },
        function (err, doc) {
          Content.aggregate(
            [
              {
                $match: {
                  CreatedAt: {
                    $gte: lastTwoMonth,
                  },
                  User: {
                    $eq: doc._id,
                  },
                },
              },
              {
                $project: {
                  Title: 1,
                  SK: 1,
                  Description: 1,
                  ContentMarkdown: 1,
                  ContentType: 1,
                  Url: 1,
                  Tags: 1,
                  Vertical: 1,
                  SpecialTag: 1,
                  PlaylistTitle: 1,
                  Provider: 1,
                  Img: 1,
                  PlaylistID: 1,
                  Position: 1,
                  ContentStatus: 1,
                  Lists: 1,
                  Live: 1,
                  User: 1,
                  TotalLikes: {
                    $cond: {
                      if: { $isArray: '$LikedBy' },
                      then: { $size: '$LikedBy' },
                      else: 0,
                    },
                  },
                  TotalViews: {
                    $cond: {
                      if: { $isArray: '$ViewedBy' },
                      then: { $size: '$ViewedBy' },
                      else: 0,
                    },
                  },
                },
              },
              {
                $match: {
                  $and: [
                    { TotalLikes: { $gt: 0 } },
                    { TotalLikes: { $gt: 0 } },
                  ],
                },
              },
            ],
            function (err, popularContent) {
              res.status(200).json({ success: true, data: popularContent });
            }
          )
            .sort({ TotalViews: -1, TotalLikes: -1 })
            .limit(1);
        }
      );
    } catch (error) {
      res.status(400).json({ success: false });
    }
  },
  onUserMostRecentContent: async (req, res) => {
    const now = new Date();
    var lastTwoMonth = new Date(now.getFullYear(), now.getMonth() - 3, 0);
    try {
      const user = await User.findOne(
        { PublicKey: req.body.PublicKey },
        { _id: 1 },
        function (err, doc) {
          Content.find(
            {
              $and: [
                { User: { $eq: doc._id } },
                { CreatedAt: { $gt: lastTwoMonth } },
              ],
            },
            function (err, contents) {
              res.status(200).json({ success: true, data: contents });
            }
          )
            .sort({ CreatedAt: -1 })
            .limit(10);
        }
      );
    } catch (error) {
      res.status(400).json({ success: false });
    }
  },
  onUserContentStats: async (req, res) => {
    try {
      const user = await User.findOne(
        { PublicKey: req.body.PublicKey },
        { _id: 1 },
        function (err, doc) {
          Content.aggregate(
            [
              {
                $match: {
                  User: {
                    $eq: doc._id,
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  TotalLikes: {
                    $cond: {
                      if: { $isArray: '$LikedBy' },
                      then: { $size: '$LikedBy' },
                      else: 0,
                    },
                  },
                  TotalViews: {
                    $cond: {
                      if: { $isArray: '$ViewedBy' },
                      then: { $size: '$ViewedBy' },
                      else: 0,
                    },
                  },
                },
              },
              {
                $group: {
                  _id: '$User',
                  AllLikes: {
                    $sum: '$TotalLikes',
                  },
                  AllViews: {
                    $sum: '$TotalViews',
                  },
                },
              },
            ],
            function (err, userContentStats) {
              res.status(200).json({ success: true, data: userContentStats });
            }
          );
        }
      );
    } catch (error) {
      res.status(400).json({ success: false });
    }
  },
  onViewContent: async (req, res) => {
    try {
      const data = req.body;
      const content = await Content.findOneAndUpdate(
        { _id: data._id },
        { $push: { ViewedBy: data.PublicKey } },
        {
          returnOriginal: false,
        }
      );

      res.status(200).json({ success: true, data: content });
    } catch (error) {
      res.status(400).json({ success: false });
    }
  },
  onTopContent: async (req, res) => {
    const now = new Date();
    var firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    var lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    try {
      const topContentWithAUthor = await Content.aggregate([
        {
          $match: {
            CreatedAt: {
              $gte: firstDay,
              $lte: lastDay,
            },
            ContentType: {
              $in: ['articles', 'tutorials'],
            },
            ContentStatus: {
              $eq: 'active',
            },
          },
        },
        {
          $project: {
            Title: 1,
            SK: 1,
            Description: 1,
            ContentMarkdown: 1,
            ContentType: 1,
            Url: 1,
            Tags: 1,
            Vertical: 1,
            SpecialTag: 1,
            PlaylistTitle: 1,
            Provider: 1,
            Img: 1,
            PlaylistID: 1,
            Position: 1,
            ContentStatus: 1,
            Lists: 1,
            Live: 1,
            User: 1,
            CreatedAt: 1,
            TotalLikes: {
              $cond: {
                if: { $isArray: '$LikedBy' },
                then: { $size: '$LikedBy' },
                else: 0,
              },
            },
            TotalViews: {
              $cond: {
                if: { $isArray: '$ViewedBy' },
                then: { $size: '$ViewedBy' },
                else: 0,
              },
            },
          },
        },
      ])
        .sort({ TotalViews: -1, TotalLikes: -1 })
        .limit(5);

      res.status(200).json({ success: true, data: topContentWithAUthor });
    } catch (error) {
      res.status(400).json({ success: false });
    }
  },
  onTopContributor: async (req, res) => {
    const now = new Date();
    var firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    var lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    try {
      const topContentWithUser = await Content.aggregate([
        {
          $match: {
            CreatedAt: {
              $gte: firstDay,
              $lte: lastDay,
            },
            ContentType: {
              $in: ['articles', 'tutorials'],
            },
            ContentStatus: {
              $eq: 'active',
            },
          },
        },
        {
          $group: {
            _id: '$User',
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            User: '$_id',
            count: 1,
          },
        },
      ])
        .sort({ count: -1 })
        .limit(3);

      const topAuthor = await User.populate(topContentWithUser, {
        path: 'User',
        select: 'Username PublicKey Country ProfilePicture Skills Author',
      });

      res.status(200).json({ success: true, data: topContentWithUser });
    } catch (error) {
      res.status(400).json({ success: false });
    }
  },
  onCreateContent: async (req, res) => {
    try {
      const data = req.body;

      //const images = await GetImageFromSiteUrl(data.Url);
      //Dont get first image if we have more then one image on site to ignore logos
      const image = data.ImageUrl;
      //images.length >= 1 ? images[1] : images.length > 0 ? images[0] : '';
      const get_random_sk = await random_sk();
      const position = await calculatePositionNo(data.ContentType);
      const content = await Content.create({
        PlaylistID: data.ContentType == 'playlist' ? data.PlaylistID : '',
        User: data.UserID,
        Title: data.Title,
        Author: data.Author,
        Description: data.Description,
        ContentMarkdown: data?.ContentMarkdown,
        SK: get_random_sk,
        ContentType: data.ContentType,
        ContentStatus: data.ContentStatus,
        Position: position,
        List: data.List,
        Url: data.Url,
        Tags: data.Tags,
        Vertical: data.Vertical,
        SpecialTag: data.SpecialTag,
        Img: image,
        PublicKey: data.PublicKey,
      });

      res.status(201).json({ success: true, data: content });
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
  },
  onUpdateContent: async (req, res) => {
    try {
      const data = req.body;
      data['PublishedAt'] = new Date();
      await Content.updateMany(
        { ContentType: data.ContentType },
        { $set: { SpecialTag: '0' } }
      );
      data['SpecialTag'] = data['SpecialTag'] != '' ? 'New' : '0';
      const content = await Content.findOneAndUpdate({ SK: data.SK }, data, {
        returnOriginal: false,
      });

      res.status(200).json(content);
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
  },
  onGetContentWithType: async (req, res) => {
    var contents;
    try {
      if ('url' in req.query) {
        contents = await Content.findOne({ Url: req.query.url }).populate(
          'User'
        );
      } else {
        contents = await Content.find({
          ContentStatus: req.params.type,
        }).populate('User');
      }

      res.status(200).json(contents);
    } catch (error) {
      res.status(400).json({ success: false });
    }
  },
  onGetContentTypes: async (req, res) => {
    try {
      const contents = await ContentType.find({}, { _id: 0, Name: 1 });
      var type = [];

      contents.forEach(function (contents) {
        type.push(contents['Name']);
      });
      res.status(200).json(type);
    } catch (error) {
      res.status(400).json({ success: false });
    }
  },
  onPostContentWithType: async (req, res) => {
    try {
      const data = req.body;
      const contentType = await ContentType_.create({
        Name: data.Name,
      });

      res.status(201).json({ success: true, data: contentType });
    } catch (error) {
      res.status(400).json({ success: false });
    }
  },
  onGetContentWithSpecialTagHOT: async (req, res) => {
    try {
      const contents = await Content.find({ SpecialTag: 'Hot' }).populate(
        'User'
      );

      res.status(200).json(contents);
    } catch (error) {
      res.status(400).json({ success: false });
    }
  },
  onGetContentWithSpecialTagNEW: async (req, res) => {
    try {
      const contents = await Content.find({
        ContentStatus: {
          $ne: 'submitted',
        },
        ContentType: {
          $nin: ['newsletters', 'playlist'],
        },
      })
        .populate('User')
        .sort({
          CreatedAt: -1,
        });

      res.status(200).json(contents);
    } catch (error) {
      res.status(400).json({ success: false });
    }
  },
  onGetList: async (req, res) => {
    try {
      const contents = await Content.find({
        Lists: req.params.listName,
      }).populate('User');

      res.status(200).json(contents);
    } catch (error) {
      res.status(400).json({ success: false });
    }
  },
  onGetContentBnb: async (req, res) => {
    let contents, multipleExist;
    if (ContentTypes.includes(req.params.type)) {
      if (
        ContentTypes.includes(req.params.type) &&
        ((req.query.tags === '' && req.query.specialTags === '') ||
          Object.keys(req.query).length == 0)
      ) {
        try {
          contents = await Content.find({
            ContentType: req.params.type,
            ContentStatus: 'active',
          })
            .populate('User')
            .sort({ Position: -1 });

          if ('tags' in req.query && req.query.tags.length > 1) {
            multipleExist = req.query.tags.every((value) => {
              return SelectedTags['allTags'].includes(value);
            });
          }
          if (multipleExist) {
            contents = await Content.find({
              ContentType: req.params.type,
              Tags: { $in: req.params.tags },
              ContentStatus: 'active',
            })
              .populate('User')
              .sort({ Position: -1 });
          }

          res.status(200).json(contents);
        } catch (error) {
          res.status(400).json({ success: false });
        }
      } else if (
        SelectedTags['allTags'].some((r) => req.query.tags.includes(r)) &&
        req.query.specialTags === ''
      ) {
        try {
          contents = await Content.find({
            Tags: { $in: req.query.tags },
            ContentStatus: 'active',
            ContentType: req.params.type,
          })
            .populate('User')
            .sort({ Position: -1 });

          res.status(200).json(contents);
        } catch (error) {
          res.status(400).json({ success: false });
        }
      } else if (req.query.specialTags !== '' && req.query.tags !== '') {
        try {
          contents = await Content.find({
            SpecialTag: req.query.specialTags,
            Tags: { $in: req.query.tags },
            ContentStatus: 'active',
            ContentType: req.params.type,
          })
            .populate('User')
            .sort({ Position: -1 });

          res.status(200).json(contents);
        } catch (error) {
          res.status(400).json({ success: false });
        }
      } else if (req.query.specialTags !== '' && req.query.tags === '') {
        try {
          contents = await Content.find({
            SpecialTag: req.query.specialTags,
            ContentStatus: 'active',
            ContentType: req.params.type,
          })
            .populate('User')
            .sort({ Position: -1 });

          res.status(200).json(contents);
        } catch (error) {
          res.status(400).json({ success: false });
        }
      } // Done till here
    } else if (req.params.videoID === undefined) {
      try {
        contents = await Content.find({ PlaylistID: req.params.type }).populate(
          'User'
        );

        res.status(200).json(contents);
      } catch (error) {
        res.status(400).json({ success: false });
      }
    } else {
      try {
        contents = await Content.findOne({
          ContentType: req.params.type,
          SK: req.params.videoID,
          ContentStatus: 'active',
        })
          .populate('User')
          .sort({ Position: -1 });

        res.status(200).json(contents);
      } catch (error) {
        res.status(400).json({ success: false });
      }
    }
  },
  onGetContentBnbNewsletters: async (req, res) => {
    try {
      const contents = await Content.find(
        { ContentType: 'newsletters', ContentStatus: 'active' },
        {}
      )
        .populate('User')
        .sort({ Position: -1 });
      //const contents = await Content.find({}, { _id: 0}).sort({ CreatedAt: -1, ContentType: "newsletter"});
      res.status(200).json(contents);
    } catch (error) {
      res.status(400).json({ success: false });
    }
  },
  onPostContentBnbNewsletters: async (req, res) => {
    const position = await calculatePositionNo('newsletters');

    try {
      const data = req.body;

      //split string into array by space then join array with '-'
      let titleSpacesRemoved = data.Title.split(' ').join('-');
      const content = await Content.create({
        Title: data.Title,
        Url: process.env.HOME_URL + '/newsletters/' + titleSpacesRemoved,
        SK: titleSpacesRemoved,
        Author: data.Author,
        Position: position,
        ContentStatus: 'active',
        ContentType: 'newsletters',
        ContentMarkdown: data.ContentMarkdown,
        Description: data.Description,
        //                    Img: data.Img
      });
      res.status(201).json({ success: true, data: content });
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
  },
};

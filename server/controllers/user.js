// models
import User from '../models/User.js';
import { Member, Role } from '../constant/enums.js';
import mongoose from 'mongoose';

export default {
  onGetAllUser: async (req, res) => {
    try {
      const { page, name } = req.query;
      const nameRegex = new RegExp(name, 'i'); // i for case insensitive
      let filterObject = {
        ...(name !== '' && { Username: { $regex: nameRegex } }),
      };
      const users = await User.aggregate([
        {
          $match: filterObject,
        },
        {
          $lookup: {
            from: 'contents',
            localField: '_id',
            foreignField: 'User',
            as: 'Contents',
          },
        },
        { $unwind: { path: '$Contents', preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: '$_id',
            TotalArticles: {
              $count: {},
            },
            Username: { $first: '$Username' },
            Password: { $first: '$Password' },
            CreatedAt: { $first: '$CreatedAt' },
            Token: { $first: '$Token' },
            PublicKey: { $first: '$PublicKey' },
            Roles: { $first: '$Roles' },
            Country: { $first: '$Country' },
            Author: { $first: '$Author' },
            Bio: { $first: '$Bio' },
            Email: { $first: '$Email' },
            ProfilePicture: { $first: '$ProfilePicture' },
            Skills: { $first: '$Skills' },
            TotalLikes: {
              $sum: {
                $cond: {
                  if: { $isArray: '$Contents.LikedBy' },
                  then: { $size: '$Contents.LikedBy' },
                  else: 0,
                },
              },
            },
            TotalViews: {
              $sum: {
                $cond: {
                  if: { $isArray: '$Contents.ViewedBy' },
                  then: { $size: '$Contents.ViewedBy' },
                  else: 0,
                },
              },
            },
          },
        },
      ])
        .sort({ TotalLikes: -1, TotalViews: -1, TotalArticles: -1 })
        .skip((parseInt(page) - 1) * 10)
        .limit(10);
      const usersCount = await User.countDocuments(filterObject).exec();
      res.status(200).json({ success: true, data: { users, usersCount } });
    } catch (error) {
      res.status(400).json({ success: false });
    }
  },
  onGetMartians: async (req, res) => {
    try {
      const keyword = req.query.keyword;
      const country = req.query.country;
      const martian = req.query.martian;
      const keywordRegex = new RegExp(keyword, 'i'); // i for case insensitive
      const countryRegex = new RegExp(country, 'i');
      const martianRegex = new RegExp(martian, 'i');
      const page = parseInt(req.query.pageNumber) || 1;
      const perPage = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * perPage;
      const result = {};
      let totalMartains = 0;
      let filterObject = {
        ...(keyword !== '' && { Username: { $regex: keywordRegex } }),
        ...(country !== '' && { Country: { $regex: countryRegex } }),
        ...(martian !== '' && { MartianType: { $regex: martianRegex } }),
        ...{ Roles: 'Martian' },
      };

      result.data = await User.find(filterObject)
        .skip(skip)
        .limit(perPage)
        .exec();
      totalMartains = await User.countDocuments(filterObject).exec();
      result.totalMartains = totalMartains;
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
  },
  onGetUser: async (req, res) => {
    try {
      if (req.params.publicKey) {
        const user = await User.findOne({
          PublicKey: req.params.publicKey,
        });
        return res.status(200).json(user);
      }
      res.status(200).json('PublicKey missing');
    } catch (error) {
      res.status(400).json({ success: false });
    }
  },
  onGetUserProfileWithData: async (req, res) => {
    const { userID } = req.params;
    const now = new Date();
    var lastThreeMonths = new Date(now.getFullYear(), now.getMonth() - 3, 0);

    // security check

    // if (userID != req?.userData?.userId) {
    //   return res.status(400).json({ success: false, message: 'Bad request' });
    // }

    try {
      const user = await User.findOne({ _id: userID });

      if (user && user._id == userID) {
        let updatedUser = JSON.parse(JSON.stringify(user));

        const userWithAllContentRelatedData = await User.aggregate([
          {
            $match: { _id: mongoose.Types.ObjectId(userID) },
          },
          {
            $lookup: {
              from: 'contents',
              localField: '_id',
              foreignField: 'User',
              as: 'Contents',
            },
          },
          { $unwind: { path: '$Contents', preserveNullAndEmptyArrays: true } },
          {
            $group: {
              _id: '$_id',
              MostPopularContent: { $addToSet: '$Contents' },
              UserAllContents: { $addToSet: '$Contents' },
              Username: { $first: '$Username' },
              Password: { $first: '$Password' },
              CreatedAt: { $first: '$CreatedAt' },
              Token: { $first: '$Token' },
              Languages: { $first: '$Languages' },
              PublicKey: { $first: '$PublicKey' },
              Roles: { $first: '$Roles' },
              Country: { $first: '$Country' },
              Author: { $first: '$Author' },
              Bio: { $first: '$Bio' },
              Email: { $first: '$Email' },
              ProfilePicture: { $first: '$ProfilePicture' },
              Skills: { $first: '$Skills' },
              TotalArticles: {
                $sum: 1,
              },
              TotalLikes: {
                $sum: {
                  $cond: {
                    if: { $isArray: '$Contents.LikedBy' },
                    then: { $size: '$Contents.LikedBy' },
                    else: 0,
                  },
                },
              },
              TotalViews: {
                $sum: {
                  $cond: {
                    if: { $isArray: '$Contents.ViewedBy' },
                    then: { $size: '$Contents.ViewedBy' },
                    else: 0,
                  },
                },
              },
            },
          },
          {
            $unwind: {
              path: '$MostPopularContent',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              _id: 1,
              MostPopularContent: 1,
              UserAllContents: {
                $slice: ['$UserAllContents', 7],
              },
              MostRecentContent: {
                $filter: {
                  input: '$UserAllContents',
                  as: 'item',
                  cond: {
                    $gt: ['$$item.CreatedAt', lastThreeMonths],
                  },
                },
              },
              Username: 1,
              Password: 1,
              CreatedAt: 1,
              PublicKey: 1,
              Roles: 1,
              Country: 1,
              Languages: 1,
              Author: 1,
              Bio: 1,
              Email: 1,
              ProfilePicture: 1,
              Skills: 1,
              TotalArticles: 1,
              TotalLikes: 1,
              TotalViews: 1,
              EachContentLike: {
                $cond: {
                  if: { $isArray: '$MostPopularContent.LikedBy' },
                  then: { $size: '$MostPopularContent.LikedBy' },
                  else: 0,
                },
              },
              EachContentView: {
                $cond: {
                  if: { $isArray: '$MostPopularContent.ViewedBy' },
                  then: { $size: '$MostPopularContent.ViewedBy' },
                  else: 0,
                },
              },
            },
          },
          { $sort: { EachContentLike: -1, EachContentView: -1 } },
          { $limit: 1 },
        ]);

        return res.status(200).json({
          success: true,
          data: userWithAllContentRelatedData[0],
          message: 'Successful',
        });
      } else {
        return res
          .status(404)
          .json({ success: false, data: {}, message: 'User not found' });
      }
    } catch (error) {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  },
  onGetUserProfile: async (req, res) => {
    const { userID } = req.params;
    // security check
    // if (userID != req?.userData?.userId) {
    //   return res.status(400).json({ success: false, message: 'Bad request' });
    // }

    try {
      const user = await User.findOne({ _id: userID });

      if (user && user._id == userID) {
        let updatedUser = JSON.parse(JSON.stringify(user));
        updatedUser = {
          ...updatedUser,
          Author: {
            ...updatedUser.Author,
            Rank: 808,
            Read: '12.2K',
            Reputation: '13K',
            Like: '5',
          },
        };
        return res
          .status(200)
          .json({ success: true, data: updatedUser, message: 'Successful' });
      } else {
        return res
          .status(404)
          .json({ success: false, data: {}, message: 'User not found' });
      }
    } catch (error) {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  },

  onUpdateUserProfile: async (req, res) => {
    const { userID } = req.params;

    // security check
    // if (userID != req?.userData?.userId) {
    //   return res.status(400).json({ success: false, message: 'Bad request' });
    // }
    // else find the user
    try {
      const tempUser = await User.findOne({ _id: userID });
      let updatedUser = {
        Username: req.body.Username,
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        ProfilePicture: req.body.ProfilePicture,
        Bio: req.body.Bio,
        Skills: req.body.Skills,
        Country: req.body.Country,
        Email: req.body.Email,
        MartianType: req.body.MartianType,
        City: req.body.City,
        Languages: req.body.Languages,
        Roles: req.body.Roles,
        Author: {
          Member: tempUser?.Author?.Member,
          SocialLinks: req.body?.Author?.SocialLinks
            ? req.body?.Author?.SocialLinks.map((link) => {
                return {
                  Link: link.Link,
                  Name: link.Name,
                };
              })
            : [],
          RecognizationsAndAwards: req.body?.Author?.RecognizationsAndAwards
            ? req.body?.Author?.RecognizationsAndAwards
            : [],
          Certification: req.body?.Author?.Certification
            ? req.body?.Author?.Certification.map((cer) => {
                return {
                  Name: cer.Name,
                  Organization: cer.Organization,
                };
              })
            : [],
        },
      };
      await User.updateOne({ _id: userID }, updatedUser);
      res.status(200).json({ success: true, message: 'Successful' });
    } catch (error) {
      console.log('error ==>', error);
      res.status(404).json({ success: false, message: 'User not found' });
    }
  },
  onAddUserProfil: async (req, res) => {
    const { userID } = req.params;
    // security check
    if (userID != req?.userData?.userId) {
      res.status(400).json({ success: false, message: 'Bad request' });
    }

    try {
      console.log('req.file ==<', req.file);
      let imageURL =
        req.protocol +
        '://' +
        req.headers.host +
        '/server/public/images/' +
        req.file.filename;
      await User.updateOne(
        { _id: req?.userData?.userId },
        { ProfilePicture: imageURL }
      );

      return res.status(200).json({ success: true, message: 'Successful' });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: 'Something went wrong.' });
    }
  },
  onGetUserById: async (req, res) => {
    try {
      console.log(req.params.Id);
      const user = await User.findOne({ _id: req.params.Id });

      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ success: false });
    }
  },
  onCreateUser: async (req, res) => {
    // extracting data from body
    const {
      PublicKey,
      FirstName,
      LastName,
      Email,
      ImageUrl,
      Expertise,
      MartianType,
      Country,
      City,
      Languages,
      BioGraphy,
      Roles,
    } = req.body;
    let user = {};
    try {
      let userExist = await User.findOne({ PublicKey: PublicKey });
      if (!userExist) {
        user = await User.create({
          Username: FirstName + ' ' + LastName,
          Email: Email,
          ProfilePicture: ImageUrl,
          Token: '',
          TokenFirstCreatedAt: '',
          PublicKey: PublicKey,
          Roles: Roles,
          Skills: Expertise,
          Languages: Languages,
          TokenUpdatedAt: '',
          CreatedAt: new Date(),
          Bio: BioGraphy,
          Country: Country,
          City: City,
          Author: {
            SocialLinks: [],
            Member: Member[3],
            RecognizationsAndAwards: [],
            Certification: [],
            MostPopular: [],
            Contributions: [],
          },
          MartianType: MartianType,
        });
        return res.status(201).json({ success: true, user: user });
      } else {
        return res.status(400).json({
          success: false,
          message: 'User With Public Key Already Exist!',
        });
      }
    } catch (error) {
      res.status(400).json({ success: false, message: error });
    }
  },
};

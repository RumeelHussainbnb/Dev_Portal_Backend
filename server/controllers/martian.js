// third part
import bcrypt from 'bcryptjs';
import { Member } from '../constant/enums.js';
// models
import Martian from '../models/Martian.js';
import User from '../models/User.js';

import { generateUploadURL } from '../utils/s3.js';

export default {
  onCreateMartian: async (req, res) => {
    try {
      const data = req.body;
      let user;
      //check for user in db
      if (data.Email) user = await User.findOne({ Email: data.Email });

      const martian = await Martian.create({
        ImageUrl: data.ImageUrl,
        FirstName: data.FirstName,
        LastName: data.LastName,
        Expertise: data.Expertise,
        Country: data.Country,
        MartianType: data.MartianType,
        State: data.State,
        City: data.City,
        Languages: data.Languages,
        BioGraphy: data.BioGraphy,
      });

      //if user not found
      if (!user) {
        //create user
        user = await User.create({
          Username: data.FirstName,
          MartianId: martian.id,
          Email: data.Email,
          ProfilePicture: '',
          Token: '',
          TokenFirstCreatedAt: '',
          PublicKey: data.publicKey,
          Role: 'Martian',
          TokenUpdatedAt: '',
          CreatedAt: '',
          Author: {
            SocialLinks: [],
            Member: Member[3],
            Contributions: [],
            RecognizationsAndAwards: [],
            Certification: [],
          },
        });
      }
      //if have user update martian key
      else {
        const user = await User.findOneAndUpdate(
          { Email: data.Email },
          {
            $set: {
              MartianId: martian.id,
            },
          },
          { new: true }
        );
      }

      res.status(201).json({ success: true, data: martian });
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
  },

  onUpdateMartian: async (req, res) => {
    try {
      const data = req.body;

      const martian = await Martian.findByIdAndUpdate(data.id, data, {
        returnOriginal: false,
      });

      res.status(201).json({ success: true, data: martian });
    } catch (error) {
      res.status(400).json({ success: false, error: error });
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
      const page = parseInt(req.query.pageNumber) || 10;
      const perPage = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * perPage;
      const result = {};
      let totalMartains = 0;
      let filterObject = {
        ...(keyword !== '' && { Expertise: { $regex: keywordRegex } }),
        ...(country !== '' && { Country: { $regex: countryRegex } }),
        ...(martian !== '' && { MartianType: { $regex: martianRegex } }),
      };

      result.data = await Martian.find(filterObject)
        .skip(skip)
        .limit(perPage)
        .exec();
      totalMartains = await Martian.countDocuments(filterObject).exec();
      result.totalMartains = totalMartains;
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
  },
  onGetMartianById: async (req, res) => {
    try {
      let martian = await Martian.findById(
        { _id: req.query.id },
        {
          Activities: { $slice: [0, 10] },
        }
      );
      const martianActivitySize = await Martian.findById(
        { _id: req.query.id },
        {
          ActivitiesSize: { $size: '$Activities' },
        }
      );

      res
        .status(201)
        .json({ success: true, data: martian, martianActivitySize });
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
  },

  onGetMartianActivityByPage: async (req, res) => {
    try {
      const page = parseInt(req.query.pageNumber) || 1;
      const perPage = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * perPage;

      let martian = await Martian.findById(
        { _id: req.query.id },
        {
          Activities: { $slice: [skip, perPage] },
        }
      );
      res.status(201).json({ success: true, data: martian });
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
  },

  onAddActivity: async (req, res) => {
    try {
      const data = req.body;
      const martian = await Martian.findOneAndUpdate(
        { _id: data.martianId },
        {
          $push: {
            Activities: [
              {
                date: data.date,
                activity: data.activity,
                activityLink: data.activityLink,
                type: data.type,
                primaryContributionArea: data.primaryContributionArea,
                additionalContributionArea: data.additionalContributionArea,
              },
            ],
          },
        },
        { new: true }
      );

      res.status(201).json({ success: true, data: martian });
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
  },

  onEditActivity: async (req, res) => {
    try {
      const data = req.body;
      const martian = await Martian.findOneAndUpdate(
        { _id: data.martianId, 'Activities._id': data.id },
        {
          $set: {
            'Activities.$.date': data.date,
            'Activities.$.activity': data.activity,
            'Activities.$.activityLink': data.activityLink,
            'Activities.$.type': data.type,
            'Activities.$.primaryContributionArea':
              data.primaryContributionArea,
            'Activities.$.additionalContributionArea':
              data.additionalContributionArea,
          },
        },
        { new: true }
      );
      res.status(201).json({ success: true, data: martian });
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
  },

  onDeleteActivity: async (req, res) => {
    try {
      const data = req.query;
      const martian = await Martian.findByIdAndUpdate(
        data.martianId,

        {
          $pull: {
            Activities: {
              _id: data.id,
            },
          },
        },

        { new: true }
      );

      res.status(201).json({ success: true, data: martian });
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
  },

  onGetS3Url: async (req, res) => {
    try {
      const url = await generateUploadURL();
      res.status(201).json({ success: true, url: url });
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
  },
};

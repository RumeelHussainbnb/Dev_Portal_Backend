// models
import Martian from '../models/Martian.js';

import { generateUploadURL } from '../utils/s3.js';

export default {
  onCreateMartian: async (req, res) => {
    try {
      const data = req.body;

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

      res.status(200).json(martian);
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

  onGetS3Url: async (req, res) => {
    try {
      const url = await generateUploadURL();
      res.status(201).json({ success: true, url: url });
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
  },
};

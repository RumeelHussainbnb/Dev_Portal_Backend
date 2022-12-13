// models
import Martian from '../models/Martian.js';

export default {
  onCreateMartian: async (req, res) => {
    try {
      const data = req.body;

      const martian = await Martian.create({
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

  onGetMartians: async (req, res) => {
    try {
      const page = parseInt(req.query.pageNumber) || 10;
      const perPage = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * perPage;
      const result = {};
      const totalMartains = await Martian.countDocuments().exec();

      result.totalMartains = totalMartains;

      result.data = await Martian.find().skip(skip).limit(perPage).exec();

      res.status(201).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
  },
};

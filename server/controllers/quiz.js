import mongoose from 'mongoose';
// models
import Quiz from '../models/Quiz.js';

export default {
  onGetAllQuizs: async (req, res) => {
    try {
      let totalQuizCount = 0;
      const page = parseInt(req.query.pageNumber) || 1;
      const perPage = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * perPage;
      //* For Pagiantion Add This In Aggregation Pipeline
      //   { '$facet'    : {
      //     metadata: [ { $count: "total" } ],
      //     data: [ { $skip: skip }, { $limit: perPage } ] // add projection here wish you re-shape the docs
      // } }

      const getAllQuizes = await Quiz.aggregate([
        {
          $match: {},
        },
      ]);
      res.status(200).json({ success: true, data: [...getAllQuizes] });
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
  },
  onGetQuizById: async (req, res) => {
    try {
      let id = mongoose.Types.ObjectId(req.query.id);
      const getQuize = await Quiz.aggregate([{ $match: { _id: id } }]);
      res.status(200).json({ success: true, data: getQuize });
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
  },
  onCreateQuiz: async (req, res) => {
    try {
      const { Title, Description, Questions } = req.body;
      const createdQuiz = await Quiz.create({
        Title,
        Description,
        Questions,
      });

      res.status(201).json({ success: true, data: createdQuiz });
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
  },
  onUpdateQuiz: async (req, res) => {
    try {
      const data = req.body;
      const quiz = await Quiz.findOneAndUpdate({ _id: data._id }, data, {
        returnOriginal: false,
      });

      res.status(200).json({ success: true, data: quiz });
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
  },
  onDeleteQuiz: async (req, res) => {
    try {
      const deletedQuiz = await Quiz.deleteOne({ _id: req.query._id });

      res.status(200).json({ success: true, data: deletedQuiz });
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
  },
};

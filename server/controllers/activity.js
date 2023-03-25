// models
import Activity from '../models/Activity.js';

export default {
  onGetMartianActivityByPage: async (req, res) => {
    try {
      let totalActivityCount = 0;
      let totalActivity = [];
      const page = parseInt(req.query.pageNumber) || 1;
      const perPage = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * perPage;

      totalActivity = await Activity.find({ userId: req.query.id })
        .skip(skip)
        .limit(perPage)
        .exec();
      totalActivityCount = await Activity.countDocuments({
        userId: req.query.id,
      }).exec();
      res
        .status(200)
        .json({ success: true, data: { totalActivity, totalActivityCount } });
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
  },

  onCreateActivity: async (req, res) => {
    try {
      const {
        date,
        userId,
        activity,
        activityLink,
        type,
        primaryContributionArea,
        additionalContributionArea,
      } = req.body;
      const createdActivity = await Activity.create({
        date,
        userId,
        activity,
        activityLink,
        type,
        primaryContributionArea,
        additionalContributionArea,
      });

      res.status(201).json({ success: true, data: createdActivity });
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
  },

  onEditActivity: async (req, res) => {
    try {
      const data = req.body;

      const updatedActivity = await Activity.findOneAndUpdate(
        { _id: data.id },
        {
          $set: {
            date: data.date,
            activity: data.activity,
            activityLink: data.activityLink,
            type: data.type,
            primaryContributionArea: data.primaryContributionArea,
            additionalContributionArea: data.additionalContributionArea,
          },
        },
        { new: true }
      );
      res.status(201).json({ success: true, data: updatedActivity });
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
  },

  onDeleteActivity: async (req, res) => {
    try {
      const deletedActivity = await Activity.deleteOne({ _id: req.query._id });

      res.status(200).json({ success: true, data: deletedActivity });
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
  },
};

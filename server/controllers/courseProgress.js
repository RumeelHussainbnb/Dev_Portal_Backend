import Content from "../models/Content.js";
import UserProgress from "../models/UserProgress.js";
export default {
  onFindOrCreateContentProgress: async (req, res) => {
    try {
      const { courseId, userId } = req.body;

      let contentProgress = await UserProgress.findOne({
        ContentId: courseId,
        UserId: userId,
      });

      if (!contentProgress) {
        contentProgress = await UserProgress.create({
          ContentId: courseId,
          UserId: userId,
        });
        res.status(201).json({ success: true, data: contentProgress });
      } else {
        res.status(200).json({ success: true, data: contentProgress });
      }
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  onGetUserProgress: async (req, res) => {
    try {
      const { userId } = req.query;
      const userProgress = await UserProgress.find({ userId: userId });
      res.status(200).json({ success: true, data: userProgress });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  onUpdateUserProgress: async (req, res) => {
    try {
      const data = req.body;
      const progress = await UserProgress.findOneAndUpdate(
        { userId: data.userId, courseId: data.courseId },
        { complete: data.complete },
        { new: true, upsert: true }
      );
      const previousContentId = await Content.findOne({ _id: data.courseId });
      progress.previousContentId = previousContentId.previousContentId;
      progress.save();
      res.status(200).json({ success: true, data: progress });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },
  onCourseStatusCheck: async (req, res) => {
    try {
      const { userId, courseId } = req.query;
      const contentProgress = await UserProgress.findOne({
        UserId: userId,
        ContentId: courseId,
      });
      res.status(200).json({ success: true, data: contentProgress });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },
};

import Content from "../models/Content";
import ContentProgress from "../models/ContentProgress";
import User from "../models/User";

export default {
  onCreateContentProgress: async (req, res) => {
    try {
      const { courseId, userId } = req.body;
      const contentProgress = await ContentProgress.create({
        ContentId: courseId,
        UserId: userId,
      });
      res.status(201).json({ success: true, data: contentProgress });
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
      const contentProgress = await ContentProgress.find({ UserId: userId });
      res.status(200).json({ success: true, data: contentProgress });
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
      const progress = await ContentProgress.findOneAndUpdate(
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
      const contentProgress = await ContentProgress.findOne({
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

import mongoose from "mongoose";
import Course from "../models/Course.js";
import UserProgress from "../models/UserProgress.js";
export default {
  onFindOrCreateCourseProgress: async (req, res) => {
    try {
      const { courseId, userId } = req.body;
      let CourseProgress = await UserProgress.findOne({
        CourseId: mongoose.Types.ObjectId(courseId),
        UserId: mongoose.Types.ObjectId(userId),
      });
      if (!CourseProgress) {
        CourseProgress = await UserProgress.create({
          CourseId: courseId,
          UserId: userId,
        });
      }
      res.status(200).json({ success: true, data: CourseProgress });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  onGetUserProgress: async (req, res) => {
    try {
      const userId = mongoose.Types.ObjectId(req.query.userId);
      const userProgress = await UserProgress.find({
        UserId: userId,
      });
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
      // update user progress

      const progress = await UserProgress.findOneAndUpdate(
        {
          UserId: mongoose.Types.ObjectId(data.userId),
          CourseId: mongoose.Types.ObjectId(data.courseId),
        },
        {
          completed: data.complete,
        },
        {
          new: true,
        }
      );
      const previousCourse = await Course.findOne({
        _id: mongoose.Types.ObjectId(data.courseId),
      });
      //only update if the course has previous course
      if (previousCourse.previousCourse !== null) {
        progress.PreviousCourseId = previousCourse.previousCourse;
        await progress.save();
      }
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
      const { courseId, userId } = req.params;
      const CourseProgress = await UserProgress.findOne({
        UserId: mongoose.Types.ObjectId(userId),
        CourseId: mongoose.Types.ObjectId(courseId),
      });
      if (!CourseProgress) {
        const userProgress = await UserProgress.create({
          UserId: userId,
          CourseId: courseId,
        });
        res.status(200).json({ success: true, data: userProgress });
      }
      res.status(200).json({ success: true, data: CourseProgress.completed });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  onBatchCreate: async (req, res) => {
    try {
      const { userId } = req.body;

      const courses = await Course.find();
      const coursesId = courses.map((course) => course._id);
      for (let i = 0; i < coursesId.length; i++) {
        try {
          await UserProgress.create({
            UserId: userId,
            CourseId: coursesId[i],
          });
        } catch (error) {
          continue; // continue the loop even if there's an error
        }
      }
      const userProgress = await UserProgress.find({
        UserId: mongoose.Types.ObjectId(userId),
      });

      res.status(200).json({ success: true, data: userProgress });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },
};

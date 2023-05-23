import mongoose from "mongoose";
import Lesson from "../models/Lesson.js";
import UserProgress from "../models/UserProgress.js";
import course from "./courses.js";

export default {
  onFindOrCreateCourseProgress: async (req, res) => {
    try {
      const { courseId, lessonId, userId } = req.body;
      let CourseProgress = await UserProgress.findOne({
        CourseId: courseId,
        LessonId: lessonId,
        UserId: userId,
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
      const { userId } = req.query;
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
          LessonId: mongoose.Types.ObjectId(data.lessonId),
        },
        {
          completed: data.complete,
        },
        {
          new: true,
        }
      );
      const previousCourse = await Course.findOne({
        _id: mongoose.Types.ObjectId(data.lessonId),
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
      const { lessonId, userId } = req.params;
      const CourseProgress = await UserProgress.findOne({
        UserId: userId,
        LessonId: lessonId,
      });
      if (!CourseProgress) {
        const userProgress = await UserProgress.create({
          UserId: userId,
          LessonId: lessonId,
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

      const courses = await course.onGetAllIds();

      // Iterate through each courseId in courses
      for (const courseId in courses) {
        // For each courseId, get its array of lessonIds
        const lessonIds = courses[courseId];

        // For each lessonId, create a UserProgress record
        for (const lessonId of lessonIds) {
          try {
            await UserProgress.create({
              UserId: userId,
              LessonId: lessonId,
              CourseId: courseId,
            });
            console.log("success");
          } catch (error) {
            console.log(error);
            continue; // continue the loop even if there's an error
          }
        }
      }

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
};

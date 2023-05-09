import Course from "../models/Course.js";
import UserProgress from "../models/UserProgress.js";
export default {
  onFindOrCreateCourseProgress: async (req, res) => {
    try {
      const { courseId, userId } = req.body;
      console.log(courseId, userId);
      let CourseProgress = await UserProgress.findOne({
        CourseId: courseId,
        UserId: userId,
      });
      console.log(CourseProgress);
      if (!CourseProgress) {
        CourseProgress = await UserProgress.create({
          CourseId: courseId,
          UserId: userId,
        });
      }
      console.log(CourseProgress);
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
      console.log(data);
      // update user progress

      const progress = await UserProgress.findOneAndUpdate(
        {
          UserId: data.userId,
          CourseId: data.courseId,
        },
        {
          completed: data.complete,
        },
        {
          new: true,
        }
      );
      console.log(progress);
      const previousCourse = await Course.findOne({ _id: data.courseId });
      console.log(previousCourse);
      progress.PreviousCourseId = previousCourse.previousCourse
        ? previousCourse.previousCourse
        : null;
      await progress.save();
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
      const { courseId, userId } = req.query;
      console.log(req.query);
      console.log(courseId, userId);
      const CourseProgress = await UserProgress.findOne({
        UserId: userId,
        CourseId: courseId,
      });
      console.log(CourseProgress);
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
        const courseProgressCheck = await UserProgress.findOne({
          UserId: userId,
          CourseId: courseId,
        });
        if (!courseProgressCheck.complete) {
          await UserProgress.create({
            UserId: userId,
            CourseId: coursesId[i],
          });
        }
      }
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },
};

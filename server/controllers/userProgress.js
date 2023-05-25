import UserProgress from "../models/UserProgress.js";
import course from "./courses.js";

export default {
  onFindOrCreateCourseProgress: async (req, res) => {
    try {
      const data = req.body;
      console.log(req.body);
      let CourseProgress = await UserProgress.findOne(data);
      if (!CourseProgress) {
        CourseProgress = await UserProgress.create(data);
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
      const { userId, courseId } = req.params;

      const courses = await course.onGetAllIdForCourse(courseId);

      const userProgress = await UserProgress.find({
        UserId: userId,
        CourseId: courseId,
      });

      const updatedCourse = {
        _id: courseId,
        moduleId: [],
      };
      let previousLessonCompleted = true;

      for (let module of courses.moduleId) {
        const updatedModule = {
          _id: module._id,
          lessonId: [],
        };

        for (let lesson of module.lessonId) {
          const progress = userProgress.find(
            (progress) => progress.LessonId.toString() === lesson._id.toString()
          );
          const isCompleted = progress ? progress.completed : false;

          const updatedLesson = {
            _id: lesson._id,
            locked: !previousLessonCompleted,
            completed: isCompleted,
            isNotRead: previousLessonCompleted && !isCompleted,
          };

          updatedModule.lessonId.push(updatedLesson);
          previousLessonCompleted = isCompleted;
        }

        updatedModule.totalLesson = updatedModule.lessonId.length;
        updatedModule.totalCompletedLesson = updatedModule.lessonId.filter(
          (lesson) => lesson.completed
        ).length;
        updatedCourse.moduleId.push(updatedModule);
      }

      res.status(200).json({ success: true, data: updatedCourse });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  onUpdateUserProgress: async (req, res) => {
    try {
      const { lessonId, userId, completed } = req.body;
      const progress = await UserProgress.findOneAndUpdate(
        {
          UserId: userId,
          LessonId: lessonId,
        },
        {
          completed: completed,
        },
        {
          new: true,
        }
      );
      res.status(200).json({ success: true, data: progress });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },

  onGetUserProgressByLessonId: async (req, res) => {
    try {
      const { userId, lessonId } = req.params;
      const progress = await UserProgress.findOne({
        UserId: userId,
        LessonId: lessonId,
      });
      res.status(200).json({ success: true, data: progress });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },
};

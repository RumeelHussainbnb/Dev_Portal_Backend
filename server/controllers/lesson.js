import Lesson from "../models/Lesson.js";
import modules from "./modules.js";

export default {
  onCreateLesson: async (req, res) => {
    try {
      const data = req.body;
      let findLesson;
      findLesson = await Lesson.find().sort({ createdDate: -1 }).limit(1);
      findLesson = findLesson.length > 0 ? findLesson[0]._id : null;
      const lesson = await Lesson.create({
        name: data.name,
        markDownContent: data.markDownContent,
        previousLesson: findLesson,
      });
      const module = await modules.onUpdateModuleLesson(
        data.moduleId,
        lesson._id
      );
      res.status(201).json({ success: true, data: lesson, module: module });
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
  },

  onGetAllLesson: async (req, res) => {
    try {
      const lesson = await Lesson.find();
      res.status(200).json({ success: true, data: lesson });
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
  },

  onGetLessonById: async (req, res) => {
    try {
      const { id } = req.params;
      const lesson = await Lesson.findById(id);
      const nextLesson = await Lesson.findOne({
        previousLesson: id,
      });

      let nextLessonId = "null";
      if (nextLesson) {
        nextLessonId = nextLesson._id;
      }

      res.status(200).json({
        success: true,
        data: {
          lesson,
          nextLesson: nextLessonId,
        },
      });
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
  },

  onUpdateLesson: async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const lesson = await Lesson.findByIdAndUpdate(
        { _id: id },
        {
          name: data.name,
          markDownContent: data.markDownContent,
        }
      );
      res.status(200).json({ success: true, data: lesson });
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
  },

  onUpdateLessonContent: async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const lesson = await Lesson.findByIdAndUpdate(
        { _id: id },
        {
          content: data.markDown,
        }
      );

      res.status(200).json({ success: true, data: lesson });
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
  },

  onDeleteLesson: async (req, res) => {
    try {
      const { id } = req.params;

      await Lesson.findByIdAndDelete(id);
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
  },

  onFindNextLesson: async (req, res) => {
    try {
      const { id } = req.params;
      const content = await Lesson.findById({
        _id: id,
      });
      const nextContent = await Lesson.findOne({
        previousContent: content._id,
      });
      res.status(200).json({ success: true, data: nextContent });
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
  },
};

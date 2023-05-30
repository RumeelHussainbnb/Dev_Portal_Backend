import Modules from "../models/modules.js";
import courses from "./courses.js";

export default {
  onCreateModule: async (req, res) => {
    try {
      const { name, courseId } = req.body;
      const module = await Modules.create({
        name: name,
      });
      const course = await courses.onUpdateCourseModule(module._id, courseId);
      res.status(201).json({ success: true, data: module, course: course });
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
  },

  onGetAllModules: async (req, res) => {
    try {
      const modules = await Modules.find();
      res.status(200).json({ success: true, data: modules });
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
  },

  onGetModuleById: async (req, res) => {
    try {
      const { id } = req.params;
      const module = await Modules.findById(id);
      res.status(200).json({ success: true, data: module });
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
  },

  onUpdateModules: async (req, res) => {
    try {
      const data = req.body;
      const module = await Modules.findByIdAndUpdate(
        { _id: data?.id },
        {
          name: data?.name,
        }
      );
      res.status(200).json({ success: true, data: module });
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
  },

  onUpdateModuleLesson: async (moduleId, lessonId) => {
    try {
      const module = await Modules.findById(moduleId).exec();
      module.lessonId.push(lessonId);
      await module.save();
      return module.lessonId;
    } catch (error) {
      return error;
    }
  },

  onGetModuleIdFromLessonId: async (req, res) => {
    try {
      console.log(req.params);
      const { id } = req.params;
      const module = await Modules.findOne({ lessonId: { $in: [id] } }).exec();
      res.status(200).json({ success: true, data: module });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
};

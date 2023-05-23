import Modules from "../models/modules.js";
import courses from "./courses.js";

export default {
  onCreateModule: async (req, res) => {
    try {
      const { name, courseSlug } = req.body;
      const module = await Modules.create({
        name: name,
      });
      console.log(module);
      const course = await courses.onUpdateCourseModule(module._id, courseSlug);
      res.status(201).json({ success: true, data: module, course: course });
    } catch (error) {
      console.log(error);
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

  onGetModuelById: async (req, res) => {
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
      console.log(req.body);
      const module = await Modules.findByIdAndUpdate(
        { _id: data?.id },
        {
          name: data?.name,
          lessonId: data?.lessonId,
        }
      );
      res.status(200).json({ success: true, data: module });
    } catch (error) {
      console.log(error);
      res.status(400).json({ success: false, error: error });
    }
  },

  onUpdateModuleLesson: async (moduleId, lessonId) => {
    try {
      const module = await Modules.findById(moduleId);
      module.lessonId.push(lessonId);
      await module.save();
      return module.lessonId;
    } catch (error) {
      console.log(error);
      return error;
    }
  },
};

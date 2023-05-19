import Modules from "../models/modules.js";

export default {
  onCreateModule: async (req, res) => {
    try {
      const module = await Modules.create({
        name: req.body.name,
      });
      res.status(201).json({ success: true, data: module });
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
  onUpdateModules: async (req, res) => {
    try {
      const { data } = req.body;
      const module = await Modules.findByIdAndUpdate(
        { _id: data.id },
        {
          name: data.name,
          lessonId: data.lessonId,
        }
      );
      res.status(200).json({ success: true, data: module });
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
  },
};

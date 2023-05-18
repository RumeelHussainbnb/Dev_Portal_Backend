import modules from "../models/modules";

export default {
  onCreateModule: async (req, res) => {
    try {
      const module = await modules.create({
        name: req.body.name,
        lessonId: req.body.lessonId,
      });
      res.status(201).json({ success: true, data: module });
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
  },
  onGetAllModules: async (req, res) => {
    try {
      const modules = await modules.find();
      res.status(200).json({ success: true, data: modules });
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
  },
};

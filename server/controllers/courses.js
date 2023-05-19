import Course from "../models/Courses.js";

export default {
  onCreateCourse: async (req, res) => {
    try {
      const course = await Course.create({
        title: req.body.title,
        description: req.body.description,
        slug: req.body.slug,
      });
      res.status(201).json({ success: true, data: course });
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
  },
  onGetAllCourse: async (req, res) => {
    try {
      const course = await Course.find();
      res.status(200).json({ success: true, data: course });
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
  },
  onUpdateCourse: async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const course = await Course.findByIdAndUpdate(
        { _id: id },
        {
          title: data.title,
          description: data.description,
          slug: data.slug,
        }
      );
      res.status(200).json({ success: true, data: course });
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
  },
};

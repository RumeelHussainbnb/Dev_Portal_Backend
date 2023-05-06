import Course from "../models/Course.js";

export default {
  onCreateCourse: async (req, res) => {
    try {
      const data = req.body;

      let findCourse;
      findCourse = await Course.find().sort({ section: -1 }).limit(1);
      findCourse = findCourse.length > 0 ? findCourse[0]._id : null;
      console.log(findCourse);
      const course = await Course.create({
        name: data.name,
        markDownContent: data.markdown,
        section: data.section,
        content: courseContent._id,
        previousCourse: findCourse,
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

  onGetCourseById: async (req, res) => {
    try {
      const { id } = req.params;
      const course = await Course.findById(id);
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
          name: data.name,
          description: data.description,
          section: data.section,
        }
      );
      res.status(200).json({ success: true, data: course });
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
  },

  onUpdateCourseContent: async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const course = await Course.findById(id);
      const courseContent = await CourseContent.findByIdAndUpdate(
        { _id: course.content },
        {
          content: data.markDown,
        }
      );
      res.status(200).json({ success: true, data: courseContent });
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
  },

  onDeleteCourse: async (req, res) => {
    try {
      const { id } = req.params;

      await Course.findByIdAndDelete(id);
      await CourseContent.findByIdAndDelete(course.content);
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
  },

  onFindNextCourse: async (req, res) => {
    try {
      const { id } = req.params;
      const content = await Course.findById({
        _id: id,
      }).populate("User");
      const nextContent = await Course.findOne({
        previousContent: content._id,
      });
      res.status(200).json({ success: true, data: nextContent });
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
  },
};

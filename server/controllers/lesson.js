import Lesson from "../models/Lesson.js";

export default {
  onCreateLesson: async (req, res) => {
    try {
      const data = req.body;
      let findLesson;
      findLesson = await Lesson.find().sort({ id: -1 }).limit(1);
      findLesson = findLesson.length > 0 ? findLesson[0]._id : null;
      const Lesson = await Lesson.create({
        name: data.name,
        markDownContent: data.markdown,
        section: data.section,
        previousLesson: findLesson,
      });
      res.status(201).json({ success: true, data: Lesson });
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
  },

  onGetAllLesson: async (req, res) => {
    try {
      const Lesson = await Lesson.find();
      res.status(200).json({ success: true, data: Lesson });
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
  },

  onGetLessonById: async (req, res) => {
    try {
      const { id } = req.params;
      const Lesson = await Lesson.findById(id);
      const nextLesson = await Lesson.findOne({
        previousLesson: Lesson._id,
      });

      res.status(200).json({
        success: true,
        data: {
          Lesson,
          nextLesson: nextLesson._id || null,
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
      const Lesson = await Lesson.findByIdAndUpdate(
        { _id: id },
        {
          name: data.name,
          description: data.description,
          section: data.section,
        }
      );
      res.status(200).json({ success: true, data: Lesson });
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
  },

  onUpdateLessonContent: async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const Lesson = await Lesson.findById(id);
      const LessonContent = await LessonContent.findByIdAndUpdate(
        { _id: Lesson.content },
        {
          content: data.markDown,
        }
      );
      res.status(200).json({ success: true, data: LessonContent });
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
  },

  onDeleteLesson: async (req, res) => {
    try {
      const { id } = req.params;

      await Lesson.findByIdAndDelete(id);
      await LessonContent.findByIdAndDelete(Lesson.content);
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
      }).populate("User");
      const nextContent = await Lesson.findOne({
        previousContent: content._id,
      });
      res.status(200).json({ success: true, data: nextContent });
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
  },
};

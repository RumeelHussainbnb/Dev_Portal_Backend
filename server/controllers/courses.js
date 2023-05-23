import mongoose from "mongoose";
import Course from "../models/Courses.js";

export default {
  onCreateCourse: async (req, res) => {
    try {
      console.log(req.body);
      const course = await Course.create({
        shortTitle: req.body.shortTitle,
        longTitle: req.body.longTitle,
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
      const course = await Course.findByIdAndUpdate({ _id: id }, data);
      res.status(200).json({ success: true, data: course });
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
  },
  onOnlyReturnName: async (req, res) => {
    try {
      const course = await Course.find().select("_id shortTitle slug");
      res.status(200).json({ success: true, data: course });
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
  },

  onUpdateCourseModule: async (moduleId, courseSlug) => {
    try {
      const course = await Course.findOne(courseSlug);
      course.moduleId.push(moduleId);
      await course.save();
      return course;
    } catch (error) {
      console.log(error);
      return error;
    }
  },

  onGetFullCourse: async (req, res) => {
    try {
      const { id } = req.params;
      console.log(id);
      const course = await Course.aggregate([
        {
          $match: { _id: mongoose.Types.ObjectId(id) }, // Match the specific course by its ID
        },
        {
          $lookup: {
            from: "modules",
            localField: "moduleId",
            foreignField: "_id",
            as: "modules",
          },
        },
        {
          $unwind: {
            path: "$modules",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "lessons",
            localField: "modules.lessonId",
            foreignField: "_id",
            as: "modules.lessons",
          },
        },
        {
          $group: {
            _id: "$_id",
            title: { $first: "$longTitle" },
            description: { $first: "$description" },
            slug: { $first: "$slug" },
            modules: {
              $push: {
                _id: "$modules._id",
                name: "$modules.name",
                lessons: "$modules.lessons",
              },
            },
          },
        },
      ]);
      console.log(course);
      res.status(200).json({ success: true, data: course });
    } catch (error) {
      console.log(error);
      res.status(400).json({ success: false, error: error });
    }
  },

  onGetCourseBySlug: async (req, res) => {
    try {
      const { slug } = req.params;
      const course = await Course.findOne({ slug: slug });
      res.status(200).json({ success: true, data: course });
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
  },

  onGetFullCourseBySlug: async (req, res) => {
    try {
      const { slug } = req.params;
      const course = await Course.aggregate([
        {
          $match: { slug: slug }, // Match the specific course by its ID
        },
        {
          $lookup: {
            from: "modules",
            localField: "moduleId",
            foreignField: "_id",
            as: "modules",
          },
        },
        {
          $unwind: {
            path: "$modules",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "lessons",
            localField: "modules.lessonId",
            foreignField: "_id",
            as: "modules.lessons",
          },
        },
        {
          $group: {
            _id: "$_id",
            longTitle: { $first: "$longTitle" },
            shortTitle: { $first: "$shortTitle" },
            description: { $first: "$description" },
            slug: { $first: "$slug" },
            modules: {
              $push: {
                _id: "$modules._id",
                name: "$modules.name",
                lessons: "$modules.lessons",
              },
            },
          },
        },
      ]);
      res.status(200).json({ success: true, data: course });
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
  },

  onGetAllIds: async () => {
    const courses = await Course.find()
      .select("_id")
      .populate({
        path: "moduleId", // replace with your field name
        select: "_id",
        populate: {
          path: "lessonId", // replace with your field name
          select: "_id",
        },
      });
    const result = courses.reduce((acc, course) => {
      const lessons = (course.moduleId || []).reduce((acc, module) => {
        return [...acc, ...module.lessonId.map((lesson) => lesson._id)];
      }, []);
      acc[course._id] = lessons;
      return acc;
    }, {});
    return result;
  },
};

import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
  shortTitle: {
    type: String,
    required: true,
  },
  longTitle: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  slug: {
    type: String,
    required: true,
  },
  moduleId: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Module",
    },
  ],
});

export default mongoose.model("Course", CourseSchema);

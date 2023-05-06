import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
  markDownContent: {
    type: String,
    required: [true, "Please add a markdown content"],
    trim: true,
  },
  previousCourse: {
    type: mongoose.Types.ObjectId,
    ref: "Course",
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  updatedDate: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Course", CourseSchema);

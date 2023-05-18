import mongoose from "mongoose";

const LessonSchema = new mongoose.Schema({
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
  previousLesson: {
    type: mongoose.Types.ObjectId,
    ref: "Lesson",
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

export default mongoose.model("Lesson", LessonSchema);

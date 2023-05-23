import mongoose from "mongoose";

const UserProgressSchema = new mongoose.Schema({
  LessonId: {
    type: mongoose.Schema.ObjectId,
    ref: "Lesson",
  },
  UserId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  PreviousLessonId: {
    type: mongoose.Schema.ObjectId,
    ref: "Lesson",
  },
  CourseId: {
    type: mongoose.Schema.ObjectId,
    ref: "Course",
  },
  completed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    // required: true
  },
});
UserProgressSchema.index(
  { UserId: 1, LessonId: 1, CourseId: 1 },
  { unique: true }
);

export default mongoose.model("UserProgress", UserProgressSchema);

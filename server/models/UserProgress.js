import mongoose from "mongoose";

const UserProgressSchema = new mongoose.Schema({
  CourseId: {
    type: mongoose.Schema.ObjectId,
    ref: "Course",
  },
  UserId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  PreviousCourseId: {
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

export default mongoose.model("UserProgress", UserProgressSchema);

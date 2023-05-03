import mongoose from "mongoose";

const LessonProgressSchema = new mongoose.Schema({
  ContentId: {
    type: mongoose.Schema.ObjectId,
  },
  UserId: {
    type: mongoose.Schema.ObjectId,
  },
  PreviousContentId: {
    type: mongoose.Schema.ObjectId,
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

const LessonProgress = mongoose.model("LessonProgress", LessonProgressSchema);

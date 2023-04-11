import mongoose from 'mongoose';
const { Schema } = mongoose;

const QuestionSchema = new mongoose.Schema({
  QuestionTitle: {
    type: String,
    require: true,
    trim: true,
    maxlength: [100, 'Question cannot be more than 2048 characters'],
  },
  A: {
    type: String,
    require: true,
    trim: true,
    maxlength: [100, 'Option A cannot be more than 100 characters'],
  },
  B: {
    type: String,
    require: true,
    trim: true,
    maxlength: [100, 'Option B  cannot be more than 100 characters'],
  },
  C: {
    type: String,
    require: true,
    trim: true,
    maxlength: [100, 'Option C  cannot be more than 100 characters'],
  },
  D: {
    type: String,
    require: true,
    trim: true,
    maxlength: [100, 'Option D  cannot be more than 100 characters'],
  },

  CorrectOption: {
    type: String,
    maxlength: [100, 'CorrectOption cannot be more than 100 characters'],
  },
});

const QuizSchema = new mongoose.Schema(
  {
    CourseId: { type: Schema.Types.ObjectId, ref: 'Course' },
    Title: {
      type: String,
      require: true,
      trim: true,
      maxlength: [100, 'Title Name cannot be more than 100 characters'],
    },
    Description: {
      type: String,
      require: true,
      trim: true,
      maxlength: [20000, 'Description cannot be more than 20000 characters'],
    },
    Questions: [QuestionSchema],
  },
  { timestamps: true }
);

export default mongoose.model('Quiz', QuizSchema);

import mongoose from 'mongoose';
const { Schema } = mongoose;

const CompletedQuizSchema = new mongoose.Schema(
  {
    CourseId: { type: Schema.Types.ObjectId, ref: 'Course' },
    UserId: { type: Schema.Types.ObjectId, ref: 'User' },
    QuizId: { type: Schema.Types.ObjectId, ref: 'Quiz' },
    TotalQuestions: {
      type: Number,
    },
    TotalScore: {
      type: Number,
    },
    CorrectAnswers: {
      type: Number,
    },
    WrongAnswers: {
      type: Number,
    },
    Percentage: {
      type: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.model('CompletedQuiz', CompletedQuizSchema);

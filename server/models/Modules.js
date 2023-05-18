import mongoose from "mongoose";

const ModuleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  lessonId: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Lesson",
    },
  ],
});

export default mongoose.model("Module", ModuleSchema);

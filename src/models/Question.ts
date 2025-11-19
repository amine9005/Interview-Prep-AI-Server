import mongoose, { HydratedDocument, InferSchemaType } from "mongoose";
import Question from "./Question";

const questionSchema = new mongoose.Schema(
  {
    session: { type: mongoose.Schema.ObjectId, ref: "Session" },
    question: String,
    answer: String,
    note: String,
    isPinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const QuestionModel = mongoose.model("Question", questionSchema);

export default QuestionModel;
export type Question = InferSchemaType<typeof questionSchema>;
export type QuestionDocument = HydratedDocument<Question>;

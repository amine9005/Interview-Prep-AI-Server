import mongoose, { HydratedDocument, InferSchemaType } from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    role: { type: String, required: true },
    experience: { type: String, required: true },
    topicToFocus: { type: String, required: true },
    description: String,
    questions: [{ type: mongoose.Schema.ObjectId, ref: "Question" }],
  },
  { timestamps: true }
);

const SessionModel = mongoose.model("Session", sessionSchema);
export default SessionModel;
export type Session = InferSchemaType<typeof sessionSchema>;
export type SessionDocument = HydratedDocument<Session>;

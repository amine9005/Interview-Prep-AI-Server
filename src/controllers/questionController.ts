import QuestionModel from "../models/Question";
import SessionModel from "../models/Session";
import { Request, Response } from "express";
import { QuestionDocument } from "../models/Question";

export const togglePinQuestion = async (req: Request, res: Response) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Missing session_id or question",
      });
    }

    const questionToUpdate = await QuestionModel.findById(question);

    if (!questionToUpdate) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    questionToUpdate.isPinned = !questionToUpdate.isPinned;

    await questionToUpdate.save();

    return res.status(200).json({
      success: true,
      message: "Question pinned status updated",
      data: questionToUpdate,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error in toggle pinned question",
      error,
    });
  }
};
export const addQuestionsToSession = async (req: Request, res: Response) => {
  try {
    const { session_id, questions } = req.body;
    if (!session_id || !questions) {
      return res.status(400).json({
        success: false,
        message: "Missing session_id or questions",
      });
    }
    const session = await SessionModel.findById(session_id);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }
    const createdQuestions = await QuestionModel.insertMany(
      questions.map((q: QuestionDocument) => ({
        answer: q.answer,
        question: q.question,
        session: session_id,
      }))
    );

    session.questions.push(...createdQuestions.map((q) => q._id));
    await session.save();
    return res.status(200).json({
      success: true,
      message: "Questions added to session",
      data: session,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error in adding questions",
      error,
    });
  }
};
export const updateQuestionNote = async (req: Request, res: Response) => {
  try {
    const { note } = req.body;

    if (!note) {
      return res.status(400).json({
        success: false,
        message: "Missing question_id or note",
      });
    }

    const question = await QuestionModel.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }
    question.note = note;
    await question.save();

    return res.status(200).json({
      success: true,
      message: "Question note updated",
      data: question,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error in adding questions",
      error,
    });
  }
};

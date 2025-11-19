import { Response } from "express";
import SessionModel from "../models/Session";
import { CustomRequest } from "../types/types";
import QuestionModel, { QuestionDocument } from "../models/Question";

export const getMySessions = async (req: CustomRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
        error: "You are not logged in",
      });
    }
    const userId = req.user.id;
    await SessionModel.find({
      user: userId,
    })
      .sort({ createdAt: -1 })
      .populate("questions")
      .then((sessions) => {
        res.status(200).json({
          success: true,
          message: "Sessions fetched successfully",
          data: sessions,
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          success: true,
          message: "Failed to find sessions in DB",
          error,
        });
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: true,
      message: "Server error in finding sessions",
      error,
    });
  }
};
export const createSession = async (req: CustomRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
        error: "You are not logged in",
      });
    }

    const { role, experience, topicToFocus, description, questions } = req.body;
    const userId = req.user.id;

    const session = await SessionModel.create({
      user: userId,
      role,
      experience,
      topicToFocus,
      description,
    }).catch((error) => {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Failed to create session in DB",
        error,
      });
    });
    if (!session) {
      return res.status(500).json({
        success: false,
        message: "Failed to create session in DB",
      });
    }

    const questionsDoc = await Promise.all(
      questions.map(async (q: QuestionDocument) => {
        const question = await QuestionModel.create({
          session: session._id,
          question: q.question,
          answer: q.answer,
        });
        return question._id;
      })
    ).catch((error) => {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Failed to create questions in DB",
        error,
      });
    });

    if (!questionsDoc) {
      return res.status(500).json({
        success: false,
        message: "Failed to create questions in DB",
      });
    }
    session.questions = questionsDoc;
    await session.save();
    res.status(200).json({
      success: true,
      message: "Session created successfully",
      data: session,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error in creating session",
      error,
    });
  }
};
export const deleteSession = async (req: CustomRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const { id } = req.params;
    const session = await SessionModel.findById(id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Failed to find session in DB",
      });
    }

    if (!session.user) {
      return res.status(404).json({
        success: false,
        message: "Failed to find user in DB user is removed from database",
      });
    }

    if (session.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
        error: "You are not authorized to delete this session",
      });
    }

    await QuestionModel.deleteMany({ session: id }).catch((error) => {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Failed to delete Questions from DB",
        error,
      });
    });

    await session
      .deleteOne()
      .then(() => {
        res.status(200).json({
          success: true,
          message: "Session deleted successfully",
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          success: false,
          message: "Failed to delete session in DB",
          error,
        });
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error in deleting session",
      error,
    });
  }
};
export const getSessionById = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params;

    const session = await SessionModel.findById(id).catch((error) => {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Database error in getting session",
        error,
      });
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Failed to find session in DB",
      });
    }

    if (session.user!.toString() !== req.user!.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Session fetched successfully",
      data: session,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error in getting session",
      error,
    });
  }
};

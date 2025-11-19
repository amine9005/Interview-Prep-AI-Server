import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { Request, Response } from "express";
import {
  conceptExplanationPrompt,
  questionAnswerPrompt,
} from "../utils/prompts";
dotenv.config();

const genai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export const generateQuestions = async (req: Request, res: Response) => {
  const { role, experience, topicToFocus, numberOfQuestions } = req.body;

  if (!role || !experience || !topicToFocus || !numberOfQuestions) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  try {
    const rawText = await genai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: questionAnswerPrompt(
        role,
        experience,
        topicToFocus,
        numberOfQuestions
      ),
      config: {
        temperature: 0.1,
      },
    });

    if (!rawText.text) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate questions",
        error: rawText,
      });
    }

    const cleanedText = rawText.text
      .replace(/^```json\s*/, "")
      .replace(/```$/, "")
      .trim();

    const data = JSON.parse(cleanedText);
    return res.status(200).json({
      success: true,
      message: "Successfully created questions",
      data,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to generate questions", error });
  }
};

export const generateConceptExplanation = async (
  req: Request,
  res: Response
) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const rawText = await genai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: conceptExplanationPrompt(question),
      config: {
        temperature: 0.1,
      },
    });

    if (!rawText.text) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate concept explanation",
        error: rawText,
      });
    }

    const cleanedText = rawText.text
      .replace(/^```json\s*/, "")
      .replace(/```$/, "")
      .trim();

    const data = JSON.parse(cleanedText);
    return res.status(200).json({
      success: true,
      message: "Successfully created concept explanation",
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to concept explanation",
      error,
    });
  }
};

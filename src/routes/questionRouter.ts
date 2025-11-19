import express from "express";
import {
  addQuestionsToSession,
  togglePinQuestion,
  updateQuestionNote,
} from "../controllers/questionController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/add", protect, addQuestionsToSession);
router.put("/toggle-pin", protect, togglePinQuestion);
router.put("/:id/update-note", protect, updateQuestionNote);

export default router;

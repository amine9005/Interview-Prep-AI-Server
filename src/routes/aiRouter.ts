import express from "express";
import {
  generateConceptExplanation,
  generateQuestions,
} from "../controllers/aiController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/generate-session", protect, generateQuestions);
router.post("/generate-explanation", protect, generateConceptExplanation);

export default router;

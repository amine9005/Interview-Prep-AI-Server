import {
  getMySessions,
  deleteSession,
  getSessionById,
  createSession,
} from "../controllers/sessionController";

import { protect } from "../middleware/authMiddleware";
import express from "express";

const router = express.Router();

router.get("/my-sessions", protect, getMySessions);
router.get("/:id", protect, getSessionById);
router.post("/create", protect, createSession);
router.delete("/delete/:id", protect, deleteSession);

export default router;

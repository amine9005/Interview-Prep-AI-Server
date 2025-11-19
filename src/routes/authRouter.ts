import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  uploadImage,
} from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";
import { imageUpload } from "../config/multer";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/upload-image", imageUpload.single("image"), uploadImage);

router.get("/profile", protect, getUserProfile);

export default router;

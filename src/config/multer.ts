import multer from "multer";
import { Request } from "express";

const storage = multer.diskStorage({});

const imageFilter = (req: Request, file: Express.Multer.File, cb: Function) => {
  const allowedImages = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedImages.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload an image"), false);
  }
};

export const imageUpload = multer({ storage });

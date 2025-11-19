import User, { UserDocument } from "../models/User";
import bycrpt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { Types } from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import { CustomRequest } from "../types/types";

const generateToken = (userId: Types.ObjectId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password, profileImageURL } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required ",
        error: "All fields are required",
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
        error: "User already exists",
      });
    }

    const salt = await bycrpt.genSalt(10);
    const hashedPassword = await bycrpt.hash(password, salt);

    await User.create({
      username,
      email,
      password: hashedPassword,
      profileImageURL,
    })
      .then((user) => {
        return res.status(201).json({
          success: true,
          message: "User created successfully",
          user,
          token: generateToken(user._id),
        });
      })
      .catch((error) => {
        return res.status(500).json({
          success: false,
          message: "Error in saving user to database",
          error,
        });
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error in creating user",
      error,
    });
  }
};
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
        error: "Invalid email or password",
      });
    }

    const isMatch = await bycrpt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
        error: "Invalid email or password",
      });
    }
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user,
      token: generateToken(user._id),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error in user login",
      error,
    });
  }
};
export const getUserProfile = async (req: CustomRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: "User not Found",
        error: "User not Found",
      });
    }

    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error in fetching user profile",
      error,
    });
  }
};

export const updateProfileImage = async (req: CustomRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: "User not Found",
        error: "User not Found",
      });
    }

    const image = req.file;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Image not found",
        error: "Image not found",
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not Found",
        error: "User not Found",
      });
    }

    const { secure_url } = await cloudinary.uploader.upload(image.path);
    user.profileImageURL = secure_url;
    await user
      .save()
      .then((user) => {
        return res.status(200).json({
          success: true,
          message: "User profile image updated successfully",
          user,
        });
      })
      .catch((error) => {
        return res.status(500).json({
          success: false,
          message: "unable to save user image to database",
          error,
        });
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error in fetching user profile",
      error,
    });
  }
};

export const uploadImage = async (req: Request, res: Response) => {
  try {
    const image = req.file;
    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Image not found",
        error: "Image not found",
      });
    }
    await cloudinary.uploader
      .upload(image.path)
      .then((result) => {
        const { secure_url } = result;
        res.status(200).json({
          success: true,
          message: "Image uploaded successfully",
          image: secure_url,
        });
      })
      .catch((error) => {
        return res.status(500).json({
          success: false,
          message: "Cloudinary Error in uploading image",
          error,
        });
      });
    console.log("image uploaded");
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error in uploading image",
      error,
    });
  }
};

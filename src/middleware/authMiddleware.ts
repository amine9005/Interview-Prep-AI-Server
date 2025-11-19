import { Request, Response, NextFunction } from "express";
import User, { type UserDocument } from "../models/User";
import jwt, { JwtPayload } from "jsonwebtoken";
import { CustomRequest } from "../types/types";

export const protect = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token = req.headers.authorization;

    if (token && token.startsWith("Bearer")) {
      token = token.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } else {
      res.status(401).json({ success: false, message: "Not authorized" });
    }
  } catch (error) {
    res
      .status(401)
      .json({ success: false, message: "Token Failed", error: error });
  }
};

import { Request } from "express";
import { UserDocument } from "../models/User";

export interface CustomRequest extends Request {
  user?: UserDocument | null;
}

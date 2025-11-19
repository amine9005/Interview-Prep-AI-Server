import express, { Request, Response } from "express";
import authRouter from "./routes/authRouter";
import cors from "cors";
import dotenv from "dotenv";
import sessionRouter from "./routes/sessionRouter";
import questionRouter from "./routes/questionRouter";
import aiRouter from "./routes/aiRouter";
dotenv.config();

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN,
  })
);

app.use("/api/user", authRouter);
app.use("/api/session", sessionRouter);
app.use("/api/question", questionRouter);
app.use("/api/ai", aiRouter);

app.use("/", (req: Request, res: Response) => {
  res.status(200).send("Server is Live");
});

export default app;

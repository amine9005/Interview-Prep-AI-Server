import mongoose from "mongoose";
import app from "./server";
import dotenv from "dotenv";
import connectCloudinary from "./config/cloudinaryConfig";

dotenv.config();

const port = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_DB_URI as string)
  .then(() => {
    console.log("connected to MongoDB");
    connectCloudinary()
      .then(() => {
        console.log("connected to Cloudinary");
        app.listen(port, () => {
          console.log(`Server running on port ${port}`);
        });
      })
      .catch((err) => {
        console.log("Error connecting to Cloudinary:", err);
      });
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB:", err);
  });

import mongoose from "mongoose";

import logger from "./logger.js";

export default async function connectDB(uri: string) {
  await mongoose.connect(uri);
  logger.info("Database connected successfully");
}

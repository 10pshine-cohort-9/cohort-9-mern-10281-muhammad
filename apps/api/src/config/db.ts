import mongoose from "mongoose";

import logger from "./logger.js";

export default async function connectDB(uri: string): Promise<void> {
  await mongoose.connect(uri);
  logger.info("Database connected successfully");
}

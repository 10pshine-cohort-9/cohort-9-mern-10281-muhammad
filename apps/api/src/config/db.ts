import mongoose from "mongoose";

import logger from "./logger.js";

export default async function connectDB(uri: string) {
  try {
    await mongoose.connect(uri);
    logger.info("Database connected successfully");
  } catch (error) {
    logger.error({ err: error }, "Database connection failed");
    process.exit(1);
  }
}

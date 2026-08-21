import mongoose from "mongoose";
import logger from "../../config/logger.js";
import { DBStatus, HealthResponse } from "./health.types.js";

export default class HealthService {
  check = async (): Promise<HealthResponse> => {
    const uptime = process.uptime();
    const timestamp = new Date().toISOString();

    let dbStatus: DBStatus = "down";

    try {
      if (mongoose.connection.readyState === 1) {
        dbStatus = "up";
      } else {
        await mongoose.connection.db?.admin().ping();
        dbStatus = "up";
      }
    } catch (error) {
      logger.error({ error }, "Error connecting to database");
      dbStatus = "down";
    }

    const status = dbStatus === "up" ? "ok" : "degraded";

    return {
      status,
      uptime,
      timestamp,
      services: {
        database: dbStatus,
      },
    };
  };
}

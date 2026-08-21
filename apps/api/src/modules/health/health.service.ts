import mongoose from "mongoose";
import logger from "../../config/logger.js";
import { DBStatus, HealthResponse } from "./health.types.js";

export default class HealthService {
  check = async (): Promise<HealthResponse> => {
    const uptime = process.uptime();
    const timestamp = new Date().toISOString();

    let dbStatus: DBStatus = "down";

    try {
      const conn = mongoose.connection;
      const db = conn.db;

      if (conn.readyState === 1 && db) {
        await db.admin().ping();
        dbStatus = "up";
      }
    } catch (error) {
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

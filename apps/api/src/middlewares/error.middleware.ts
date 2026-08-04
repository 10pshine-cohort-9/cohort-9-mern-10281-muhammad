import { Request, Response, NextFunction } from "express";

import ApiError from "../utils/api-error.js";
import logger from "../config/logger.js";

export default function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  logger.error({ err });

  if (err instanceof ApiError) {
    return res
      .status(err.statusCode)
      .json({ success: false, message: err.message, errors: err.errors });
  }

  return res
    .status(500)
    .json({ success: false, message: "Internal Server Error" });
}

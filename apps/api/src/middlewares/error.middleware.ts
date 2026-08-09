import { Request, Response, NextFunction } from "express";

import ApiError from "../utils/api-error.js";
import logger from "../config/logger.js";
import { z } from "zod";
import { sendResponse } from "../utils/send-response.js";

export default function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  logger.error({ err });

  if (err instanceof z.ZodError) {
    return sendResponse(
      res,
      400,
      null,
      "Validation failed",
      z.treeifyError(err),
    );
  }

  if (err instanceof ApiError) {
    return sendResponse(res, err.statusCode, null, err.message, err.errors);
  }

  return sendResponse(res, 500, null, "Internal Server Error");
}

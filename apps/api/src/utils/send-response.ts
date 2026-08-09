import { Response } from "express";
import ApiResponse from "./api-response.js";

export function sendResponse<T = unknown>(
  res: Response,
  statusCode: number,
  data: T | null,
  message = "Success",
  errors?: unknown,
) {
  return res
    .status(statusCode)
    .json(new ApiResponse<T>(statusCode, data, message, errors));
}

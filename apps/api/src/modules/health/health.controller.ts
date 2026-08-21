import { Request, Response } from "express";

import { sendResponse } from "../../utils/send-response.js";
import HealthService from "./health.service.js";

export default class HealthController {
  constructor(private service: HealthService) {}

  check = async (_req: Request, res: Response): Promise<void> => {
    const result = await this.service.check();

    const statusCode = result.status === "ok" ? 200 : 503;

    sendResponse(res, statusCode, result, "Health check completed");
  };
}

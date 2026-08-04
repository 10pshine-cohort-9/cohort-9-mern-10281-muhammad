import { Router } from "express";
import ApiResponse from "../../utils/api-response.js";

const router = Router();

router.get("/", (_, res) => {
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        status: "ok",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      },
      "API is healthy",
    ),
  );
});

export default router;

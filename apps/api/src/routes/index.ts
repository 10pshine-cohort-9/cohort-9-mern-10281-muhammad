import { Router } from "express";

import authRouter from "../modules/auth/auth.routes.js";
import healthRouter from "../modules/health/health.route.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/health", healthRouter);

export default router;

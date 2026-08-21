import { Router } from "express";

import authRouter from "../modules/auth/auth.routes.js";
import healthRouter from "../modules/health/health.routes.js";
import notesRouter from "../modules/notes/notes.routes.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/health", healthRouter);
router.use("/notes", notesRouter);

export default router;

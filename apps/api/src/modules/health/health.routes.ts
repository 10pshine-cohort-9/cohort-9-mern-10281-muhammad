import { Router, Request, Response } from "express";

import HealthController from "./health.controller.js";
import HealthService from "./health.service.js";

const router = Router();

const service = new HealthService();
const controller = new HealthController(service);

router.get("/", controller.check);

export default router;

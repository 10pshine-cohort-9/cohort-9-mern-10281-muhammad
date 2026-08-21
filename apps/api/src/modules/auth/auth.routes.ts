import { Router } from "express";

import validate from "../../middlewares/validate.middleware.js";
import { loginSchema, registerSchema } from "./auth.schema.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import AuthController from "./auth.controller.js";
import UserRepository from "../user/user.repository.js";
import AuthService from "./auth.service.js";

const router = Router();

const repository = new UserRepository();
const service = new AuthService(repository);
const controller = new AuthController(service);

router.post("/register", validate(registerSchema), controller.register);
router.post("/login", validate(loginSchema), controller.login);
router.post("/logout", controller.logout);
router.get("/me", authenticate, controller.me);
router.get("/refresh", controller.refresh);

export default router;

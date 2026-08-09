import { Router } from "express";

import authController from "./auth.controller.js";
import validate from "../../middlewares/validate.middleware.js";
import { loginSchema, registerSchema } from "./auth.schema.js";
import { authenticate } from "../../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post("/register", validate(registerSchema), authController.register);
authRouter.post("/login", validate(loginSchema), authController.login);
authRouter.post("/logout", authController.logout);
authRouter.get("/me", authenticate, authController.me);
authRouter.get("/refresh", authController.refresh);

export default authRouter;

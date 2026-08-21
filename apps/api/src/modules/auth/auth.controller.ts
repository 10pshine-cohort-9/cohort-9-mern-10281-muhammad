import { Request, Response } from "express";

import { sendResponse } from "../../utils/send-response.js";
import { LoginInput, RegisterInput } from "./auth.schema.js";
import AuthService from "./auth.service.js";

export default class AuthController {
  constructor(private service: AuthService) {}

  register = async (
    req: Request<{}, {}, RegisterInput>,
    res: Response,
  ): Promise<void> => {
    const { username, email, password } = req.body;

    const { accessToken, user } = await this.service.register(
      res,
      username,
      email,
      password,
    );

    sendResponse(
      res,
      201,
      {
        user: { id: user._id, username: user.username, email: user.email },
        accessToken,
      },
      "User registered successfully",
    );
  };

  login = async (
    req: Request<{}, {}, LoginInput>,
    res: Response,
  ): Promise<void> => {
    const { usernameOrEmail, password } = req.body;

    const { accessToken, user } = await this.service.login(
      res,
      usernameOrEmail,
      password,
    );

    sendResponse(
      res,
      200,
      {
        user: { id: user._id, username: user.username, email: user.email },
        accessToken,
      },
      "User logged in successfully",
    );
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    await this.service.logout(res, req.user!);

    sendResponse(res, 200, null, "User logged out successfully");
  };

  me(req: Request, res: Response): void {
    const user = req.user!;

    sendResponse(res, 200, {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  }

  refresh = async (req: Request, res: Response): Promise<void> => {
    const { accessToken, user } = await this.service.refresh(
      res,
      req.cookies.refreshToken,
    );

    sendResponse(
      res,
      200,
      {
        user: { id: user._id, username: user.username, email: user.email },
        accessToken,
      },
      "Token refreshed successfully",
    );
  };
}

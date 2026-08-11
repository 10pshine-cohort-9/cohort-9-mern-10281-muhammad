import { Request, Response } from "express";

import userRepository from "../user/user.repository.js";
import { ConflictError, UnauthorizedError } from "../../utils/http-errors.js";
import { sendResponse } from "../../utils/send-response.js";
import {
  CLEAR_REFRESH_TOKEN_OPTIONS,
  compareRefreshToken,
  createAccessToken,
  createRefreshToken,
  hashRefreshToken,
  REFRESH_TOKEN_OPTIONS,
  verifyRefreshToken,
} from "../../utils/jwt.js";
import { LoginInput, RegisterInput } from "./auth.schema.js";
import mongoose from "mongoose";

class AuthController {
  async register(req: Request<{}, {}, RegisterInput>, res: Response) {
    const { username, email, password } = req.body;

    const isAlreadyRegistered = await userRepository.findByUsernameOrEmail(
      username,
      email,
    );

    if (isAlreadyRegistered) {
      throw new ConflictError("Username or email already exists.");
    }

    const user = await userRepository.create({ username, email, password });

    const id = user._id.toString();

    const accessToken = createAccessToken(id);

    const refreshToken = createRefreshToken(id);

    user.refreshToken = hashRefreshToken(refreshToken);
    await user.save();

    res.cookie("refreshToken", refreshToken, REFRESH_TOKEN_OPTIONS);

    return sendResponse(
      res,
      201,
      {
        user: { id, username: user.username, email: user.email },
        accessToken,
      },
      "User registered successfully",
    );
  }

  async login(req: Request<{}, {}, LoginInput>, res: Response) {
    const { usernameOrEmail, password } = req.body;

    const user =
      await userRepository.findByUsernameOrEmailWithPassword(usernameOrEmail);

    if (!user) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const id = user._id.toString();

    const accessToken = createAccessToken(id);

    const refreshToken = createRefreshToken(id);

    user.refreshToken = hashRefreshToken(refreshToken);
    await user.save();

    res.cookie("refreshToken", refreshToken, REFRESH_TOKEN_OPTIONS);

    return sendResponse(
      res,
      200,
      {
        user: { id, username: user.username, email: user.email },
        accessToken,
      },
      "User logged in successfully",
    );
  }

  async logout(req: Request, res: Response) {
    const user = req.user!;

    user.refreshToken = null;
    await user.save();

    res.clearCookie("refreshToken", CLEAR_REFRESH_TOKEN_OPTIONS);

    return sendResponse(res, 200, null, "User logged out successfully");
  }

  me(req: Request, res: Response) {
    const user = req.user!;

    return sendResponse(res, 200, {
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
      },
    });
  }

  async refresh(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedError("Refresh token not found");
    }

    const decoded = verifyRefreshToken(refreshToken);

    const user = await userRepository.findById(
      new mongoose.Types.ObjectId(decoded.id),
    );

    if (!user || !user.refreshToken) {
      throw new UnauthorizedError("Invalid refresh token");
    }

    if (!compareRefreshToken(refreshToken, user.refreshToken)) {
      throw new UnauthorizedError("Invalid refresh token");
    }

    const accessToken = createAccessToken(decoded.id);

    const newRefreshToken = createRefreshToken(decoded.id);

    user.refreshToken = hashRefreshToken(newRefreshToken);
    await user.save();

    res.cookie("refreshToken", newRefreshToken, REFRESH_TOKEN_OPTIONS);

    return sendResponse(
      res,
      200,
      { accessToken },
      "Token refreshed successfully",
    );
  }
}

const authController = new AuthController();

export default authController;

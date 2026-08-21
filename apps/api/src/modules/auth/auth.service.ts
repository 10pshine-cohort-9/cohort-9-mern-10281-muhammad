import { Response } from "express";
import { ConflictError, UnauthorizedError } from "../../utils/http-errors.js";
import {
  CLEAR_REFRESH_TOKEN_OPTIONS,
  compareRefreshToken,
  createAccessToken,
  createRefreshToken,
  hashRefreshToken,
  REFRESH_TOKEN_OPTIONS,
  verifyRefreshToken,
} from "../../utils/jwt.js";
import UserRepository from "../user/user.repository.js";
import { UserDocument } from "../user/user.types.js";
import mongoose from "mongoose";

export default class AuthService {
  constructor(private repository: UserRepository) {}

  register = async (
    res: Response,
    username: string,
    email: string,
    password: string,
  ) => {
    const isAlreadyRegistered = await this.repository.findByUsernameOrEmail(
      username,
      email,
    );

    if (isAlreadyRegistered) {
      throw new ConflictError("Username or email already exists.");
    }

    const user = await this.repository.create({ username, email, password });

    const accessToken = await this.issueTokens(res, user);

    return { accessToken, user };
  };

  login = async (res: Response, usernameOrEmail: string, password: string) => {
    const user =
      await this.repository.findByUsernameOrEmailWithPassword(usernameOrEmail);

    if (!user) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const accessToken = await this.issueTokens(res, user);

    return { accessToken, user };
  };

  logout = async (res: Response, user: UserDocument): Promise<void> => {
    user.refreshToken = null;
    await user.save();

    res.clearCookie("refreshToken", CLEAR_REFRESH_TOKEN_OPTIONS);
  };

  refresh = async (res: Response, refreshToken: string) => {
    if (!refreshToken) {
      throw new UnauthorizedError("Refresh token not found");
    }

    const decoded = verifyRefreshToken(refreshToken);

    const user = await this.repository.findById(
      new mongoose.Types.ObjectId(decoded.id),
    );

    if (!user || !user.refreshToken) {
      throw new UnauthorizedError("Invalid refresh token");
    }

    if (!compareRefreshToken(refreshToken, user.refreshToken)) {
      throw new UnauthorizedError("Invalid refresh token");
    }

    const accessToken = await this.issueTokens(res, user);

    return { accessToken, user };
  };

  private issueTokens = async (
    res: Response,
    user: UserDocument,
  ): Promise<string> => {
    const id = user._id.toString();

    const accessToken = createAccessToken(id);
    const refreshToken = createRefreshToken(id);

    user.refreshToken = hashRefreshToken(refreshToken);
    await user.save();

    this.createRefreshTokenCookie(res, refreshToken);

    return accessToken;
  };

  private createRefreshTokenCookie = (res: Response, refreshToken: string) => {
    res.cookie("refreshToken", refreshToken, REFRESH_TOKEN_OPTIONS);
  };
}

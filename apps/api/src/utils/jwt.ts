import jwt from "jsonwebtoken";

import env from "../config/env.js";
import { UnauthorizedError } from "./http-errors.js";
import { CookieOptions } from "express";

export interface TokenPayload {
  id: string;
}

export function createAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.ACCESS_SECRET, { expiresIn: "15m" });
}

export function createRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.REFRESH_SECRET, { expiresIn: "7d" });
}

export function verifyAccessToken(token: string): TokenPayload {
  const decoded = jwt.verify(token, env.ACCESS_SECRET);

  if (typeof decoded === "string" || typeof decoded.id !== "string") {
    throw new UnauthorizedError("Invalid token");
  }

  return {
    id: decoded.id,
  };
}

export function verifyRefreshToken(token: string): TokenPayload {
  const decoded = jwt.verify(token, env.REFRESH_SECRET);

  if (typeof decoded === "string" || typeof decoded.id !== "string") {
    throw new UnauthorizedError("Invalid token");
  }

  return {
    id: decoded.id,
  };
}

const OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
};

export const REFRESH_TOKEN_OPTIONS: CookieOptions = {
  ...OPTIONS,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const CLEAR_REFRESH_TOKEN_OPTIONS: CookieOptions = { ...OPTIONS };

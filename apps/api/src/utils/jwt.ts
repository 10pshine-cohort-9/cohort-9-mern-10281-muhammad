import crypto from "node:crypto";
import jwt from "jsonwebtoken";

import env from "../config/env.js";
import { UnauthorizedError } from "./http-errors.js";
import { CookieOptions } from "express";

type TokenType = "access" | "refresh";

export interface TokenPayload {
  id: string;
  type: TokenType;
}

export function createAccessToken(id: string): string {
  return jwt.sign({ id, type: "access" }, env.ACCESS_SECRET, {
    expiresIn: "15m",
  });
}

export function createRefreshToken(id: string): string {
  return jwt.sign({ id, type: "refresh" }, env.REFRESH_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyAccessToken(token: string): TokenPayload {
  try {
    const decoded = jwt.verify(token, env.ACCESS_SECRET);

    if (
      typeof decoded !== "object" ||
      decoded === null ||
      typeof decoded.id !== "string" ||
      decoded.type !== "access"
    ) {
      throw new UnauthorizedError("Invalid token");
    }

    return {
      id: decoded.id,
      type: "access",
    };
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw error;
    }

    throw new UnauthorizedError("Invalid token");
  }
}

export function verifyRefreshToken(token: string): TokenPayload {
  try {
    const decoded = jwt.verify(token, env.REFRESH_SECRET);

    if (
      typeof decoded !== "object" ||
      decoded === null ||
      typeof decoded.id !== "string" ||
      decoded.type !== "refresh"
    ) {
      throw new UnauthorizedError("Invalid token");
    }

    return {
      id: decoded.id,
      type: "refresh",
    };
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw error;
    }

    throw new UnauthorizedError("Invalid token");
  }
}

const OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax" as const,
};

export const REFRESH_TOKEN_OPTIONS: CookieOptions = {
  ...OPTIONS,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const CLEAR_REFRESH_TOKEN_OPTIONS: CookieOptions = { ...OPTIONS };

export function hashRefreshToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function compareRefreshToken(token: string, hash: string): boolean {
  const tokenHash = hashRefreshToken(token);

  return crypto.timingSafeEqual(
    Buffer.from(tokenHash, "hex"),
    Buffer.from(hash, "hex"),
  );
}

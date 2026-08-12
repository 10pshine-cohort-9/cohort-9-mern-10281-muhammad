import { NextFunction, Request, Response } from "express";

import { UnauthorizedError } from "../utils/http-errors.js";
import userRepository from "../modules/user/user.repository.js";
import { verifyAccessToken } from "../utils/jwt.js";

export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    throw new UnauthorizedError("Authentication required");
  }

  const token = authorization.split(" ")[1];

  const decoded = verifyAccessToken(token);

  const user = await userRepository.findById(decoded.id);

  if (!user) {
    throw new UnauthorizedError("User not found");
  }

  req.user = user;

  next();
}

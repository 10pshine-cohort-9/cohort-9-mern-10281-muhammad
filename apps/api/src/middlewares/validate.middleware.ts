import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export default function validate<T extends z.ZodType>(schema: T) {
  return async function (req: Request, _res: Response, next: NextFunction) {
    try {
      const result = await schema.safeParseAsync(req.body);

      if (!result.success) {
        return next(result.error);
      }

      req.body = result.data;
      next();
    } catch (error) {
      next(error);
    }
  };
}

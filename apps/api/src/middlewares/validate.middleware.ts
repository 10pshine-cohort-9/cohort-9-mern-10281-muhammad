import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export default function validate(schema: z.ZodType) {
  return function (req: Request, res: Response, next: NextFunction) {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      throw result.error;
    }

    req.body = result.data;

    next();
  };
}

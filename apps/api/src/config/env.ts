import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z
  .object({
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
    PORT: z.coerce.number().int().min(1).max(65535).default(5000),
    MONGO_URI: z.string().min(1),
    ACCESS_SECRET: z.string().min(32),
    REFRESH_SECRET: z.string().min(32),
  })
  .refine((env) => env.ACCESS_SECRET !== env.REFRESH_SECRET, {
    message: "ACCESS_SECRET and REFRESH_SECRET must be different",
    path: ["REFRESH_SECRET"],
  });

const env = envSchema.parse(process.env);

export default env;

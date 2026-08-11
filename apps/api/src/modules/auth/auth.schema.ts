import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be atleast 8 characters")
  .refine(
    (password: string) => Buffer.byteLength(password, "utf-8") <= 72,
    "Password must not exceed 72 bytes",
  );

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "Username must be atleast 3 characters")
    .max(30, "Username must not exceed 30 characters"),
  email: z.email().trim().toLowerCase(),
  password: passwordSchema,
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  usernameOrEmail: z.string().trim().toLowerCase(),
  password: passwordSchema,
});

export type LoginInput = z.infer<typeof loginSchema>;

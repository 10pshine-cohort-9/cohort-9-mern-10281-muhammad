import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "Username must be atleast 3 characters")
    .max(30, "Username must not exceed 30 characters"),
  email: z.email().trim().toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be atleast 8 characters")
    .max(72, "Password must not exceed 72 characters"),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  usernameOrEmail: z.string().trim().toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be atleast 8 characters")
    .max(72, "Password must not exceed 72 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;

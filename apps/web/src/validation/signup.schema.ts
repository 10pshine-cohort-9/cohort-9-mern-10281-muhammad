import { z } from "zod";
import { passwordSchema } from "./login.schema";

export const signUpSchema = z
  .object({
    username: z
      .string()
      .trim()
      .toLowerCase()
      .min(3, "Must be at least 3 characters")
      .max(30, "Must not exceed 30 characters"),
    email: z.email().trim().toLowerCase(),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpSchema = z.infer<typeof signUpSchema>;

import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, "Must be atleast 8 characters")
  .refine(
    (password: string) => new TextEncoder().encode(password).length <= 72,
    "Must not exceed 72 bytes",
  );

export const loginSchema = z.object({
  usernameOrEmail: z.string().trim().min(3, "Required").max(50, "Too long"),
  password: passwordSchema,
});

export type LoginInput = z.infer<typeof loginSchema>;

export const signupSchema = z
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

export type SignupInput = z.infer<typeof signupSchema>;

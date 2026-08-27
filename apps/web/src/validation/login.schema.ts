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

export type LoginSchema = z.infer<typeof loginSchema>;

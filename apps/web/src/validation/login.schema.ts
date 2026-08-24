import { z } from "zod";

export const loginSchema = z.object({
  usernameOrEmail: z.string().trim().min(3, "Required").max(50, "Too long"),
  password: z
    .string()
    .min(8, "Must be atleast 8 characters")
    .refine(
      (password: string) => new TextEncoder().encode(password).length <= 72,
      "Must not exceed 72 bytes",
    ),
});

export type LoginSchema = z.infer<typeof loginSchema>;

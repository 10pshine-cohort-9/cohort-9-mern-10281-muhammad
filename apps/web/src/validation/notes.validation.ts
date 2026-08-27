import { z } from "zod";

export const createNoteSchema = z.object({
  title: z.string().min(3, "Too short").max(200, "Too long"),
  content: z.string(),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;

export const updateNoteSchema = z
  .object({
    title: z.string().min(3, "Too short").max(200, "Too long").optional(),
    content: z.string().optional(),
  })
  .refine((data) => data.title !== undefined || data.content !== undefined, {
    message: "At least one field is required",
  });

export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;

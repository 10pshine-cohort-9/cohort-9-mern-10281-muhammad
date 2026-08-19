import { z } from "zod";

export const createNoteSchema = z.object({
  title: z.string().min(3).max(200),
  content: z.string(),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;

export const updateNoteSchema = z
  .object({
    title: z.string().min(3).max(200).optional(),
    content: z.string().optional(),
  })
  .refine((data) => data.title !== undefined || data.content !== undefined, {
    message: "At least one field is required",
  });

export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;

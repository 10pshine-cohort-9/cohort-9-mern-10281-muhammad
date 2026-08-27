import { useEffect, useState, type ReactElement } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import RichEditor from "../../components/RichEditor";
import { useNotesStore } from "../../store/notes.store";

import {
  updateNoteSchema,
  type UpdateNoteInput,
} from "../../validation/notes.validation";

export default function NoteEdit(): ReactElement {
  const { slug } = useParams();
  const navigate = useNavigate();

  const notes = useNotesStore((s) => s.notes);
  const updateNote = useNotesStore((s) => s.updateNote);
  const loading = useNotesStore((s) => s.loading);

  const note = notes.find((n) => n.slug === slug);

  const [content, setContent] = useState("<p></p>");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateNoteInput>({
    resolver: zodResolver(updateNoteSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  // Load existing note
  useEffect(() => {
    if (!note) return;

    reset({
      title: note.title || "",
      content: note.content || "",
    });

    setContent(note.content || "<p></p>");
  }, [note, reset]);

  const onSubmit = async (data: UpdateNoteInput) => {
    if (!note) return;

    await updateNote(note.slug, {
      ...data,
      content,
    });

    navigate(`/n/${note.slug}`);
  };

  if (!note) {
    return (
      <div className="max-w-3xl mx-auto py-6">
        <div className="border border-gray-300 rounded-md p-4 text-sm text-gray-500">
          Note not found.
        </div>
      </div>
    );
  }

  const saving = isSubmitting || loading;

  return (
    <div className="max-w-3xl mx-auto py-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-between border-b border-gray-300 pb-4">
          <h1 className="text-xl font-semibold">Edit Note</h1>

          <div className="flex items-center gap-2">
            <Link
              to={`/n/${note.slug}`}
              className="
                px-4 py-2
                text-sm
                rounded-md
                border border-gray-300
                hover:bg-gray-50
                transition
              "
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="
                px-4 py-2
                text-sm
                bg-black
                text-white
                rounded-md
                hover:bg-black/90
                transition
                disabled:opacity-50
              "
            >
              {saving ? "Saving..." : "Update"}
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <input
            type="text"
            placeholder="Untitled note"
            className="
              w-full
              text-2xl
              font-semibold
              border-none
              outline-none
              placeholder:text-gray-300
              bg-transparent
            "
            {...register("title")}
          />

          {errors.title && (
            <p className="text-xs text-red-500">{errors.title.message}</p>
          )}
        </div>

        <div className="border border-gray-300 rounded-md bg-white overflow-hidden">
          <RichEditor
            value={content}
            onChange={(val) => {
              setContent(val);

              setValue("content", val, {
                shouldValidate: true,
                shouldDirty: true,
              });
            }}
          />
        </div>

        {errors.content && (
          <p className="text-xs text-red-500">{errors.content.message}</p>
        )}
      </form>
    </div>
  );
}

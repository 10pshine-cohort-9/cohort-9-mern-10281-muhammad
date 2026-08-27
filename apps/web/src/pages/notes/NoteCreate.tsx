import { useState, type ReactElement } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createNoteSchema,
  type CreateNoteInput,
} from "../../validation/notes.validation";

import { useNotesStore } from "../../store/notes.store";
import RichEditor from "../../components/RichEditor";

export default function NoteCreate(): ReactElement {
  const createNote = useNotesStore((s) => s.createNote);
  const loading = useNotesStore((s) => s.loading);

  const navigate = useNavigate();

  const [content, setContent] = useState("<p></p>");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateNoteInput>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const onSubmit = async (data: CreateNoteInput) => {
    try {
      await createNote({
        ...data,
        content,
      });

      navigate("/");
    } catch (err) {
      console.error("CREATE NOTE FAILED:", err);
    }
  };

  const saving = isSubmitting || loading;

  return (
    <div className="max-w-3xl mx-auto py-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-between border-b border-gray-300 pb-4">
          <h1 className="text-xl font-semibold">New Note</h1>

          <div className="flex items-center gap-2">
            <Link
              to="/"
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
              {saving ? "Saving..." : "Save"}
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

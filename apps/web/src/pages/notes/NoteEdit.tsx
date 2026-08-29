import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, type ReactElement } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";

import NotFound from "../NotFound";
import PageHeader from "../../components/PageHeader";
import RichEditor from "../../components/RichEditor";
import { useNotesStore } from "../../store/notes.store";
import {
  updateNoteSchema,
  type UpdateNoteInput,
} from "../../validation/notes.validation";
import FormField from "../../components/FormField";

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
    return <NotFound message="The note you are looking for does not exist." />;
  }

  const saving = isSubmitting || loading;

  return (
    <>
      <PageHeader>
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
            form="note-edit-form"
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
      </PageHeader>

      <form
        id="note-edit-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <FormField
          placeholder="Untitled note"
          className="w-full text-2xl font-semibold border-none outline-none focus:outline-none focus:ring-0 placeholder:text-gray-300 bg-transparent px-0"
          type="text"
          registration={register("title")}
          error={errors.title?.message}
        />

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
    </>
  );
}

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, type ReactElement } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";

import FormField from "../../components/FormField";
import PageHeader from "../../components/PageHeader";
import RichEditor from "../../components/RichEditor";
import NotFound from "../NotFound";
import { useNotesStore } from "../../store/notes.store";
import {
  updateNoteSchema,
  type UpdateNoteInput,
} from "../../validation/notes.validation";

export default function NoteEdit(): ReactElement {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const notes = useNotesStore((state) => state.notes);
  const getNote = useNotesStore((state) => state.getNote);
  const updateNote = useNotesStore((state) => state.updateNote);
  const loading = useNotesStore((state) => state.loading);

  const note = notes.find((item) => item.slug === slug);

  const [content, setContent] = useState("");
  const [fetchingNote, setFetchingNote] = useState(!note);
  const [notFound, setNotFound] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

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
    if (!slug || note) {
      setFetchingNote(false);
      return;
    }

    let cancelled = false;

    const fetchNote = async () => {
      setFetchingNote(true);
      setNotFound(false);

      try {
        await getNote(slug);
      } catch (error) {
        if (cancelled) return;

        setNotFound(true);
      } finally {
        if (!cancelled) {
          setFetchingNote(false);
        }
      }
    };

    fetchNote();

    return () => {
      cancelled = true;
    };
  }, [slug, note, getNote]);

  useEffect(() => {
    if (!note) return;

    reset({
      title: note.title,
      content: note.content,
    });

    setContent(note.content || "");
  }, [note, reset]);

  const onSubmit = async (data: UpdateNoteInput) => {
    if (!note) return;

    setUpdateError(null);

    try {
      await updateNote(note.slug, {
        title: data.title,
        content,
      });

      navigate(`/n/${note.slug}`);
    } catch (error) {
      setUpdateError(
        error instanceof Error
          ? error.message
          : "Failed to update the note. Please try again.",
      );
    }
  };

  if (fetchingNote) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-gray-500">Loading note...</p>
      </div>
    );
  }

  if (notFound || !note) {
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
          className="
            w-full
            text-2xl
            font-semibold
            border-none
            outline-none
            focus:outline-none
            focus:ring-0
            placeholder:text-gray-300
            bg-transparent
            px-0
          "
          type="text"
          registration={register("title")}
          error={errors.title?.message}
        />

        <div className="overflow-hidden rounded-md border border-gray-300 bg-white">
          <RichEditor
            value={content}
            onChange={(value) => {
              setContent(value);

              setValue("content", value, {
                shouldValidate: true,
                shouldDirty: true,
              });
            }}
          />
        </div>

        {errors.content && (
          <p className="text-xs text-red-500">{errors.content.message}</p>
        )}

        {updateError && (
          <p role="alert" className="text-sm text-red-500">
            {updateError}
          </p>
        )}
      </form>
    </>
  );
}

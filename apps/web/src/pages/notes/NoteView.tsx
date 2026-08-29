import { ArrowLeft, Edit2, Trash2 } from "lucide-react";
import { useEffect, useState, type ReactElement } from "react";
import { Link, useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";

import NotFound from "../NotFound";
import ConfirmModal from "../../components/ConfirmModal";
import PageHeader from "../../components/PageHeader";
import Tooltip from "../../components/Tooltip";
import { useNotesStore } from "../../store/notes.store";
import { formatDate } from "../../utils/formatDate";

export default function NoteView(): ReactElement {
  const navigate = useNavigate();

  const notes = useNotesStore((s) => s.notes);
  const getNotes = useNotesStore((s) => s.getNotes);
  const deleteNote = useNotesStore((s) => s.deleteNote);
  const loading = useNotesStore((s) => s.loading);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (!notes.length) {
      getNotes();
    }
  }, [getNotes, notes.length]);

  const note = useNotesStore((s) => s.note);

  const handleDelete = async () => {
    if (!note) return;

    try {
      setDeleting(true);
      setDeleteError(null);

      await deleteNote(note.slug);

      setDeleteOpen(false);
      navigate("/");
    } catch (error) {
      setDeleteError(
        error instanceof Error
          ? error.message
          : "Failed to delete note. Please try again.",
      );
    } finally {
      setDeleting(false);
    }
  };

  if (loading && !note) {
    return (
      <div className="max-w-3xl mx-auto py-6">
        <p className="text-sm text-gray-500">Loading note...</p>
      </div>
    );
  }

  if (!note) {
    return <NotFound message="The note you are looking for does not exist." />;
  }

  return (
    <>
      <PageHeader>
        <Link
          to="/"
          className="
            flex items-center gap-1.5
            text-sm
            text-gray-600
            hover:text-black
            transition
          "
        >
          <ArrowLeft size={16} />
          Back
        </Link>

        <div className="flex items-center gap-1">
          <Tooltip text="Edit">
            <Link
              aria-label="Edit note"
              to={`/n/${note.slug}/edit`}
              aria-label="Edit note"
              className="
                flex items-center justify-center
                w-8 h-8
                rounded-md
                text-gray-600
                hover:bg-gray-100
                transition
              "
            >
              <Edit2 size={16} />
            </Link>
          </Tooltip>

          <Tooltip text="Delete">
            <button
              type="button"
              aria-label="Delete note"
              onClick={() => setDeleteOpen(true)}
              className="
                flex items-center justify-center
                w-8 h-8
                rounded-md
                text-red-500
                hover:bg-red-50
                transition
              "
            >
              <Trash2 size={16} />
            </button>
          </Tooltip>
        </div>
      </PageHeader>

      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-gray-900">
          {note.title || "Untitled"}
        </h1>

        <p className="text-xs text-gray-400">
          Updated {formatDate(note.updatedAt) || "recently"}
        </p>
      </div>

      <div
        className="
          prose prose-sm max-w-none
          prose-headings:text-gray-900
          prose-p:text-gray-700
          prose-strong:text-gray-900
          prose-li:text-gray-700
          leading-relaxed
        "
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(note.content || ""),
        }}
      />

      <ConfirmModal
        isOpen={deleteOpen}
        setIsOpen={(isOpen) => {
          if (!isOpen && !deleting) {
            setDeleteOpen(false);
            setDeleteError(null);
          }
        }}
        loading={deleting}
        onConfirm={handleDelete}
        error={deleteError}
      />
    </>
  );
}

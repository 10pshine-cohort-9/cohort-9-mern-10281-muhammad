import DOMPurify from "dompurify";
import { ArrowLeft, Edit2, Trash2 } from "lucide-react";
import { useEffect, useState, type ReactElement } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import ConfirmModal from "../../components/ConfirmModal";
import PageHeader from "../../components/PageHeader";
import Tooltip from "../../components/Tooltip";
import { useNotesStore } from "../../store/notes.store";
import { formatDate } from "../../utils/formatDate";
import NotFound from "../NotFound";

export default function NoteView(): ReactElement {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const notes = useNotesStore((state) => state.notes);
  const getNote = useNotesStore((state) => state.getNote);
  const deleteNote = useNotesStore((state) => state.deleteNote);
  const loading = useNotesStore((state) => state.loading);

  const [fetchingNote, setFetchingNote] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const note = notes.find((item) => item.slug === slug);

  useEffect(() => {
    if (!slug) {
      setFetchingNote(false);
      setNotFound(true);
      return;
    }

    if (note) {
      setFetchingNote(false);
      return;
    }

    let cancelled = false;

    const fetchNote = async () => {
      setFetchingNote(true);
      setNotFound(false);

      try {
        await getNote(slug);
      } catch {
        if (!cancelled) {
          setNotFound(true);
        }
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

  if (fetchingNote || (loading && !note)) {
    return (
      <div className="mx-auto max-w-3xl py-6">
        <p className="text-sm text-gray-500">Loading note...</p>
      </div>
    );
  }

  if (notFound || !note) {
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

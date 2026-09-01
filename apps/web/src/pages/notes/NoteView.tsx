import axios from "axios";
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
  const [fetchError, setFetchError] = useState<string | null>(null);

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
      setNotFound(false);
      setFetchError(null);
      return;
    }

    let cancelled = false;

    const fetchNote = async () => {
      setFetchingNote(true);
      setNotFound(false);
      setFetchError(null);

      try {
        await getNote(slug);
      } catch (error: unknown) {
        if (cancelled) return;

        if (axios.isAxiosError(error) && error.response?.status === 404) {
          setNotFound(true);
        } else {
          setFetchError(
            "Failed to load the note. Please check your connection and try again.",
          );
        }
      } finally {
        if (!cancelled) {
          setFetchingNote(false);
        }
      }
    };

    void fetchNote();

    return () => {
      cancelled = true;
    };
  }, [slug, note, getNote]);

  const handleRetry = () => {
    if (!slug) return;

    setFetchingNote(true);
    setNotFound(false);
    setFetchError(null);

    const retry = async () => {
      try {
        await getNote(slug);
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          setNotFound(true);
        } else {
          setFetchError(
            "Failed to load the note. Please check your connection and try again.",
          );
        }
      } finally {
        setFetchingNote(false);
      }
    };

    void retry();
  };

  const handleDelete = async () => {
    if (!note) return;

    try {
      setDeleting(true);
      setDeleteError(null);

      await deleteNote(note.slug);

      setDeleteOpen(false);
      navigate("/");
    } catch (error: unknown) {
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

  if (notFound) {
    return <NotFound message="The note you are looking for does not exist." />;
  }

  if (fetchError) {
    return (
      <div className="mx-auto max-w-3xl py-12 text-center">
        <p className="text-sm text-red-500">{fetchError}</p>

        <button
          type="button"
          onClick={handleRetry}
          className="
            mt-4
            rounded-md
            bg-black
            px-4 py-2
            text-sm
            text-white
            transition
            hover:bg-gray-800
          "
        >
          Try again
        </button>
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
            transition
            hover:text-black
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
                flex h-8 w-8 items-center justify-center
                rounded-md
                text-gray-600
                transition
                hover:bg-gray-100
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
                flex h-8 w-8 items-center justify-center
                rounded-md
                text-red-500
                transition
                hover:bg-red-50
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
          leading-relaxed
          prose-headings:text-gray-900
          prose-p:text-gray-700
          prose-strong:text-gray-900
          prose-li:text-gray-700
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

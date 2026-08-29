import { useEffect, useState, type ReactElement } from "react";
import { Link } from "react-router-dom";
import { Edit2, Plus, Trash2 } from "lucide-react";

import ConfirmModal from "../components/ConfirmModal";
import PageHeader from "../components/PageHeader";
import Tooltip from "../components/Tooltip";
import { useNotesStore } from "../store/notes.store";
import { formatDate } from "../utils/formatDate";

export default function Home(): ReactElement {
  const notes = useNotesStore((s) => s.notes);
  const getNotes = useNotesStore((s) => s.getNotes);
  const deleteNote = useNotesStore((s) => s.deleteNote);
  const loading = useNotesStore((s) => s.loading);

  const [deleteSlug, setDeleteSlug] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getNotes();
  }, [getNotes]);

  const handleDelete = async () => {
    if (!deleteSlug) return;

    try {
      setDeleting(true);

      await deleteNote(deleteSlug);
      await getNotes();

      setDeleteSlug(null);
    } finally {
      setDeleting(false);
    }
  };

  const stripHtml = (html: string) => html?.replace(/<[^>]*>/g, "") || "";

  return (
    <>
      <PageHeader>
        <h1 className="text-xl font-semibold">Your Notes</h1>

        <Link
          to="/n/new"
          className="flex items-center gap-1 px-3 py-2 text-sm bg-black text-white rounded-md hover:bg-black/90 transition"
        >
          <Plus size={16} />
          New Note
        </Link>
      </PageHeader>

      {loading && <p className="text-sm text-gray-500">Loading notes...</p>}

      {!loading && notes.length === 0 && (
        <div className="text-sm text-gray-500 border border-gray-300 rounded-md p-4">
          No notes yet. Create your first{" "}
          <Link to="/n/new" className="border-b">
            note
          </Link>
          .
        </div>
      )}

      {!loading && notes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {notes.map((note) => (
            <div
              key={note.slug}
              className="
                  group relative
                  bg-white
                  border border-gray-200
                  rounded-xl
                  p-4
                  transition-all
                  hover:shadow-lg
                  hover:-translate-y-0.5
                  hover:border-gray-300
                  overflow-hidden
                "
            >
              <div
                className="
                    absolute inset-0
                    opacity-0
                    group-hover:opacity-100
                    transition
                    bg-linear-to-br
                    from-black/5
                    to-transparent
                    pointer-events-none
                  "
              />

              <Link
                to={`/n/${note.slug}`}
                className="block relative z-10 pr-10"
              >
                <h2 className="font-semibold text-lg text-gray-900 line-clamp-1">
                  {note.title || "Untitled"}
                </h2>

                <p className="text-sm text-gray-500 mt-1 line-clamp-3">
                  {stripHtml(note.content).slice(0, 140)}
                </p>

                <p className="text-xs text-gray-400 mt-3">
                  Updated {formatDate(note.updatedAt) || "recently"}
                </p>
              </Link>

              <div
                className="
                    absolute top-3 right-3
                    opacity-0
                    group-hover:opacity-100
                    transition
                    flex items-center gap-1
                    z-20
                  "
              >
                <Tooltip text="Edit">
                  <Link
                    to={`/n/${note.slug}/edit`}
                    className="
                        flex items-center justify-center
                        w-8 h-8
                        rounded-md
                        text-gray-600
                        hover:bg-gray-100
                        transition
                      "
                  >
                    <Edit2 size={14} />
                  </Link>
                </Tooltip>

                <Tooltip text="Delete">
                  <button
                    onClick={() => setDeleteSlug(note.slug)}
                    className="
                        flex items-center justify-center
                        w-8 h-8
                        rounded-md
                        text-red-500
                        hover:bg-red-50
                        transition
                      "
                  >
                    <Trash2 size={14} />
                  </button>
                </Tooltip>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={deleteSlug !== null}
        setIsOpen={(isOpen) => {
          if (!isOpen && !deleting) {
            setDeleteSlug(null);
          }
        }}
        loading={deleting}
        onConfirm={handleDelete}
      />
    </>
  );
}

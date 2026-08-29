import { ArrowLeft, Edit2, Trash2 } from "lucide-react";
import { useEffect, useState, type ReactElement } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import NotFound from "../NotFound";
import ConfirmModal from "../../components/ConfirmModal";
import PageHeader from "../../components/PageHeader";
import Tooltip from "../../components/Tooltip";
import { useNotesStore } from "../../store/notes.store";
import { formatDate } from "../../utils/formatDate";

export default function NoteView(): ReactElement {
  const { slug } = useParams();
  const navigate = useNavigate();

  const notes = useNotesStore((s) => s.notes);
  const getNotes = useNotesStore((s) => s.getNotes);
  const deleteNote = useNotesStore((s) => s.deleteNote);
  const loading = useNotesStore((s) => s.loading);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!notes.length) {
      getNotes();
    }
  }, [getNotes, notes.length]);

  const note = notes.find((n) => n.slug === slug);

  const handleDelete = async () => {
    if (!note) return;

    try {
      setDeleting(true);

      await deleteNote(note.slug);
      await getNotes();

      setDeleteOpen(false);
      navigate("/");
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
              <Edit2 size={16} />
            </Link>
          </Tooltip>

          <Tooltip text="Delete">
            <button
              type="button"
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
          Last updated: {formatDate(note.updatedAt)}
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
          __html: note.content || "",
        }}
      />

      <ConfirmModal
        isOpen={deleteOpen}
        setIsOpen={setDeleteOpen}
        loading={deleting}
        onConfirm={handleDelete}
      />
    </>
  );
}

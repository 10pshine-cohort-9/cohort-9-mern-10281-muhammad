import { useEffect, useState, type ReactElement } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

import ConfirmModal from "../components/ConfirmModal";
import NoteCard from "../components/NoteCard";
import PageHeader from "../components/PageHeader";
import { useNotesStore } from "../store/notes.store";

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
      setDeleteSlug(null);
    } finally {
      setDeleting(false);
    }
  };

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
            <NoteCard key={note.slug} note={note} onDelete={setDeleteSlug} />
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

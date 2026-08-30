import { useEffect, useMemo, useState, type ReactElement } from "react";
import { Link } from "react-router-dom";
import { Filter, Plus } from "lucide-react";

import ConfirmModal from "../components/ConfirmModal";
import NoteCard from "../components/NoteCard";
import PageHeader from "../components/PageHeader";
import { useNotesStore } from "../store/notes.store";
import Select from "../components/Select";

export type SortOption = "updated" | "oldest" | "az" | "za";

export const SortingOptions = [
  { value: "updated", label: "Recently updated" },
  { value: "oldest", label: "Oldest updated" },
  { value: "az", label: "A-Z (Title)" },
  { value: "za", label: "Z-A (Title)" },
];

export default function Home(): ReactElement {
  const notes = useNotesStore((s) => s.notes);
  const getNotes = useNotesStore((s) => s.getNotes);
  const deleteNote = useNotesStore((s) => s.deleteNote);
  const loading = useNotesStore((s) => s.loading);

  const [sort, setSort] = useState<SortOption>("updated");
  const [deleteSlug, setDeleteSlug] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getNotes();
  }, [getNotes]);

  const filteredNotes = useMemo(() => {
    return [...notes].sort((a, b) => {
      switch (sort) {
        case "oldest":
          return (
            new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
          );

        case "az":
          return a.title.localeCompare(b.title);

        case "za":
          return b.title.localeCompare(a.title);

        case "updated":
        default:
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
      }
    });
  }, [notes, sort]);

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
        <h1 classNamsortOptionse="text-xl font-semibold">Your Notes</h1>

        <div className="flex items-center gap-2">
          <div className="relative flex items-center">
            <Filter
              size={14}
              className="absolute left-2.5 text-gray-500 pointer-events-none"
            />

            <Select
              value={sort}
              onChange={(value) => setSort(value as SortOption)}
              aria-label="Sort notes"
              options={SortingOptions}
            />
          </div>

          <Link
            to="/n/new"
            className="
              flex items-center gap-1
              px-3 py-2
              text-sm
              bg-black text-white
              rounded-md
              hover:bg-black/90
              transition
            "
          >
            <Plus size={16} />
            New Note
          </Link>
        </div>
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
          {filteredNotes.map((note) => (
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

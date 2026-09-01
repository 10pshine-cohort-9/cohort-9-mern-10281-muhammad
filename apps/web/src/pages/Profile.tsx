import axios from "axios";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState, type ReactElement } from "react";
import { Link, useNavigate } from "react-router-dom";

import ConfirmModal from "../components/ConfirmModal";
import PageHeader from "../components/PageHeader";
import Tooltip from "../components/Tooltip";
import { authService } from "../services/auth.service";
import { useAuthStore } from "../store/auth.store";
import { useNotesStore } from "../store/notes.store";

export default function Profile(): ReactElement {
  const navigate = useNavigate();

  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const notes = useNotesStore((s) => s.notes);
  const getNotes = useNotesStore((s) => s.getNotes);
  const deleteNote = useNotesStore((s) => s.deleteNote);
  const loading = useNotesStore((s) => s.loading);

  const [deleteSlug, setDeleteSlug] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    getNotes();
  }, [getNotes]);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data?.message ?? "Logout request failed");
      } else {
        console.error("An unexpected error occurred");
      }
    } finally {
      logout();
      navigate("/login");
    }
  };

  const handleDelete = async () => {
    if (!deleteSlug) return;

    try {
      setDeleting(true);
      setDeleteError(null);

      await deleteNote(deleteSlug);
      await getNotes();

      setDeleteSlug(null);
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

  const stripHtml = (html: string) => html?.replace(/<[^>]*>/g, "") || "";

  return (
    <>
      <PageHeader>
        <div className="flex items-center gap-4">
          <img
            src={`https://api.dicebear.com/10.x/lorelei/svg?seed=${user?.id}`}
            alt="Profile"
            className="w-12 h-12 rounded-full border border-gray-300"
          />

          <div>
            <h1 className="text-xl font-semibold">
              {user?.username || "User"}
            </h1>

            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="px-4 py-2 text-sm bg-black text-white rounded-md hover:bg-black/90"
        >
          Logout
        </button>
      </PageHeader>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Your Notes</h2>

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
          <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-600">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Preview</th>
                  <th className="px-4 py-3 w-32 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {notes.map((note) => (
                  <tr
                    key={note.slug}
                    className="border-t border-gray-300 hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-2 font-medium text-gray-900">
                      {note.title || "Untitled"}
                    </td>

                    <td className="px-4 py-2 text-gray-500">
                      <span className="line-clamp-1">
                        {stripHtml(note.content).slice(0, 80)}
                      </span>
                    </td>

                    <td className="px-4 py-2">
                      <div className="flex justify-end items-center gap-1">
                        <Tooltip text="View">
                          <Link
                            to={`/n/${note.slug}`}
                            aria-label="View note"
                            className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 text-gray-700 transition"
                          >
                            <Eye size={16} />
                          </Link>
                        </Tooltip>

                        <Tooltip text="Edit">
                          <Link
                            to={`/n/${note.slug}/edit`}
                            aria-label="Edit note"
                            className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 text-gray-700 transition"
                          >
                            <Pencil size={16} />
                          </Link>
                        </Tooltip>

                        <Tooltip text="Delete">
                          <button
                            type="button"
                            onClick={() => {
                              setDeleteError(null);
                              setDeleteSlug(note.slug);
                            }}
                            aria-label="Delete note"
                            className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-red-50 text-red-600 transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={deleteSlug !== null}
        setIsOpen={(isOpen) => {
          if (!isOpen && !deleting) {
            setDeleteSlug(null);
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

import type { ReactElement } from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Eye, Pencil, Trash2 } from "lucide-react";
import Tooltip from "../components/Tooltip";

import { useAuthStore } from "../store/auth.store";
import { useNotesStore } from "../store/notes.store";
import { authService } from "../services/auth.service";
import axios from "axios";
import ConfirmModal from "../components/ConfirmModal";

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

  const stripHtml = (html: string) => html?.replace(/<[^>]*>/g, "") || "";

  return (
    <>
      <div className="max-w-3xl mx-auto space-y-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={`https://api.dicebear.com/10.x/lorelei/svg?seed=${user?.id}`}
              alt="Profile"
              className="w-14 h-14 rounded-full border border-gray-300"
            />

            <div>
              <h1 className="text-xl font-semibold">
                {user?.username || "User"}
              </h1>

              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm bg-black text-white rounded-md hover:bg-black/90"
          >
            Logout
          </button>
        </div>

        <div className="border-t border-gray-300" />

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
                              className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 text-gray-700 transition"
                            >
                              <Eye size={16} />
                            </Link>
                          </Tooltip>

                          <Tooltip text="Edit">
                            <Link
                              to={`/n/${note.slug}/edit`}
                              className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 text-gray-700 transition"
                            >
                              <Pencil size={16} />
                            </Link>
                          </Tooltip>

                          <Tooltip text="Delete">
                            <button
                              onClick={() => setDeleteSlug(note.slug)}
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
      </div>

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

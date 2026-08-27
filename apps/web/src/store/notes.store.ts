import { create } from "zustand";
import { api } from "../api/axios";

export type Note = {
  slug: string;
  title: string;
  content: string;
  updatedAt: any;
};

type NotesState = {
  notes: Note[];
  loading: boolean;
  error: string | null;

  createNote: (data: { title: string; content: string }) => Promise<void>;
  getNotes: () => Promise<void>;
  getNote: (slug: string) => Promise<void>;
  updateNote: (
    slug: string,
    data: { title?: string; content?: string },
  ) => Promise<void>;
  deleteNote: (slug: string) => Promise<void>;
};

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  loading: false,
  error: null,

  getNotes: async () => {
    set({ loading: true, error: null });

    try {
      const res = await api.get("/notes");
      set({ notes: res.data.data, loading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to fetch notes",
        loading: false,
      });
    }
  },

  getNote: async (slug: string) => {
    set({ loading: true, error: null });

    try {
      const res = await api.get(`/notes/${slug}`);
      set({ notes: res.data.data, loading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to fetch notes",
        loading: false,
      });
    }
  },

  createNote: async (data) => {
    try {
      const res = await api.post("/notes", data);

      set({
        notes: [res.data.data, ...get().notes],
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to create note",
      });
      throw err;
    }
  },

  updateNote: async (slug, data) => {
    try {
      const res = await api.patch(`/notes/${slug}`, data);

      set({
        notes: get().notes.map((n) => (n.slug === slug ? res.data.data : n)),
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to update note",
      });
      throw err;
    }
  },

  deleteNote: async (slug) => {
    try {
      await api.delete(`/notes/${slug}`);

      set({
        notes: get().notes.filter((n) => n.slug !== slug),
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to delete note",
      });
      throw err;
    }
  },
}));

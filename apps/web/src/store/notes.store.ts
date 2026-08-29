import { create } from "zustand";
import axios from "axios";

import { api } from "../api/axios";

export type Note = {
  slug: string;
  title: string;
  content: string;
  updatedAt: string;
};

type ApiError = {
  message: string;
};

type NotesState = {
  notes: Note[];
  loading: boolean;
  error: string | null;
  query: string;

  createNote: (data: { title: string; content: string }) => Promise<void>;
  getNotes: (query?: string) => Promise<void>;
  getNote: (slug: string) => Promise<void>;
  updateNote: (
    slug: string,
    data: { title?: string; content?: string },
  ) => Promise<void>;
  deleteNote: (slug: string) => Promise<void>;

  setQuery: (query: string) => void;
  clearError: () => void;
};

let notesRequestId = 0;

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError<ApiError>(error)) {
    return error.response?.data?.message || fallback;
  }

  return fallback;
};

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  loading: false,
  error: null,
  query: "",

  getNotes: async (query = get().query) => {
    const requestId = ++notesRequestId;

    set({
      loading: true,
      error: null,
      query,
    });

    try {
      const res = await api.get("/notes", {
        params: query ? { search: query } : undefined,
      });

      if (requestId !== notesRequestId) return;

      set({
        notes: res.data.data,
        loading: false,
      });
    } catch (error: unknown) {
      if (requestId !== notesRequestId) return;

      set({
        error: getErrorMessage(error, "Failed to fetch notes"),
        loading: false,
      });
    }
  },

  getNote: async (slug) => {
    set({ loading: true, error: null });

    try {
      const res = await api.get(`/notes/${slug}`);
      const note: Note = res.data.data;

      set((state) => ({
        notes: state.notes.some((n) => n.slug === note.slug)
          ? state.notes.map((n) => (n.slug === note.slug ? note : n))
          : [...state.notes, note],
        loading: false,
      }));
    } catch (error: unknown) {
      set({
        error: getErrorMessage(error, "Failed to fetch note"),
        loading: false,
      });
    }
  },

  createNote: async (data) => {
    set({ error: null });

    try {
      const res = await api.post("/notes", data);

      set((state) => ({
        notes: [res.data.data, ...state.notes],
      }));
    } catch (error: unknown) {
      set({
        error: getErrorMessage(error, "Failed to create note"),
      });

      throw error;
    }
  },

  updateNote: async (slug, data) => {
    set({ error: null });

    try {
      const res = await api.patch(`/notes/${slug}`, data);

      set((state) => ({
        notes: state.notes.map((note) =>
          note.slug === slug ? res.data.data : note,
        ),
      }));
    } catch (error: unknown) {
      set({
        error: getErrorMessage(error, "Failed to update note"),
      });

      throw error;
    }
  },

  deleteNote: async (slug) => {
    set({ error: null });

    try {
      await api.delete(`/notes/${slug}`);

      set((state) => ({
        notes: state.notes.filter((note) => note.slug !== slug),
      }));
    } catch (error: unknown) {
      set({
        error: getErrorMessage(error, "Failed to delete note"),
      });

      throw error;
    }
  },

  setQuery: (query) => set({ query }),

  clearError: () => set({ error: null }),
}));

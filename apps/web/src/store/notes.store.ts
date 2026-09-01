import axios from "axios";
import { create } from "zustand";

import { api } from "../api/axios";

export type Note = {
  slug: string;
  title: string;
  content: string;
  updatedAt: string;
};

type UpdateNoteData = {
  title: string;
  content: string;
};

type ApiError = {
  message: string;
};

type NotesState = {
  notes: Note[];
  note: Note | null;
  loading: boolean;
  error: string | null;
  query: string;

  createNote: (data: { title: string; content: string }) => Promise<void>;

  getNotes: (query?: string) => Promise<void>;
  getNote: (slug: string) => Promise<void>;
  updateNote: (slug: string, data: UpdateNoteData) => Promise<void>;
  deleteNote: (slug: string) => Promise<void>;

  setQuery: (query: string) => void;
  clearError: () => void;
};

let notesRequestId = 0;

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError<ApiError>(error)) {
    return error.response?.data?.message ?? fallback;
  }

  return fallback;
};

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  note: null,
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
      const res = await api.get<{ data: Note[] }>("/notes", {
        params: query ? { search: query } : undefined,
      });

      if (requestId !== notesRequestId) {
        return;
      }

      set({
        notes: res.data.data,
        loading: false,
      });
    } catch (error: unknown) {
      if (requestId !== notesRequestId) {
        return;
      }

      set({
        error: getErrorMessage(error, "Failed to fetch notes"),
        loading: false,
      });
    }
  },

  getNote: async (slug) => {
    set({
      loading: true,
      error: null,
    });

    try {
      const res = await api.get<{ data: Note }>(`/notes/${slug}`);

      const note = res.data.data;

      set((state) => ({
        notes: state.notes.some(
          (existingNote) => existingNote.slug === note.slug,
        )
          ? state.notes.map((existingNote) =>
              existingNote.slug === note.slug ? note : existingNote,
            )
          : [...state.notes, note],

        note,
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
    set({
      error: null,
      loading: true,
    });

    try {
      const res = await api.post<{ data: Note }>("/notes", data);

      set((state) => ({
        notes: [res.data.data, ...state.notes],
        loading: false,
      }));
    } catch (error: unknown) {
      set({
        error: getErrorMessage(error, "Failed to create note"),
        loading: false,
      });

      throw error;
    }
  },

  updateNote: async (slug, data) => {
    set({
      error: null,
      loading: true,
    });

    try {
      const res = await api.patch<{ data: Note }>(`/notes/${slug}`, data);

      const updatedNote = res.data.data;

      set((state) => ({
        notes: state.notes.map((note) =>
          note.slug === slug ? updatedNote : note,
        ),

        note: state.note?.slug === slug ? updatedNote : state.note,

        loading: false,
      }));
    } catch (error: unknown) {
      set({
        error: getErrorMessage(error, "Failed to update note"),
        loading: false,
      });

      throw error;
    }
  },

  deleteNote: async (slug) => {
    set({
      error: null,
      loading: true,
    });

    try {
      await api.delete(`/notes/${slug}`);

      set((state) => ({
        notes: state.notes.filter((note) => note.slug !== slug),

        note: state.note?.slug === slug ? null : state.note,

        loading: false,
      }));
    } catch (error: unknown) {
      set({
        error: getErrorMessage(error, "Failed to delete note"),
        loading: false,
      });

      throw error;
    }
  },

  setQuery: (query) => {
    set({ query });
  },

  clearError: () => {
    set({ error: null });
  },
}));

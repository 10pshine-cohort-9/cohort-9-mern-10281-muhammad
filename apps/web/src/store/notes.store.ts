import axios from "axios";
import { create } from "zustand";

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
  searchResults: Note[];

  loading: boolean;
  searching: boolean;
  error: string | null;

  createNote: (data: { title: string; content: string }) => Promise<void>;

  getNotes: () => Promise<void>;
  searchNotes: (query: string) => Promise<void>;
  getNote: (slug: string) => Promise<Note>;
  updateNote: (
    slug: string,
    data: {
      title?: string;
      content?: string;
    },
  ) => Promise<void>;
  deleteNote: (slug: string) => Promise<void>;

  clearSearch: () => void;
  clearError: () => void;
};

let searchRequestId = 0;

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError<ApiError>(error)) {
    return error.response?.data?.message || fallback;
  }

  return fallback;
};

export const useNotesStore = create<NotesState>((set) => ({
  notes: [],
  searchResults: [],

  loading: false,
  searching: false,
  error: null,

  getNotes: async () => {
    set({
      loading: true,
      error: null,
    });

    try {
      const res = await api.get("/notes");

      set({
        notes: res.data.data,
        loading: false,
      });
    } catch (error: unknown) {
      set({
        error: getErrorMessage(error, "Failed to fetch notes"),
        loading: false,
      });

      throw error;
    }
  },

  searchNotes: async (query) => {
    const value = query.trim();

    if (!value) {
      searchRequestId++;

      set({
        searchResults: [],
        searching: false,
      });

      return;
    }

    const requestId = ++searchRequestId;

    set({
      searching: true,
      error: null,
    });

    try {
      const res = await api.get("/notes", {
        params: {
          search: value,
        },
      });

      if (requestId !== searchRequestId) {
        return;
      }

      set({
        searchResults: res.data.data,
        searching: false,
      });
    } catch (error: unknown) {
      if (requestId !== searchRequestId) {
        return;
      }

      set({
        error: getErrorMessage(error, "Failed to search notes"),
        searching: false,
      });

      throw error;
    }
  },

  getNote: async (slug) => {
    set({
      loading: true,
      error: null,
    });

    try {
      const res = await api.get(`/notes/${slug}`);
      const note: Note = res.data.data;

      set((state) => {
        const exists = state.notes.some((item) => item.slug === note.slug);

        return {
          notes: exists
            ? state.notes.map((item) => (item.slug === note.slug ? note : item))
            : [note, ...state.notes],

          loading: false,
        };
      });

      return note;
    } catch (error: unknown) {
      set({
        error: getErrorMessage(error, "Failed to fetch note"),
        loading: false,
      });

      throw error;
    }
  },

  createNote: async (data) => {
    set({
      error: null,
    });

    try {
      const res = await api.post("/notes", data);
      const note: Note = res.data.data;

      set((state) => ({
        notes: [note, ...state.notes],
      }));
    } catch (error: unknown) {
      set({
        error: getErrorMessage(error, "Failed to create note"),
      });

      throw error;
    }
  },

  updateNote: async (slug, data) => {
    set({
      error: null,
    });

    try {
      const res = await api.patch(`/notes/${slug}`, data);

      const note: Note = res.data.data;

      set((state) => ({
        notes: state.notes.map((item) => (item.slug === slug ? note : item)),

        searchResults: state.searchResults.map((item) =>
          item.slug === slug ? note : item,
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
    set({
      error: null,
    });

    try {
      await api.delete(`/notes/${slug}`);

      set((state) => ({
        notes: state.notes.filter((note) => note.slug !== slug),

        searchResults: state.searchResults.filter((note) => note.slug !== slug),
      }));
    } catch (error: unknown) {
      set({
        error: getErrorMessage(error, "Failed to delete note"),
      });

      throw error;
    }
  },

  // Clear search
  clearSearch: () => {
    searchRequestId++;

    set({
      searchResults: [],
      searching: false,
    });
  },

  clearError: () => {
    set({
      error: null,
    });
  },
}));

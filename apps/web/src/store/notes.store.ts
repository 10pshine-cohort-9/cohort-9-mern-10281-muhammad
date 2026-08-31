import axios from "axios";
import { create } from "zustand";

import { api } from "../api/axios";
import type {
  CreateNoteData,
  Note,
  UpdateNoteData,
} from "../services/notes.service";

type NotesState = {
  notes: Note[];
  note: Note | null;
  loading: boolean;
  error: string | null;

  createNote: (data: CreateNoteData) => Promise<void>;
  getNotes: () => Promise<void>;
  getNote: (slug: string) => Promise<void>;
  updateNote: (slug: string, data: UpdateNoteData) => Promise<void>;
  deleteNote: (slug: string) => Promise<void>;
};

type ApiErrorResponse = {
  message?: string;
};

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.message ?? fallback;
  }

  return fallback;
};

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  note: null,
  loading: false,
  error: null,

  getNotes: async () => {
    set({ loading: true, error: null });

    try {
      const res = await api.get<{ data: Note[] }>("/notes");

      set({
        notes: res.data.data,
        loading: false,
      });
    } catch (error: unknown) {
      set({
        error: getErrorMessage(error, "Failed to fetch notes"),
        loading: false,
      });
    }
  },

  getNote: async (slug: string) => {
    set({ loading: true, error: null });

    try {
      const res = await api.get<{ data: Note }>(`/notes/${slug}`);

      set({
        note: res.data.data,
        loading: false,
      });
    } catch (error: unknown) {
      set({
        error: getErrorMessage(error, "Failed to fetch note"),
        loading: false,
      });
    }
  },

  createNote: async (data: CreateNoteData) => {
    try {
      const res = await api.post<{ data: Note }>("/notes", data);

      set({
        notes: [res.data.data, ...get().notes],
      });
    } catch (error: unknown) {
      set({
        error: getErrorMessage(error, "Failed to create note"),
      });

      throw error;
    }
  },

  updateNote: async (slug: string, data: UpdateNoteData) => {
    try {
      const res = await api.patch<{ data: Note }>(`/notes/${slug}`, data);

      set({
        notes: get().notes.map((note) =>
          note.slug === slug ? res.data.data : note,
        ),
      });
    } catch (error: unknown) {
      set({
        error: getErrorMessage(error, "Failed to update note"),
      });

      throw error;
    }
  },

  deleteNote: async (slug: string) => {
    try {
      await api.delete(`/notes/${slug}`);

      set({
        notes: get().notes.filter((note) => note.slug !== slug),
      });
    } catch (error: unknown) {
      set({
        error: getErrorMessage(error, "Failed to delete note"),
      });

      throw error;
    }
  },
}));

import { api } from "../api/axios";

export type Note = {
  slug: string;
  title: string;
  content: string;
  updatedAt: string;
};

export type CreateNoteData = {
  title: string;
  content: string;
};

export type UpdateNoteData = {
  title?: string;
  content?: string;
};

type ApiResponse<T> = {
  data: T;
};

export const notesService = {
  create: async (data: CreateNoteData): Promise<Note> => {
    const res = await api.post<ApiResponse<Note>>("/notes", data);
    return res.data.data;
  },

  getAll: async (): Promise<Note[]> => {
    const res = await api.get<ApiResponse<Note[]>>("/notes");
    return res.data.data;
  },

  get: async (slug: string): Promise<Note> => {
    const res = await api.get<ApiResponse<Note>>(`/notes/${slug}`);
    return res.data.data;
  },

  update: async (slug: string, data: UpdateNoteData): Promise<Note> => {
    const res = await api.patch<ApiResponse<Note>>(`/notes/${slug}`, data);
    return res.data.data;
  },

  delete: async (slug: string): Promise<Note> => {
    const res = await api.delete<ApiResponse<Note>>(`/notes/${slug}`);
    return res.data.data;
  },
};

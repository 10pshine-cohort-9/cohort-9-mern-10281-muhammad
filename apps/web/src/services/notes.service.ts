import { api } from "../api/axios";

export const notesService = {
  create: async (data: any): Promise<any> => {
    const res = await api.post("/notes", data);
    return res.data.data;
  },

  getAll: async (): Promise<any> => {
    const res = await api.get("/notes");
    return res.data.data;
  },

  get: async (slug: string): Promise<void> => {
    const res = await api.get(`/notes/${slug}`);
    return res.data.data;
  },

  update: async (slug: string, data: any): Promise<void> => {
    const res = await api.patch(`/notes/${slug}`, data);
    return res.data.data;
  },
  delete: async (slug: string): Promise<void> => {
    const res = await api.delete(`/notes/${slug}`);
    return res.data.data;
  },
};

import { create } from "zustand";

export type User = {
  id: string;
  username: string;
  email: string;
};

type AuthState = {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  setLoading: (value: boolean) => void;
  setAuth: (accessToken: string | null, user: User | null) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  loading: true,

  setAuth: (accessToken, user) =>
    set({
      accessToken,
      user,
      loading: false,
    }),

  logout: () =>
    set({
      accessToken: null,
      user: null,
    }),

  setLoading: (value) => set({ loading: value }),
}));

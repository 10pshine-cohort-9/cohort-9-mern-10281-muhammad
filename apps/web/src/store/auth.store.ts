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
  revision: number;
  setLoading: (value: boolean) => void;
  setAuth: (accessToken: string | null, user: User | null) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  loading: true,
  revision: 0,

  setAuth: (accessToken, user) =>
    set((state) => ({
      accessToken,
      user,
      loading: false,
      revision: state.revision + 1,
    })),

  logout: () =>
    set((state) => ({
      accessToken: null,
      user: null,
      revision: state.revision + 1,
    })),

  setLoading: (value) => set({ loading: value }),
}));

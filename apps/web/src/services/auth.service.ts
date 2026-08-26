import { api } from "../api/axios";
import type { LoginInput, SignupInput } from "../validation/auth.validation";

export type User = {
  id: string;
  username: string;
  email: string;
};

export type AuthResponse = {
  accessToken: string;
  user: User;
};

export const authService = {
  refresh: async (): Promise<AuthResponse> => {
    const res = await api.post("/auth/refresh");
    return res.data.data;
  },

  login: async (data: LoginInput): Promise<AuthResponse> => {
    const res = await api.post("/auth/login", data);
    return res.data.data;
  },

  signup: async (
    data: Omit<SignupInput, "confirmPassword">,
  ): Promise<AuthResponse> => {
    const res = await api.post("/auth/register", data);
    return res.data.data;
  },
  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },
};

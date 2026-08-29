import type { ReactElement } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

export default function GuestRoute(): ReactElement | null {
  const loading = useAuthStore((s) => s.loading);
  const accessToken = useAuthStore((s) => s.accessToken);

  if (loading) return null;

  if (accessToken) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

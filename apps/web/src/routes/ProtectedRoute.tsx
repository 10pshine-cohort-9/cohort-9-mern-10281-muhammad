import type { ReactElement } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

export default function ProtectedRoute(): ReactElement {
  const loading = useAuthStore((s) => s.loading);
  const accessToken = useAuthStore((s) => s.accessToken);

  if (!loading && !accessToken) return <Navigate to="/login" />;

  return <Outlet />;
}

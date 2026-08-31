import type { ReactElement } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

export default function GuestRoute(): ReactElement {
  const accessToken = useAuthStore((s) => s.accessToken);

  if (accessToken) return <Navigate to="/" />;

  return <Outlet />;
}

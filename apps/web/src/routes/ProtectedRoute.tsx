import type { ReactElement } from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute(): ReactElement {
  const isAuth = true;

  return isAuth ? <Outlet /> : <Navigate to="/login" />;
}

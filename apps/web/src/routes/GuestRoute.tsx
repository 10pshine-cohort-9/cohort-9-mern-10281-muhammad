import type { ReactElement } from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function GuestRoute(): ReactElement {
  const isAuth = false;

  return !isAuth ? <Outlet /> : <Navigate to="/" />;
}

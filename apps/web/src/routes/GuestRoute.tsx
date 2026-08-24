import { Navigate, Outlet } from "react-router-dom";

export default function GuestRoute() {
  const isAuth = false;

  return !isAuth ? <Outlet /> : <Navigate to="/" />;
}

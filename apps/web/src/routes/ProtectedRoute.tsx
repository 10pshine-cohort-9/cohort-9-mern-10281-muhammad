import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const isAuth = true;

  return isAuth ? <Outlet /> : <Navigate to="/login" />;
}

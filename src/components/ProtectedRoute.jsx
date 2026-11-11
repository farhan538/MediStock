
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const isLoggedIn = localStorage.getItem("medistock_admin") === "true";

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
}

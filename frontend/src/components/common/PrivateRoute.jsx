import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PrivateRoute({ children, allowedRoles }) {
  const token =
    useSelector((s) => s.auth.token) || localStorage.getItem("token");
  const user =
    useSelector((s) => s.auth.user) ||
    JSON.parse(localStorage.getItem("user") || "null");
  const loc = useLocation();

  // not logged in → send to login with redirect, and REPLACE history
  if (!token) {
    const target = `/login?redirect=${encodeURIComponent(
      loc.pathname + loc.search
    )}`;
    return <Navigate to={target} replace />;
  }

  // role not allowed
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

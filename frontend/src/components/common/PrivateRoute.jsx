import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PrivateRoute({ children, allowedRoles }) {
  const user = useSelector((s) => s.auth.user) || JSON.parse(localStorage.getItem("user") || "null");
  const loc = useLocation();

  if (!user) {
    const target = `/login?redirect=${encodeURIComponent(loc.pathname + loc.search)}`;
    return <Navigate to={target} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}












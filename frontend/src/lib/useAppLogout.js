import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../slices/authSlice";
import socket from "./socket";
import api from "@/services/api"; 

export default function useAppLogout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return async () => {
    try { socket?.disconnect?.(); } catch {}

    // server-side cookie clear (HttpOnly)
    try { await api.post("/auth/logout"); } catch {}

    // local fallbacks (if any code still reads from localStorage)
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch {}

    dispatch(logout());

    // go to landing page, not login
    navigate("/", { replace: true });
  };
}

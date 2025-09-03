import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../slices/authSlice";
import socket from "./socket";

export default function useAppLogout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return () => {
   try { socket.disconnect(); } catch {}
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch(logout());
    navigate("/login", { replace: true }); // history clear
  };
}

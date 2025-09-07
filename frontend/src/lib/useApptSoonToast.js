import { useEffect } from "react";
import socket from "./socket";

export default function useApptSoonToast(notify) {
  useEffect(() => {
    const handler = (p) => notify?.(p?.message || "Appointment starts soon.");
    socket.on("appt:startsSoon", handler);
    return () => socket.off("appt:startsSoon", handler);
  }, [notify]);
}




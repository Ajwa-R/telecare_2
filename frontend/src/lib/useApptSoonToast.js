import { useEffect } from "react";
import socket from "./socket";

export default function useApptSoonToast(notify) {
  useEffect(() => {
    const handler = (p) => notify?.(p?.message || "Appointment starts soon.");
    socket.on("appt:startsSoon", handler);
    return () => socket.off("appt:startsSoon", handler);
  }, [notify]);
}




// import { useEffect } from "react";
// import socket, { ensureSocketConnected } from "./socket";

// export default function useApptSoonToast(showToast) {
//   useEffect(() => {
//     ensureSocketConnected(); // ✅ connect once with token
//     const handler = (p) => showToast?.(p?.message || "Appointment in 5 minutes");
//     socket.on("appt:startsSoon", handler);
//     return () => socket.off("appt:startsSoon", handler);
//   }, [showToast]);
// }

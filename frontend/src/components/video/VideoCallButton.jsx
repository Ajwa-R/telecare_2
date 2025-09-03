import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const EARLY_MIN = 10;       // can join 10 min before
const LATE_GRACE_MIN = 15;  // can join until 15 min after

export default function VideoCallButton({ appointment }) {
  const navigate = useNavigate();
  const [now, setNow] = useState(Date.now());

  const startMs = useMemo(() => {
    const raw = appointment?.startAt || appointment?.date;
    return raw ? new Date(raw).getTime() : NaN;
  }, [appointment]);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 15 * 1000);
    return () => clearInterval(id);
  }, []);

  if (!startMs || Number.isNaN(startMs)) return null;

  const canJoin =
    now >= startMs - EARLY_MIN * 60_000 &&
    now <= startMs + LATE_GRACE_MIN * 60_000;

  const label = (() => {
    const diffMin = Math.round((startMs - now) / 60_000);
    if (diffMin > 0) return `Starts in ${diffMin} min`;
    if (diffMin <= 0 && now <= startMs + LATE_GRACE_MIN * 60_000) {
      const left = Math.max(0, Math.round((startMs + LATE_GRACE_MIN * 60_000 - now) / 60_000));
      return `In progress • ${left} min left to join`;
    }
    return `Expired`;
  })();

  const go = () => navigate(`/call/${appointment._id}`);

  return (
    <button
      onClick={go}
      disabled={!canJoin}
      className={`px-4 py-2 rounded text-white ${
        canJoin ? "bg-emerald-600 hover:bg-emerald-700" : "bg-gray-300 cursor-not-allowed"
      }`}
      title={label}
    >
      {canJoin ? "Join Video Call" : label}
    </button>
  );
}




// import { useNavigate } from "react-router-dom";
// import React, { useEffect, useMemo, useState } from "react";

// const withinWindow = (startAt) => {
//   const start = new Date(startAt).getTime();
//   const now = Date.now();
//   const diff = Math.abs(start - now);
//   return diff <= 15 * 60 * 1000; // 15 minutes window
// };


// export default function VideoCallButton({ appointment, isAllowed }) {
//   const navigate = useNavigate();

//   if (!appointment?._id || !appointment?.startAt) return null;

//   // ✅ Fallback logic if `isAllowed` not passed as prop
//   const allowed = typeof isAllowed === "boolean"
//     ? isAllowed
//     : withinWindow(appointment.startAt);

//   const onJoin = () => allowed
//     ? navigate(`/call/${appointment._id}`)
//     : alert("Call window not open yet.");

//   return (
//     <button
//       onClick={onJoin}
//       className={`ml-2 px-3 py-1 rounded text-white ${
//         allowed ? "bg-emerald-600 hover:bg-emerald-700" : "bg-gray-500 cursor-not-allowed"
//       }`}
//       disabled={!allowed}
//     >
//       {allowed ? "Join Video Call" : "Call Not Open"}
//     </button>
//   );
// }

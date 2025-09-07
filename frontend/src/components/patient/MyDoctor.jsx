import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../../services/api";

export default function MyDoctor({ onOpenChat, onBookAgain }) {
  const user = useSelector((s) => s.auth.user);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    if (!user?._id) return;
    (async () => {
      try {
        const d = await api.get(`/appointments/patient/${user._id}/doctors`);
        setDoctors(Array.isArray(d) ? d : []);
      } catch {
        setDoctors([]);
      }
    })();
  }, [user?._id]);

  if (!doctors.length)
    return (
      <div className="bg-white p-6 rounded-xl shadow">
        <div className="font-semibold mb-2">My Doctors</div>
        <p className="text-gray-600">
          No doctors yet. Book an appointment to see them here.
        </p>
      </div>
    );

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="font-semibold mb-4">My Doctors</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {doctors.map((d) => (
          <div
            key={d._id}
            className="p-4 border rounded-xl flex items-center gap-3"
          >
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(d.name || "Doctor")}`}
              alt={d.name}
              className="w-14 h-14 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="font-semibold">{d.name}</div>
              <div className="text-sm text-gray-600">{d.specialization}</div>
              {d.lastAppointmentAt && (
                <div className="text-xs text-gray-500">
                  Last visit: {new Date(d.lastAppointmentAt).toLocaleString()}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <button
                className="px-3 py-1 rounded bg-emerald-600 text-white text-sm"
                onClick={() => onOpenChat?.(d)}
              >
                Chat
              </button>
              <button
                className="px-3 py-1 rounded bg-gray-100 text-sm"
                onClick={() => onBookAgain?.(d)}
              >
                Book again
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

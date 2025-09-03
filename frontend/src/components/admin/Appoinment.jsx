// src/components/admin/Appoinment.jsx
import React, { useEffect, useMemo, useState } from "react";

const API_BASE = "http://localhost:5000/api";

function isSameLocalDay(isoOrDate, ref = new Date()) {
  if (!isoOrDate) return false;
  const d = new Date(isoOrDate);
  return d.toDateString() === ref.toDateString();
}

export default function Appoinment({ dateFilter = "today", doctors = [] }) {
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("authToken") ||
        "";
      const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      // ✅ Fallback: aggregate per-doctor appointments (this endpoint exists in your app)
      let merged = [];
      if (Array.isArray(doctors) && doctors.length > 0) {
        for (const doc of doctors) {
          const id = doc?._id || doc?.id;
          if (!id) continue;
          try {
            const r = await fetch(`${API_BASE}/appointments/doctor/${id}`, {
              headers,
            });
            if (!r.ok) continue;
            const body = await r.json();
            const list = Array.isArray(body) ? body : [];
            merged = merged.concat(list);
          } catch {
            /* skip this doctor */
          }
        }
      }

      // normalize
      const normalized = merged.map((a) => ({
        id: a._id || a.id,
        patientName:
          a.patientName || a?.patientId?.name || a?.patientId || "Patient",
        doctorName:
          a.doctorName || a?.doctorId?.name || a?.doctorId || "Doctor",
        startAt: a.startAt || a.date || null,
        condition: a.condition || "-",
        status: a.status || a.state || "booked",
      }));

      if (!cancelled) {
        setAll(normalized);
        setSource("/appointments/doctor/:id (merged)");
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [doctors]);

  const items = useMemo(() => {
    if (dateFilter !== "today") return all;
    return all.filter((x) => isSameLocalDay(x.startAt));
  }, [all, dateFilter]);

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Today’s Appointments</h3>
        <div className="flex items-center gap-2">
          {source && (
            <span className="text-[11px] text-gray-500 px-2 py-0.5 rounded bg-gray-100">
              src: {source}
            </span>
          )}
          <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded">
            {dateFilter}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="text-gray-600 text-sm">Loading…</div>
      ) : items.length === 0 ? (
        <div className="text-gray-600 text-sm">
          {doctors?.length ? "No appointments for today." : "No approved doctors found."}
        </div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map((x, i) => (
            <li key={x.id || i} className="border rounded-xl p-4">
              <p className="font-semibold">Patient: {x.patientName}</p>
              <p className="text-sm text-gray-600">Doctor: {x.doctorName}</p>
              {x.startAt && (
                <p className="text-sm text-gray-600">
                  Date: {new Date(x.startAt).toLocaleString()}
                </p>
              )}
              <p className="text-sm text-gray-600">Condition: {x.condition}</p>
              <div className="mt-2 text-xs">
                <span className="inline-block px-2 py-0.5 rounded bg-gray-100">
                  {x.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

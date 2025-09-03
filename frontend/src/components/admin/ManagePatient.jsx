// src/components/admin/ManagePatient.jsx
import React, { useEffect, useState } from "react";

const API_BASE = "http://localhost:5000/api";

export default function ManagePatient() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        // Adjust to your backend: /users/patients OR /patients
        const urls = [
          `${API_BASE}/users/patients`,
          `${API_BASE}/patients`,
        ];
        let data = [];
        for (const u of urls) {
          try {
            const r = await fetch(u);
            if (r.ok) {
              data = await r.json();
              break;
            }
          } catch {}
        }
        if (!Array.isArray(data)) data = [];
        const normalized = data.map((p) => ({
          id: p._id || p.id,
          name: p.name || "-",
          email: p.email || "-",
          phone: p.phone || p.mobile || "-",
          status: p.status || "active",
        }));
        if (!cancelled) setItems(normalized);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Manage Patients</h3>
      </div>

      {loading ? (
        <div className="text-gray-600 text-sm">Loading…</div>
      ) : items.length === 0 ? (
        <div className="text-gray-600 text-sm">No patients found.</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="py-2 px-3">Name</th>
                <th className="py-2 px-3">Email</th>
                <th className="py-2 px-3">Phone</th>
                <th className="py-2 px-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="py-2 px-3">{p.name}</td>
                  <td className="py-2 px-3">{p.email}</td>
                  <td className="py-2 px-3">{p.phone}</td>
                  <td className="py-2 px-3">{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

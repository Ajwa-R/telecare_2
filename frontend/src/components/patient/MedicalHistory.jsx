// src/components/patient/MedicalHistory.jsx
import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import api from "../../services/api";

export default function MedicalHistory() {
  const user = useSelector((s) => s.auth.user);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const printRef = useRef(null);

  useEffect(() => {
    if (!user?._id) return;
    (async () => {
      try {
        setLoading(true);
        // axios instance already points to .../api
        const data = await api.get(`/prescriptions/patient/${user._id}`);
        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        setErr(e.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, [user?._id]);

  const onPrint = () => {
    const wnd = window.open("", "print", "width=900,height=700");
    if (!wnd) return;
    wnd.document.write(`
       <html><head><title>Medical History</title>
       <style>
         body{font-family:system-ui,Segoe UI,Roboto,Arial}
         h2{margin:0 0 8px}
         table{width:100%;border-collapse:collapse;margin:8px 0}
         th,td{border:1px solid #ddd;padding:6px;font-size:13px}
         .card{border:1px solid #eee;border-radius:10px;padding:12px;margin-bottom:12px}
         small{color:#777}
       </style></head>
       <body>${printRef.current?.innerHTML || ""}</body></html>
     `);
    wnd.document.close();
    wnd.focus();
    wnd.print();
    wnd.close();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="font-semibold text-lg">Medical History</div>
        <button
          onClick={onPrint}
          className="px-3 py-1 rounded bg-emerald-600 text-white text-sm"
        >
          Print
        </button>
      </div>

      {loading && <p className="text-gray-500">Loading…</p>}
      {!loading && err && <p className="text-red-600">{err}</p>}
      {!loading && !err && items.length === 0 && (
        <p className="text-gray-600">No records yet.</p>
      )}

      <div ref={printRef} className="space-y-6">
        {items.map((rx) => (
          <div key={rx._id} className="border rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">
                  {rx.title || "Prescription"}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(rx.createdAt).toLocaleString()}
                </div>
              </div>
              <span className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 rounded">
                #{rx._id.slice(-6)}
              </span>
            </div>

            {rx.diagnosis && (
              <div className="mt-3">
                <div className="text-sm font-medium">Diagnosis</div>
                <div className="text-sm text-gray-700 whitespace-pre-wrap">
                  {rx.diagnosis}
                </div>
              </div>
            )}

            {Array.isArray(rx.meds) && rx.meds.length > 0 && (
              <div className="mt-3">
                <div className="text-sm font-medium mb-1">Medicines</div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm border">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="p-2 border">Name</th>
                        <th className="p-2 border">Dose</th>
                        <th className="p-2 border">Frequency</th>
                        <th className="p-2 border">Duration</th>
                        <th className="p-2 border">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rx.meds.map((m, i) => (
                        <tr key={i}>
                          <td className="p-2 border">{m.name}</td>
                          <td className="p-2 border">{m.dose}</td>
                          <td className="p-2 border">{m.frequency}</td>
                          <td className="p-2 border">{m.duration}</td>
                          <td className="p-2 border">{m.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {rx.advice && (
              <div className="mt-3">
                <div className="text-sm font-medium">Doctor’s Advice</div>
                <div className="text-sm text-gray-700 whitespace-pre-wrap">
                  {rx.advice}
                </div>
              </div>
            )}

            {Array.isArray(rx.attachments) && rx.attachments.length > 0 && (
              <div className="mt-3">
                <div className="text-sm font-medium mb-1">Attachments</div>
                <ul className="list-disc pl-6 text-sm">
                  {rx.attachments.map((a, i) => (
                    <li key={i}>
                      {a.url ? (
                        <a
                          href={a.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 underline"
                        >
                          {a.name || a.url}
                        </a>
                      ) : (
                        a.name
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

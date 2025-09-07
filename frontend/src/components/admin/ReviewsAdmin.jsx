import React, { useEffect, useState } from "react";
import api from "../../services/api";

export default function ReviewsAdmin() {
  const [items, setItems] = useState([]);
   const load = async () => {
    try {
      const data = await api.get("/reviews/admin"); // after Patch-1 this IS the list
      setItems(Array.isArray(data) ? data : (data?.items || []));
    } catch {
      setItems([]);
    }
  }

  useEffect(() => { load(); }, []);

const approve = async (id) => { await api.patch(`/reviews/${id}/approve`); load(); };
  const unapprove = async (id) => { await api.patch(`/reviews/${id}/reject`); load(); };
  const remove = async (id) => {
    if (!confirm("Delete review?")) return;
   await api.delete(`/reviews/${id}`);
    load();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="font-semibold mb-4">User Reviews</div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left bg-emerald-100">
              <th className="p-2">Name</th>
              <th className="p-2">Role</th>
              <th className="p-2">City</th>
              <th className="p-2">Rating</th>
              <th className="p-2">Text</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length ? items.map(r => (
              <tr key={r._id} className="border-t">
                <td className="p-2">{r.name}</td>
                <td className="p-2 capitalize">{r.role}</td>
                <td className="p-2">{r.city || "-"}</td>
                <td className="p-2">{r.rating}★</td>
                <td className="p-2 max-w-[420px]">{r.text}</td>
                <td className="p-2">{r.approved ? "Approved ✅" : "Pending ⏳"}</td>
                <td className="p-2 space-x-2">
                  {!r.approved ? (
                    <button onClick={()=>approve(r._id)} className="px-3 py-1 bg-emerald-600 text-white rounded">Approve</button>
                  ) : (
                    <button onClick={()=>unapprove(r._id)} className="px-3 py-1 bg-yellow-500 text-white rounded">Unapprove</button>
                  )}
                  <button onClick={()=>remove(r._id)} className="px-3 py-1 bg-red-100 text-red-600 rounded">Delete</button>
                </td>
              </tr>
            )) : (
              <tr><td className="p-4 text-gray-500" colSpan={7}>No reviews</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

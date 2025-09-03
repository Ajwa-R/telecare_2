// src/components/doctor/DocHeader.jsx
import React from "react";
import { FaVideo, FaUserEdit } from "react-icons/fa";

const DEFAULT_STATS = { todayCount: 0, totalPatients: 0, nextLabel: "—" };

const DocHeader = ({ user = {}, stats = DEFAULT_STATS, onEdit, onStartCall }) => {
  // Merge to guarantee keys exist even if stats is undefined/partial
  const s = { ...DEFAULT_STATS, ...(stats || {}) };

  const avatar = user?.image || "/default-avatar.png";
  const status = user?.status || "Online";
  const name = user?.name || "Doctor";

  return (
    <div className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-center gap-4">
        <img
          src={avatar}
          alt={name}
          className="h-14 w-14 rounded-full object-cover"
          onError={(e) => { e.currentTarget.src = "/default-avatar.png"; }}
        />
        <div>
          <div className="text-xl font-semibold">Welcome, Dr. {name}</div>
          <div className="text-sm">
            <span
              className={`mr-2 inline-flex h-2 w-2 rounded-full ${
                status === "Online" ? "bg-emerald-500" : "bg-gray-400"
              }`}
            />
            {status}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-gray-50 rounded-xl px-4 py-3">
          <div className="text-xs opacity-70">Today’s Appointments</div>
          <div className="text-2xl font-semibold">{s.todayCount}</div>
        </div>
        <div className="bg-gray-50 rounded-xl px-4 py-3">
          <div className="text-xs opacity-70">Total Patients</div>
          <div className="text-2xl font-semibold">{s.totalPatients}</div>
        </div>
        <div className="bg-gray-50 rounded-xl px-4 py-3">
          <div className="text-xs opacity-70">Upcoming Call</div>
          <div className="text-lg font-semibold">{s.nextLabel}</div>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-ghost flex items-center gap-2" onClick={onEdit}>
            <FaUserEdit /> Edit Profile
          </button>
          <button className="btn btn-primary flex items-center gap-2" onClick={onStartCall}>
            <FaVideo /> Start Call
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocHeader;

// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import ReviewsAdmin from "../components/admin/ReviewsAdmin";
import {
  FaUserMd,
  FaUsers,
  FaCalendarAlt,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import ManagePatient from "../components/admin/ManagePatient";
import Appoinment from "../components/admin/Appoinment";
import useAppLogout from "../lib/useAppLogout";

const API_BASE = "http://localhost:5000/api";

const AdminDashboard = () => {
  // ===== SAME LOGIC / STATE =====
  const doLogout = useAppLogout();
  const [activeTab, setActiveTab] = useState("doctors"); // sidebar tab
  const [doctorView, setDoctorView] = useState("pending"); // "pending" | "approved"
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [approvedDoctors, setApprovedDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") || "doctors"; // admin example
  const setTab = (t) => setParams({ tab: t }, { replace: false });

  // Mobile drawer (UI only)
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ===== FETCH HELPERS (unchanged) =====
  const fetchPending = async () => {
    const res = await fetch(`${API_BASE}/users/doctors/pending`);
    if (!res.ok) throw new Error("pending fetch failed");
    return res.json();
  };
  const fetchApproved = async () => {
    const res = await fetch(`${API_BASE}/users/doctors/approved`);
    if (!res.ok) throw new Error("approved fetch failed");
    return res.json();
  };

  // initial Load both lists on mount (unchanged)
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [p, a] = await Promise.all([fetchPending(), fetchApproved()]);
        setPendingDoctors(p || []);
        setApprovedDoctors(a || []);
      } catch (e) {
        console.error("Failed to load doctors:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // doctor actions (unchanged)
  const handleApprove = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/users/doctors/${id}/approve`, {
        method: "PUT",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Approve failed");

      // Optimistic UI
      setPendingDoctors((prev) => prev.filter((d) => d._id !== id));
      setApprovedDoctors((prev) => [data.doctor, ...prev]);

      alert("Doctor approved ✅");
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to approve doctor");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;
    try {
      const res = await fetch(`${API_BASE}/users/doctors/${id}`, {
        method: "DELETE",
      });
    const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Delete failed");

      setPendingDoctors((prev) => prev.filter((d) => d._id !== id));
      setApprovedDoctors((prev) => prev.filter((d) => d._id !== id));
      alert("Doctor deleted 🗑️");
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to delete doctor");
    }
  };

  // Which list to show (unchanged)
  const list = doctorView === "pending" ? pendingDoctors : approvedDoctors;

  // ===== UI — polished to match your mock =====
  return (
    <div className="min-h-screen bg-emerald-50/60">
      {/* Header */}
      <header className="mx-auto max-w-[1280px] px-4 pt-6 relative">
        <div className="w-full bg-emerald-700 text-white rounded-2xl md:rounded-3xl shadow-md">
          <h1 className="text-center text-[22px] md:text-[28px] font-extrabold tracking-wide py-3 md:py-4">
            Admin panel
          </h1>
        </div>

        {/* Hamburger (mobile only) */}
        <button
          className="md:hidden absolute right-6 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-white/10"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <span className="block w-6 h-0.5 bg-white mb-1" />
          <span className="block w-6 h-0.5 bg-white mb-1" />
          <span className="block w-6 h-0.5 bg-white" />
        </button>
      </header>

      {/* Main layout */}
      <div className="mx-auto max-w-[1280px] px-4 py-6">
        <div className="flex gap-8">
          {/* Sidebar: desktop static, mobile drawer */}
          <aside
            className={[
              "w-[250px] shrink-0 bg-emerald-700 text-white rounded-2xl md:rounded-3xl shadow-lg p-6 h-fit",
              // desktop
              "md:static md:translate-x-0 md:block",
              // mobile drawer
              "fixed inset-y-0 left-0 z-50 w-72 md:w-[250px] md:inset-auto md:relative",
              "transition-transform duration-200",
              sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
            ].join(" ")}
          >
            {/* Close (mobile) */}
            <button
              className="md:hidden mb-4 px-3 py-2 rounded-lg bg-white/10"
              onClick={() => setSidebarOpen(false)}
            >
              Close ✖
            </button>

            <nav className="flex flex-col gap-4">
              <button
                onClick={() => { setActiveTab("doctors"); setSidebarOpen(false); }}
                className={`text-left capitalize font-semibold tracking-wide px-4 py-3 rounded-xl transition ${
                  activeTab === "doctors" ? "bg-white/15" : "hover:bg-white/10"
                }`}
              >
                <span className="flex items-center gap-3">
                  <FaUserMd /> manage doctor
                </span>
              </button>

              <button
                onClick={() => { setActiveTab("patients"); setSidebarOpen(false); }}
                className={`text-left capitalize font-semibold tracking-wide px-4 py-3 rounded-xl transition ${
                  activeTab === "patients" ? "bg-white/15" : "hover:bg-white/10"
                }`}
              >
                <span className="flex items-center gap-3">
                  <FaUsers /> manage patient
                </span>
              </button>

              <button
  onClick={() => { setActiveTab("appointments"); setSidebarOpen(false); }}
  className={`text-left capitalize font-semibold tracking-wide px-4 py-3 rounded-xl transition ${
    activeTab === "appointments" ? "bg-white/15" : "hover:bg-white/10"
  }`}
>
  <span className="flex items-center gap-3">
    <FaCalendarAlt /> appointments
  </span>
</button>


              <button
                onClick={() => { setActiveTab("reviews"); setSidebarOpen(false); }}
                className={`text-left capitalize font-semibold tracking-wide px-4 py-3 rounded-xl transition ${
                  activeTab === "reviews" ? "bg-white/15" : "hover:bg-white/10"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className="text-yellow-300">★</span> reviews
                </span>
              </button>

              <button
                onClick={() => { setActiveTab("settings"); setSidebarOpen(false); }}
                className={`text-left capitalize font-semibold tracking-wide px-4 py-3 rounded-xl transition ${
                  activeTab === "settings" ? "bg-white/15" : "hover:bg-white/10"
                }`}
              >
                <span className="flex items-center gap-3">
                  <FaCog /> settings
                </span>
              </button>

              <div className="h-px bg-white/20 my-2" />

              <button
   onClick={doLogout}
   className="text-left capitalize font-semibold tracking-wide px-4 py-3 rounded-xl hover:bg-white/10 transition"
 >
                <span className="flex items-center gap-3">
                  <FaSignOutAlt /> logout
                </span>
              </button>
            </nav>
          </aside>

          {/* Backdrop (mobile) */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Content */}
          <main className="flex-1 min-w-0">

  {/* DOCTORS */}
  {activeTab === "doctors" && (
    <div className="bg-white rounded-2xl md:rounded-3xl shadow-md p-6 md:p-7">
      <h2 className="text-lg md:text-xl font-semibold mb-4">Manage Doctors</h2>

      {/* Toggle Pending / Approved (UNCHANGED) */}
      <div className="mb-4 flex gap-3">
        <button
          onClick={() => setDoctorView("pending")}
          className={`px-4 py-2 rounded-lg border transition ${
            doctorView === "pending"
              ? "bg-emerald-600 text-white border-emerald-600"
              : "bg-gray-100 hover:bg-gray-200 border-gray-200"
          }`}
        >
          Pending ({pendingDoctors.length})
        </button>
        <button
          onClick={() => setDoctorView("approved")}
          className={`px-4 py-2 rounded-lg border transition ${
            doctorView === "approved"
              ? "bg-emerald-600 text-white border-emerald-600"
              : "bg-gray-100 hover:bg-gray-200 border-gray-200"
          }`}
        >
          Approved ({approvedDoctors.length})
        </button>
      </div>

      {/* Doctors Table (UNCHANGED) */}
      <div className="overflow-x-auto rounded-xl border border-emerald-200">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-emerald-100 text-left">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Specialization</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="py-4 px-4" colSpan={4}>
                  Loading...
                </td>
              </tr>
            ) : (doctorView === "pending" ? pendingDoctors : approvedDoctors).length === 0 ? (
              <tr>
                <td className="py-4 px-4" colSpan={4}>
                  No records
                </td>
              </tr>
            ) : (
              (doctorView === "pending" ? pendingDoctors : approvedDoctors).map((doc) => (
                <tr key={doc._id} className="border-t hover:bg-gray-50">
                  <td className="py-2 px-4">{doc.name}</td>
                  <td className="py-2 px-4">{doc.specialization || "-"}</td>
                  <td className="py-2 px-4">
                    {doctorView === "approved" ? (
                      <span className="text-green-600 font-semibold">Approved</span>
                    ) : (
                      <span className="text-yellow-700 font-semibold">Pending</span>
                    )}
                  </td>
                  <td className="py-2 px-4 space-x-2">
                    {doctorView === "pending" && (
                      <button
                        onClick={() => handleApprove(doc._id)}
                        className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700"
                      >
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(doc._id)}
                      className="bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )}

  {/* PATIENTS */}
  {activeTab === "patients" && (
    <div className="bg-white rounded-2xl md:rounded-3xl shadow-md p-6 md:p-7">
      <ManagePatient />
    </div>
  )}

  {/* APPOINTMENTS (Today) */}
  {activeTab === "appointments" && (
   <div className="bg-white rounded-2xl md:rounded-3xl shadow-md p-6 md:p-7">
     <Appoinment dateFilter="today" doctors={approvedDoctors} />
   </div>
 )}

  {/* REVIEWS */}
  {activeTab === "reviews" && (
    <div className="bg-white rounded-2xl md:rounded-3xl shadow-md p-6 md:p-7">
      <ReviewsAdmin />
    </div>
  )}

  {/* (Optional) SETTINGS placeholder */}
  {activeTab === "settings" && (
    <div className="bg-white rounded-2xl md:rounded-3xl shadow-md p-6 md:p-7">
      <div className="text-sm text-gray-600">Settings coming soon…</div>
    </div>
  )}
</main>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;





// // src/pages/AdminDashboard.jsx
// import React, { useEffect, useState } from "react";
// import ReviewsAdmin from "../components/admin/ReviewsAdmin";
// import {
//   FaUserMd,
//   FaUsers,
//   FaCalendarAlt,
//   FaCog,
//   FaSignOutAlt,
// } from "react-icons/fa";
// import { useSearchParams } from "react-router-dom";

// const API_BASE = "http://localhost:5000/api";

// const AdminDashboard = () => {
//   const [activeTab, setActiveTab] = useState("doctors"); // sidebar tab
//   const [doctorView, setDoctorView] = useState("pending"); // "pending" | "approved"
//   const [pendingDoctors, setPendingDoctors] = useState([]);
//   const [approvedDoctors, setApprovedDoctors] = useState([]);
//   const [loading, setLoading] = useState(false);
//   //...
//   const [params, setParams] = useSearchParams();
// const tab = params.get("tab") || "doctors"; // admin example
// const setTab = (t)=> setParams({ tab: t }, { replace: false });

//   // Fetch helpers
//   const fetchPending = async () => {
//     const res = await fetch(`${API_BASE}/users/doctors/pending`);
//     if (!res.ok) throw new Error("pending fetch failed");
//     return res.json();
//   };
//   const fetchApproved = async () => {
//     const res = await fetch(`${API_BASE}/users/doctors/approved`);
//     if (!res.ok) throw new Error("approved fetch failed");
//     return res.json();
//   };

//   // initial Load both lists on mount
//   useEffect(() => {
//     (async () => {
//       try {
//         setLoading(true);
//         // loads lists, append:
//         const [p, a] = await Promise.all([fetchPending(), fetchApproved()]);
//         setPendingDoctors(p || []);
//         setApprovedDoctors(a || []);
//       } catch (e) {
//         console.error("Failed to load doctors:", e);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   //  doctor actions
//   const handleApprove = async (id) => {
//     try {
//       const res = await fetch(`${API_BASE}/users/doctors/${id}/approve`, {
//         method: "PUT",
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data?.message || "Approve failed");

//       // Optimistic UI: move row
//       setPendingDoctors((prev) => prev.filter((d) => d._id !== id));
//       setApprovedDoctors((prev) => [data.doctor, ...prev]);

//       alert("Doctor approved ✅");
//     } catch (err) {
//       console.error(err);
//       alert(err.message || "Failed to approve doctor");
//     }
//   };

//   // Delete -> remove from whichever list it exists
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this doctor?")) return;
//     try {
//       const res = await fetch(`${API_BASE}/users/doctors/${id}`, {
//         method: "DELETE",
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data?.message || "Delete failed");

//       setPendingDoctors((prev) => prev.filter((d) => d._id !== id));
//       setApprovedDoctors((prev) => prev.filter((d) => d._id !== id));
//       alert("Doctor deleted 🗑️");
//     } catch (err) {
//       console.error(err);
//       alert(err.message || "Failed to delete doctor");
//     }
//   };

//     // Which list to show
//   const list = doctorView === "pending" ? pendingDoctors : approvedDoctors;

//   return (
//     <div className="min-h-screen flex">
//       {/* Sidebar */}
//       <aside className="w-64 bg-emerald-800 text-white p-6">
//         <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
//         <nav className="flex flex-col gap-4">
//           <button
//             onClick={() => setActiveTab("doctors")}
//             className="flex items-center gap-3 hover:text-emerald-300"
//           >
//             <FaUserMd /> Manage Doctors
//           </button>
//           <button
//             onClick={() => setActiveTab("patients")}
//             className="flex items-center gap-3 hover:text-emerald-300"
//           >
//             <FaUsers /> Manage Patients
//           </button>
//           <button
//             onClick={() => setActiveTab("appointments")}
//             className="flex items-center gap-3 hover:text-emerald-300"
//           >
//             <FaCalendarAlt /> Appointments
//           </button>
//           <button
//             onClick={() => setActiveTab("reviews")}
//             className="flex items-center gap-3 hover:text-emerald-300"
//           >
//             ⭐ Reviews
//           </button>

//           <button
//             onClick={() => setActiveTab("settings")}
//             className="flex items-center gap-3 hover:text-emerald-300"
//           >
//             <FaCog /> Settings
//           </button>
//           <button className="flex items-center gap-3 hover:text-red-400 mt-8">
//             <FaSignOutAlt /> Logout
//           </button>
//         </nav>
//       </aside>

//       {/* Main */}
//       <main className="flex-1 p-8">
//         <h1 className="text-2xl font-semibold mb-6">
//           {activeTab === "doctors"
//             ? "Manage Doctors"
//             : activeTab === "reviews"
//             ? "User Reviews"
//             : "Coming Soon"}
//         </h1>

//         {/* doctor tab */}
//         {activeTab === "doctors" && (
//           <>
//             {/* Toggle Pending / Approved */}
//             <div className="mb-4 flex gap-3">
//               <button
//                 onClick={() => setDoctorView("pending")}
//                 className={`px-4 py-2 rounded ${
//                   doctorView === "pending"
//                     ? "bg-emerald-600 text-white"
//                     : "bg-gray-200"
//                 }`}
//               >
//                 Pending ({pendingDoctors.length})
//               </button>
//               <button
//                 onClick={() => setDoctorView("approved")}
//                 className={`px-4 py-2 rounded ${
//                   doctorView === "approved"
//                     ? "bg-emerald-600 text-white"
//                     : "bg-gray-200"
//                 }`}
//               >
//                 Approved ({approvedDoctors.length})
//               </button>
//             </div>

//             <div className="overflow-x-auto">
//               <table className="min-w-full bg-white border rounded">
//                 <thead>
//                   <tr className="bg-emerald-100 text-left">
//                     <th className="py-3 px-4">Name</th>
//                     <th className="py-3 px-4">Specialization</th>
//                     <th className="py-3 px-4">Status</th>
//                     <th className="py-3 px-4">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {loading ? (
//                     <tr>
//                       <td className="py-4 px-4" colSpan={4}>
//                         Loading...
//                       </td>
//                     </tr>
//                   ) : list.length === 0 ? (
//                     <tr>
//                       <td className="py-4 px-4" colSpan={4}>
//                         No records
//                       </td>
//                     </tr>
//                   ) : (
//                     list.map((doc) => (
//                       <tr key={doc._id} className="border-t hover:bg-gray-50">
//                         <td className="py-2 px-4">{doc.name}</td>
//                         <td className="py-2 px-4">
//                           {doc.specialization || "-"}
//                         </td>
//                         <td className="py-2 px-4">
//                           {doctorView === "approved" ? (
//                             <span className="text-green-600 font-semibold">
//                               Approved
//                             </span>
//                           ) : (
//                             <span className="text-yellow-600 font-semibold">
//                               Pending
//                             </span>
//                           )}
//                         </td>
//                         <td className="py-2 px-4 space-x-2">
//                           {doctorView === "pending" && (
//                             <button
//                               onClick={() => handleApprove(doc._id)}
//                               className="bg-emerald-500 text-white px-3 py-1 rounded hover:bg-emerald-600"
//                             >
//                               Approve
//                             </button>
//                           )}
//                           <button
//                             onClick={() => handleDelete(doc._id)}
//                             className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//                           >
//                             Delete
//                           </button>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </>
//         )}

//         {/* ---- Reviews---- */}
//          {activeTab === "reviews" && <ReviewsAdmin />}
//       </main>
//     </div>
//   );
// };

// export default AdminDashboard;

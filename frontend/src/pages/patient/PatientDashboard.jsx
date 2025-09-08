// frontend/src/pages/PatientDashboard.jsx
import React, { useState, useEffect } from "react";

import AppointmentSection from "../../components/patient/AppointmentSection";
import MyDoctor from "../../components/patient/MyDoctor";
import ChatPanel from "../../components/patient/ChatPanel";
import MedicalHistory from "../../components/patient/MedicalHistory";
import FamilySubscription from "../../components/patient/FamilySubscription";
import socket, { ensureSocketConnected } from "../../lib/socket";
import api from "../../services/api";
import VideoCallButton from "../../components/video/VideoCallButton";
import useApptSoonToast from "../../lib/useApptSoonToast";
import useAppLogout from "../../lib/useAppLogout";
import { useSearchParams } from "react-router-dom";

import {
  FaUserMd,
  FaCalendarAlt,
  FaComments,
  FaVideo,
  FaHistory,
  FaUsers,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import logo from '../../assets/logo.png';

const PatientDashboard = () => {
  const doLogout = useAppLogout();

  const [params, setParams] = useSearchParams();
  const active = params.get("tab") || "home";
  const setActive = (t) => setParams({ tab: t }, { replace: false }); // home | appointments | chat | mydoctor | history | family
  const [chatTarget, setChatTarget] = useState(null); // { _id, name }
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = useSelector((state) => state.auth.user);
  const patientName = user?.name || "Guest";

  const [latestAppointment, setLatestAppointment] = useState(null);
  const shownDate = latestAppointment?.startAt || latestAppointment?.date;

  // new list of ALL upcoming (today + future)
  const [upcomingList, setUpcomingList] = useState([]);
  const loadUpcomingList = async () => {
    if (!user?._id) return;
    try {
      setUpcomingList(await api.get(`/appointments/upcoming-all/${user._id}`));
    } catch {
      setUpcomingList([]);
    }
  };

  // pick doctor from upcoming appt (fallback for chat/video)
  const getDoctorFromAppt = (appt) =>
    !appt
      ? { id: null, name: "Doctor" }
      : {
          id: appt.doctorId || appt?.doctor?._id || null,
          name: appt.doctorName || appt?.doctor?.name || "Doctor",
        };
  const { id: partnerId, name: partnerName } =
    getDoctorFromAppt(latestAppointment);

  // socket notif -> toast/alert
  useApptSoonToast((msg) => alert(msg));

  // Ensure socket connects globally (so notifications work even if Chat closed)
  useEffect(() => {
    ensureSocketConnected();
    const onConnect = () => console.log("🟢 Connected:", socket.id);
    const onDisconnect = () => console.log("🔴 Disconnected");
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  // Mount: load list of upcoming
  useEffect(() => {
    loadUpcomingList();
  }, [user?._id]);

  // Load nearest upcoming appointment
  useEffect(() => {
    if (!user?._id) return;
    api
      .get(`/appointments/upcoming/${user._id}`)
      .then((data) =>
        setLatestAppointment(
          data ? { ...data, startAt: data.startAt || data.date } : null
        )
      )
      .catch((err) => {
        console.error("❌ Fetch failed:", err);
        setLatestAppointment(null);
      });
  }, [user?._id]);

  // Local fallback timer (T-5 min)
  useEffect(() => {
    if (!latestAppointment?.startAt) return;
    const start = new Date(latestAppointment.startAt).getTime();
    let fired = false;
    const tick = () => {
      const now = Date.now();
      const diffMin = (start - now) / 60000;
      if (!fired && diffMin <= 5 && diffMin > 4.5) {
        fired = true;
        alert("Your appointment starts in 5 minutes.");
      }
    };
    tick();
    const id = setInterval(tick, 15 * 1000);
    return () => clearInterval(id);
  }, [latestAppointment?.startAt]);

  const handleBookAppointment = async (appointmentData) => {
    try {
      const data = await api.post(`/appointments`, appointmentData);
      console.log("✅ Appointment booked:", data);
      alert("Appointment booked successfully!");

      // refresh nearest upcoming
      try {
        const up = await api.get(`/appointments/upcoming/${user._id}`);
        setLatestAppointment(
          up ? { ...up, startAt: up.startAt || up.date } : null
        );
      } catch {
        setLatestAppointment(null);
      }

      // 🔹 ALSO refresh the list of all upcoming
      await loadUpcomingList();

      setActive("home");
    } catch (err) {
      console.error("❌ Booking failed:", err);
      alert("Something went wrong while booking appointment.");
    }
  };

  const SidebarItem = ({ icon, label, onClick }) => (
    <button
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2 rounded hover:bg-emerald-700 text-white transition w-full text-left"
    >
      {icon} <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      {/* Navbar */}
      <header className="flex items-center justify-between bg-white text-emerald-900 rounded-2xl my-6 mx-4 px-4 py-4 shadow-md md:px-6">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="h-10 w-10 rounded-full" />
          <span className="font-bold text-xl">TeleCare</span>
        </div>
        <div className="text-lg hidden md:block">
          Welcome, <span className="font-semibold">{patientName}</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="block md:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
          <button
            onClick={doLogout}
            className="hidden md:flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 mx-3 h-full w-64 bg-emerald-600 p-4 z-50 rounded-xl transform transition-transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:static md:translate-x-0 md:flex-shrink-0`}
        >
          <nav className="flex flex-col gap-4 pt-16 md:pt-0">
            <SidebarItem
              icon={<FaUserMd />}
              label="My Doctor"
              onClick={() => setActive("mydoctor")}
            />
            <SidebarItem
              icon={<FaCalendarAlt />}
              label="Appointments"
              onClick={() => setActive("appointments")}
            />
            <SidebarItem
              icon={<FaComments />}
              label="Chat"
              onClick={() => setActive("chat")}
            />
            {/* <SidebarItem icon={<FaVideo />} label="Video Call" /> */}
            <SidebarItem
              icon={<FaHistory />}
              label="Medical History"
              onClick={() => setActive("history")}
            />
            <SidebarItem
              icon={<FaUsers />}
              label="Family Subscription"
              onClick={() => setActive("family")}
            />
          </nav>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-40 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 mt-4 md:mt-0">
          <div className="text-xl font-semibold text-gray-700 mb-4">
            Welcome, <span className="text-emerald-600">{patientName}</span>
          </div>

          {/* SWITCH by `active` */}
          {active === "appointments" && (
            <AppointmentSection onBook={handleBookAppointment} />
          )}

          {active === "chat" && (
            <ChatPanel
              partnerId={chatTarget?._id || partnerId}
              partnerName={chatTarget?.name || partnerName}
            />
          )}

          {active === "mydoctor" && (
            <MyDoctor
              onOpenChat={(doc) => {
                setChatTarget({ _id: doc._id, name: doc.name });
                setActive("chat");
              }}
              onBookAgain={() => setActive("appointments")}
            />
          )}

          {active === "history" && <MedicalHistory />}

          {active === "family" && <FamilySubscription />}

          {/* Home: upcoming appointment + OTHER UPCOMING */}
          {active === "home" &&
            (latestAppointment ? (
              <>
                <div className="bg-white shadow rounded-xl p-6 border-l-4 border-emerald-500">
                  <h2 className="text-xl font-bold text-emerald-700 mb-2">
                    📅 Upcoming Appointment
                  </h2>
                  <p className="text-gray-700">
                    You have an appointment at{" "}
                    <strong>
                      {latestAppointment?.startAt
                        ? new Date(
                            latestAppointment.startAt
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "N/A"}
                    </strong>{" "}
                    on{" "}
                    <strong>
                      {shownDate
                        ? new Date(shownDate).toLocaleDateString([], {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "N/A"}
                    </strong>{" "}
                    for: <strong>{latestAppointment.condition}</strong>
                  </p>
                  <div className="mt-4">
                    <VideoCallButton appointment={latestAppointment} />
                  </div>
                </div>

                {/* 🔹 Other upcoming (not including the nearest one) */}
                {upcomingList.length > 1 && (
                  <div className="mt-6 bg-white shadow rounded-xl p-6">
                    <div className="font-semibold mb-3">Other upcoming</div>
                    <ul className="space-y-2">
                      {upcomingList.slice(1, 5).map((a) => (
                        <li key={a._id} className="text-sm text-gray-700">
                          {new Date(a.startAt).toLocaleString([], {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                          {" — "}
                          <span className="font-medium">{a.doctorName}</span>
                          {" • "}
                          <span className="text-gray-500">{a.condition}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <div className="text-gray-500">No upcoming appointments.</div>
            ))}
        </main>
      </div>
    </div>
  );
};

export default PatientDashboard;

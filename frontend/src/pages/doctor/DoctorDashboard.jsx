// src/pages/DoctorDashboard.jsx (responsive rev A)
import React, { useEffect, useState, useMemo, useRef } from "react";
import PrescriptionForm from "../../components/doctor/PrescriptionForm";
import {
  FaCalendarAlt,
  FaUserInjured,
  FaVideo,
  FaUserEdit,
  FaBars,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import DocHeader from "../../components/doctor/DocHeader";
import ChatPanel from "../../components/patient/ChatPanel"; // reuse component
import VideoCallButton from "../../components/video/VideoCallButton";
import { useNavigate, useSearchParams } from "react-router-dom";
import io from "socket.io-client";
import useApptSoonToast from "../../lib/useApptSoonToast";
import useAppLogout from "../../lib/useAppLogout";
import api from "../../services/api";
import { API_BASE } from "@/app/config";

const DoctorDashboard = () => {
  const doLogout = useAppLogout();

  const user = useSelector((state) => state.auth.user);
  const [appointments, setAppointments] = useState([]);
  const [showRxForm, setShowRxForm] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [chatPartner, setChatPartner] = useState({ id: null, name: "" });
  const [mobileActionsOpen, setMobileActionsOpen] = useState(false);

  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") || "doctors"; // admin example
  const setTab = (t) => setParams({ tab: t }, { replace: false });

  // ringing
  const navigate = useNavigate();
  const [incoming, setIncoming] = useState(null); // { appointmentId }
  const ringSocketsRef = useRef([]);

  // Fetch appointments
  useEffect(() => {
    if (!user?._id) return;

    (async () => {
      try {
        const list = await api.get(`/appointments/doctor/${user._id}`);
        const safe = Array.isArray(list) ? list : [];
        setAppointments(
          safe.map((a) => ({ ...a, startAt: a.startAt || a.date }))
        );
      } catch (err) {
        console.error("Failed to fetch appointments", err);
        setAppointments([]);
      }
    })();
  }, [user?._id]); //  precise dep

  const todayStr = new Date().toDateString();

  // Derived state
  const { todayList, uniquePatients, upcomingLabel } = useMemo(() => {
    const todayList = appointments.filter(
      (a) => a?.startAt && new Date(a.startAt).toDateString() === todayStr
    );

    const uniq = new Set(
      appointments.map(
        (a) => a?.patientId?._id || a?.patientId || a?.patientName || ""
      )
    ).size;

    const now = new Date();
    const future = appointments
      .map((a) => (a?.startAt ? new Date(a.startAt) : null)) //samjhnA HA
      .filter((d) => d && d >= now)
      .sort((a, b) => a - b);

    let label = "—";
    if (future[0]) {
      const diff = future[0] - now;
      label =
        diff <= 15 * 60 * 1000
          ? "Soon"
          : future[0].toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
    }

    return { todayList, uniquePatients: uniq, upcomingLabel: label };
  }, [appointments, todayStr]);

  // ✅ Build stats for DocHeader
  const stats = useMemo(
    () => ({
      todayCount: todayList.length,
      totalPatients: uniquePatients, // ya jo field DocHeader expect karta ho
      upcomingLabel,
      status: user?.status || "Online",
    }),
    [todayList.length, uniquePatients, upcomingLabel, user?.status]
  );

  useApptSoonToast((msg) => {
    // replace with your toast lib
    if (typeof window !== "undefined") alert(msg);
  });

  // Socket ringing for today's appts (doctor side)
  useEffect(() => {
    // cleanup old
    ringSocketsRef.current.forEach((s) => s.disconnect());
    ringSocketsRef.current = [];

    const base = API_BASE;

    todayList.forEach((appt) => {
      if (!appt?._id) return;

      const socket = io(`${base}/ws/video`, {
        path: "/socket.io",
        auth: { appointmentId: appt._id }, // cookie is sent automatically; pass appointmentId only
        transports: ["websocket"],
      });

      socket.on("call:ring", ({ appointmentId }) => {
        setIncoming({ appointmentId });
      });

      ringSocketsRef.current.push(socket);
    });

    return () => {
      ringSocketsRef.current.forEach((s) => s.disconnect());
      ringSocketsRef.current = [];
    };
  }, [todayList]);

  return (
    <>
      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <h1 className="text-lg sm:text-xl font-semibold truncate">
            Welcome, Dr. {user?.name}
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={doLogout}
              className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-700"
            >
              Logout
            </button>
            <button
              onClick={() => setMobileActionsOpen((v) => !v)}
              className="sm:hidden inline-flex items-center p-2 rounded-lg border"
              aria-label="Open quick actions"
            >
              <FaBars />
            </button>
          </div>
        </div>
        {/* Mobile quick actions */}
        {mobileActionsOpen && (
          <div className="sm:hidden px-4 pb-3">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={doLogout}
                className="w-full rounded-lg bg-emerald-600 text-white py-2"
              >
                Logout
              </button>
              <button
                onClick={() => setMobileActionsOpen(false)}
                className="w-full rounded-lg border py-2"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          {/* KPIs */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-10">
            <div className="bg-white shadow-sm p-4 sm:p-5 rounded-2xl border">
              <div className="flex items-center gap-4">
                <FaCalendarAlt className="text-2xl sm:text-3xl text-emerald-600 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-500">
                    Today's Appointments
                  </p>
                  <p className="text-lg sm:text-xl font-bold">
                    {todayList.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white shadow-sm p-4 sm:p-5 rounded-2xl border">
              <div className="flex items-center gap-4">
                <FaUserInjured className="text-2xl sm:text-3xl text-blue-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-500">
                    Total Patients
                  </p>
                  <p className="text-lg sm:text-xl font-bold">
                    {uniquePatients}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white shadow-sm p-4 sm:p-5 rounded-2xl border">
              <div className="flex items-center gap-4">
                <FaVideo className="text-2xl sm:text-3xl text-purple-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-500">
                    Upcoming Call
                  </p>
                  <p className="text-lg sm:text-xl font-bold truncate">
                    {upcomingLabel}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white shadow-sm p-4 sm:p-5 rounded-2xl border">
              <div className="flex items-center gap-4">
                <FaUserEdit className="text-2xl sm:text-3xl text-yellow-600 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-500">Status</p>
                  <p className="text-lg sm:text-xl font-bold">
                    {user?.status || "Online"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Today appointments */}
          <section className="bg-white shadow-sm border rounded-2xl p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h2 className="text-base sm:text-xl font-semibold">
                Today’s Appointments
              </h2>
              {/* space for filters on md+ later */}
            </div>

            {todayList.length === 0 ? (
              <p className="text-sm text-gray-500">
                No appointments for today.
              </p>
            ) : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                {todayList.map((appt) => {
                  const appointmentTime = new Date(appt.startAt);
                  const now = new Date();
                  const isDoctorCallAllowed =
                    now.getTime() >=
                      appointmentTime.getTime() - 5 * 60 * 1000 &&
                    now.getTime() <= appointmentTime.getTime() + 30 * 60 * 1000;

                  const patientName =
                    appt.patientName ||
                    appt?.patientId?.name ||
                    appt?.patientId;

                  return (
                    <li
                      key={appt._id}
                      className="border rounded-2xl p-4 shadow-sm hover:shadow-md transition bg-white"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-semibold truncate">
                            Patient: {patientName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {appointmentTime.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            Condition: {appt.condition}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
                        <button
                          onClick={() => {
                            const pid = appt?.patientId?._id || appt?.patientId;
                            const pname = patientName || "Patient";
                            setShowChat(true);
                            setChatPartner({ id: pid, name: pname });
                          }}
                          className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm"
                        >
                          Chat
                        </button>

                        <VideoCallButton
                          appointment={appt}
                          isAllowed={isDoctorCallAllowed}
                        />

                        <button
                          onClick={() => {
                            setSelectedAppointmentId(appt._id);
                            setShowRxForm(true);
                          }}
                          className="col-span-2 sm:col-span-1 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm"
                        >
                          Write Prescription
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}

            {showChat && (
              <div className="mt-6">
                {/* Chat panel stacks naturally; full-width on mobile */}
                <ChatPanel
                  partnerId={chatPartner.id}
                  partnerName={chatPartner.name}
                />
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Incoming call toast */}
      {incoming && (
        <div className="fixed inset-x-2 bottom-4 sm:inset-auto sm:right-4 sm:bottom-4 bg-white shadow-lg rounded-2xl p-4 border z-50">
          <div className="font-semibold mb-2">Incoming Video Call</div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              className="px-3 py-2 rounded-lg bg-emerald-600 text-white"
              onClick={() => navigate(`/call/${incoming.appointmentId}`)}
            >
              Join
            </button>
            <button
              className="px-3 py-2 rounded-lg bg-gray-600 text-white"
              onClick={() => setIncoming(null)}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Prescription modal */}
      {showRxForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-3">
          <div className="bg-white w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl p-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <div className="text-lg font-semibold">Prescription</div>
              <button
                onClick={() => {
                  setShowRxForm(false);
                  setSelectedAppointmentId(null);
                }}
                className="px-3 py-1.5 rounded-lg border"
              >
                ✕
              </button>
            </div>

            <PrescriptionForm
              appointmentId={selectedAppointmentId}
              onDone={() => {
                setShowRxForm(false);
                setSelectedAppointmentId(null);
              }}
            />
          </div>
        </div>
      )}

      {/* ✅ Pass stats to DocHeader to avoid undefined */}
      <DocHeader stats={stats} />
    </>
  );
};

export default DoctorDashboard;

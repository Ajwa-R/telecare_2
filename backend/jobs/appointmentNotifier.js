// jobs/appointmentNotifier.js
const Appointment = require('../models/Appointment');

let _timer = null;

function startAppointmentNotifier(io, {
  intervalMs = 30_000,
  leadMin = Number(process.env.NOTIFY_LEAD_MIN || 5),
  windowMs = 45_000,
} = {}) {
  // avoid duplicate intervals (dev hot-reload)
  if (_timer) clearInterval(_timer);

  _timer = setInterval(async () => {
    try {
      const now = new Date();
      const target = new Date(now.getTime() + leadMin * 60_000);
      const from = new Date(target.getTime() - windowMs);
      const to   = new Date(target.getTime() + windowMs);

      const hits = await Appointment.find({
        startAt: { $gte: from, $lte: to },
        notified5min: { $ne: true },
      }).select('_id startAt patientId doctorId');

      for (const appt of hits) {
        const payload = {
          appointmentId: appt._id,
          startAt: appt.startAt,
          message: `Your appointment starts in ${leadMin} minute(s).`,
        };
        io.to(`user:${appt.patientId}`).emit('appt:startsSoon', payload);
        io.to(`user:${appt.doctorId}`).emit('appt:startsSoon', payload);
        appt.notified5min = true;
        await appt.save();
      }
    } catch (e) {
      console.error('[notifier] error:', e);
    }
  }, intervalMs);
}

function stopAppointmentNotifier() {
  if (_timer) clearInterval(_timer);
  _timer = null;
}

module.exports = { startAppointmentNotifier, stopAppointmentNotifier };














// const Appointment = require("../models/Appointment");

// module.exports = function startAppointmentNotifier(io) {
//   const INTERVAL_MS = 30 * 1000;
//   const LEAD_MIN = Number(process.env.NOTIFY_LEAD_MIN || 5); // minutes
//   const WINDOW_MS = 45 * 1000; // +- window for matching

//   // avoid double intervals in dev hot-reload
//   if (global.__apptNotifier) clearInterval(global.__apptNotifier);

//   global.__apptNotifier = setInterval(async () => {
//     try {
//       const now = new Date();
//       const target = new Date(now.getTime() + LEAD_MIN * 60 * 1000);

//       const from = new Date(target.getTime() - WINDOW_MS);
//       const to   = new Date(target.getTime() + WINDOW_MS);

//       const hits = await Appointment.find({
//         startAt: { $gte: from, $lte: to },
//         notified5min: { $ne: true }
//       }).select("_id startAt patientId doctorId");

//       if (hits.length) {
//         console.log("[notifier] matches:", hits.map(h => ({
//           id: h._id.toString(), startAt: h.startAt
//         })));
//       }

//       for (const appt of hits) {
//         io.to(`user:${appt.patientId}`).emit("appt:startsSoon", {
//           appointmentId: appt._id,
//           startAt: appt.startAt,
//           message: `Your appointment starts in ${LEAD_MIN} minute(s).`
//         });
//         io.to(`user:${appt.doctorId}`).emit("appt:startsSoon", {
//           appointmentId: appt._id,
//           startAt: appt.startAt,
//           message: `You have an appointment in ${LEAD_MIN} minute(s).`
//         });

//         appt.notified5min = true;
//         await appt.save();
//       }
//     } catch (e) {
//       console.error("[notifier] error:", e.message);
//     }
//   }, INTERVAL_MS);
// };

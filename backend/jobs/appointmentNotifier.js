const Appointment = require("../models/Appointment");

module.exports = function startAppointmentNotifier(io) {
  const INTERVAL_MS = 30 * 1000;
  const LEAD_MIN = Number(process.env.NOTIFY_LEAD_MIN || 5); // minutes
  const WINDOW_MS = 45 * 1000; // +- window for matching

  // avoid double intervals in dev hot-reload
  if (global.__apptNotifier) clearInterval(global.__apptNotifier);

  global.__apptNotifier = setInterval(async () => {
    try {
      const now = new Date();
      const target = new Date(now.getTime() + LEAD_MIN * 60 * 1000);

      const from = new Date(target.getTime() - WINDOW_MS);
      const to   = new Date(target.getTime() + WINDOW_MS);

      const hits = await Appointment.find({
        startAt: { $gte: from, $lte: to },
        notified5min: { $ne: true }
      }).select("_id startAt patientId doctorId");

      if (hits.length) {
        console.log("[notifier] matches:", hits.map(h => ({
          id: h._id.toString(), startAt: h.startAt
        })));
      }

      for (const appt of hits) {
        io.to(`user:${appt.patientId}`).emit("appt:startsSoon", {
          appointmentId: appt._id,
          startAt: appt.startAt,
          message: `Your appointment starts in ${LEAD_MIN} minute(s).`
        });
        io.to(`user:${appt.doctorId}`).emit("appt:startsSoon", {
          appointmentId: appt._id,
          startAt: appt.startAt,
          message: `You have an appointment in ${LEAD_MIN} minute(s).`
        });

        appt.notified5min = true;
        await appt.save();
      }
    } catch (e) {
      console.error("[notifier] error:", e.message);
    }
  }, INTERVAL_MS);
};









// const Appointment = require('../models/Appointment');

// module.exports = function startAppointmentNotifier(io) {
//   const TOL_MS = 30 * 1000; // ±30s window

//   setInterval(async () => {
//     const now = new Date();
//     const in5 = new Date(now.getTime() + 5 * 60 * 1000);

//     try {
//       const list = await Appointment.find({
//         startAt: {
//           $gte: new Date(in5.getTime() - TOL_MS),
//           $lte: new Date(in5.getTime() + TOL_MS),
//         },
//         notified5min: { $ne: true },
//       }).select('_id startAt patientId doctorId notified5min');

//       for (const appt of list) {
//         // ⚠️ ObjectId → string
//         const pid = appt.patientId?.toString?.() || `${appt.patientId}`;
//         const did = appt.doctorId?.toString?.() || `${appt.doctorId}`;

//         io.to(`user:${pid}`).emit('appt:startsSoon', {
//           appointmentId: appt._id,
//           startAt: appt.startAt,
//           message: 'Your appointment starts in 5 minutes.',
//         });

//         io.to(`user:${did}`).emit('appt:startsSoon', {
//           appointmentId: appt._id,
//           startAt: appt.startAt,
//           message: 'You have an appointment in 5 minutes.',
//         });

//         appt.notified5min = true;
//         await appt.save();
//       }
//     } catch (e) {
//       console.error('appointmentNotifier error:', e.message);
//     }
//   }, 30 * 1000);
// };

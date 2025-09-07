// jobs/appointmentNotifier.js
const Appointment = require('../models/Appointment');

let _timer = null;

function startAppointmentNotifier(io, {
  intervalMs = 30_000,
  leadMin = Number(process.env.NOTIFY_LEAD_MIN || 5),
  windowMs = 45_000,
} = {}) {
  // avoid duplicate intervals 
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















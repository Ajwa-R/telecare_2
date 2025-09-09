// const Appointment = require("../models/Appointment");

// function getAppointmentById(id, select = "") {
//   return Appointment.findById(id).select(select);
// }
// async function markCompleted(id) {
//   const appt = await Appointment.findById(id);
//   if (!appt) return null;
//   appt.status = "completed";
//   appt.endAt = new Date();
//   return appt.save();
// }
// module.exports = { getAppointmentById, markCompleted };

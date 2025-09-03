const Appointment = require("../models/Appointment");

exports.getPatientDoctors = async (req, res) => {
  try {
    const { patientId } = req.params;

    const appts = await Appointment.find({ patientId })
      .populate("doctorId", "name specialization image city experience");

    const map = new Map();
    for (const a of appts) {
      const d = a.doctorId;
      if (!d) continue;
      const k = String(d._id);
      const last = a.startAt || a.date || null;

      if (!map.has(k)) {
        map.set(k, {
          _id: d._id,
          name: d.name,
          specialization: d.specialization || "General",
          image: d.image || "",
          city: d.city || "",
          experience: d.experience || 0,
          lastAppointmentAt: last,
        });
      } else if (last) {
        const cur = map.get(k);
        if (!cur.lastAppointmentAt || new Date(last) > new Date(cur.lastAppointmentAt)) {
          cur.lastAppointmentAt = last;
        }
      }
    }

    return res.json(Array.from(map.values()));
  } catch (e) {
    console.error("getPatientDoctors error:", e);
    return res.status(500).json({ message: "Failed to load doctors" });
  }
};

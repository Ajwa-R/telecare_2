const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Appointment = require("../models/Appointment");
const User = require("../models/User");
const { protect } = require("../middlewares/authMiddleware");
const apptCtrl = require("../controllers/appointmentController");

// this helper for normalizing appointments
function normalizeAppt(a) {
  const dateObj = a?.date ? new Date(a.date) : null;
  return { ...a.toObject(), startAt: dateObj };
}

// Get upcoming appointment
router.get("/upcoming/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    // Yahan se sirf aaj (00:00) se aage wali appointments aayengi:
    //   - Aaj ka time chahe nikal bhi gaya ho, aaj ke 12 baje raat tak visible rahegi
    //  - Kal se wo past maan li jayegi

    const appt = await Appointment.findOne({
      patientId: userId,
      date: { $gte: startOfToday },
    })
      .sort({ date: 1 }) // sabse kareeb wali
      .populate("doctorId", "name");

    if (!appt)
      return res.status(404).json({ message: "No upcoming appointment" });

    const normalized = {
      _id: appt._id,
      doctorId: appt.doctorId?._id || appt.doctorId,
      doctorName: appt.doctorId?.name ?? "Unknown",
      date: appt.date,
      condition: appt.condition,
      startAt: appt.date,
    };

    res.json(normalized);
  } catch (err) {
    console.error("Error fetching upcoming appointment", err);
    res.status(500).json({ error: "Server error" });
  }
});

// List all upcoming (today and future) for a patient
router.get("/upcoming-all/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const list = await Appointment.find({
      patientId: userId,
      date: { $gte: startOfToday },
    })
      .sort({ date: 1 })
      .populate("doctorId", "name");

    const out = list.map(a => ({
      _id: a._id,
      doctorId: a.doctorId?._id || a.doctorId,
      doctorName: a.doctorId?.name ?? "Unknown",
      date: a.date,
      condition: a.condition,
      startAt: a.date,
    }));

    res.json(out);
  } catch (e) {
    console.error("upcoming-all error", e);
    res.status(500).json({ message: "Failed to fetch upcoming list" });
  }
});


// ✅📌 ADD THIS NEW ROUTE — Doctor's Appointments
router.get("/doctor/:id", async (req, res) => {
  try {
    const doctorId = req.params.id;
    const docs = await Appointment.find({ doctorId }).populate(
      "patientId",
      "name"
    );
    const list = docs.map(normalizeAppt);
    res.json(list);
  } catch (err) {
    console.error("Error fetching doctor appointments:", err.message);
    res.status(500).json({ message: "Failed to fetch appointments" });
  }
});

// 📅 Get latest appointment for a patient using `userId`
router.get("/latest/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const appt = await Appointment.findOne({ patientId: userId })
      .sort({ date: -1 })
      .populate("doctorId", "name");

    if (!appt) return res.status(404).json({ message: "No appointment found" });

    //return both id +name simple shape
    const normalized = normalizeAppt(appt);
    res.json({
      _id: normalized._id,
      doctorId: normalized.doctorId?._id || normalized.doctorId,
      doctorName: normalized.doctorId?.name ?? "Unknown",
      date: normalized.date,
      condition: normalized.condition,
      startAt: normalized.startAt, // 👈 important!
    });
  } catch (err) {
    console.error("Error fetching latest appointment", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Book appointment
router.post("/", async (req, res) => {
  const { patientId, doctorId, condition, date, time } = req.body;

  if (!patientId || !doctorId || !condition || !date || !time) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const when = new Date(date); // <input type="datetime-local" gives ISO
    if (Number.isNaN(when.getTime())) {
      return res.status(400).json({ error: "Invalid date" });
    }
    const appointment = await Appointment.create({
      patientId,
      doctorId,
      condition,
      date: when, // keep if you still use it in UI
      time,
      startAt: when, // ✅ REQUIRED for notifier
      notified5min: false,
    });
    res.status(201).json(appointment);
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ error: "Could not book appointment" });
  }
});

// 👨‍⚕️ Fetch all doctors
router.get("/doctors", async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" }).select("-password");
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch doctors" });
  }
});

router.get("/patient/:patientId/doctors", protect, apptCtrl.getPatientDoctors);

module.exports = router;

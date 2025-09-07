// controllers/appointmentController.js
const Appointment = require('../models/Appointment');
const User = require('../models/User');

// helper
function normalizeAppt(a) {
  const dateObj = a?.date ? new Date(a.date) : null;
  return { ...a.toObject(), startAt: dateObj };
}

// GET /api/appointments/upcoming/:userId
exports.getUpcoming = async (req, res) => {
  const { userId } = req.params;
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const appt = await Appointment.findOne({
      patientId: userId,
      date: { $gte: startOfToday },
    })
      .sort({ date: 1 })
      .populate('doctorId', 'name');

    if (!appt) return res.status(404).json({ message: 'No upcoming appointment' });

    res.json({
      _id: appt._id,
      doctorId: appt.doctorId?._id || appt.doctorId,
      doctorName: appt.doctorId?.name ?? 'Unknown',
      date: appt.date,
      condition: appt.condition,
      startAt: appt.date,
    });
  } catch (err) {
    console.error('getUpcoming error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/appointments/upcoming-all/:userId
exports.getUpcomingAll = async (req, res) => {
  try {
    const { userId } = req.params;
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const list = await Appointment.find({
      patientId: userId,
      date: { $gte: startOfToday },
    })
      .sort({ date: 1 })
      .populate('doctorId', 'name');

    const out = list.map(a => ({
      _id: a._id,
      doctorId: a.doctorId?._id || a.doctorId,
      doctorName: a.doctorId?.name ?? 'Unknown',
      date: a.date,
      condition: a.condition,
      startAt: a.date,
    }));

    res.json(out);
  } catch (e) {
    console.error('getUpcomingAll error', e);
    res.status(500).json({ message: 'Failed to fetch upcoming list' });
  }
};

// GET /api/appointments/doctor/:id
exports.getDoctorAppointments = async (req, res) => {
  try {
    const doctorId = req.params.id;
    const docs = await Appointment.find({ doctorId }).populate('patientId', 'name');
    const list = docs.map(normalizeAppt);
    res.json(list);
  } catch (err) {
    console.error('getDoctorAppointments error:', err.message);
    res.status(500).json({ message: 'Failed to fetch appointments' });
  }
};

// GET /api/appointments/latest/:userId
exports.getLatest = async (req, res) => {
  const { userId } = req.params;
  try {
    const appt = await Appointment.findOne({ patientId: userId })
      .sort({ date: -1 })
      .populate('doctorId', 'name');

    if (!appt) return res.status(404).json({ message: 'No appointment found' });

    const normalized = normalizeAppt(appt);
    res.json({
      _id: normalized._id,
      doctorId: normalized.doctorId?._id || normalized.doctorId,
      doctorName: normalized.doctorId?.name ?? 'Unknown',
      date: normalized.date,
      condition: normalized.condition,
      startAt: normalized.startAt,
    });
  } catch (err) {
    console.error('getLatest error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /api/appointments
exports.bookAppointment = async (req, res) => {
  const { patientId, doctorId, condition, date, time } = req.body;

  if (!patientId || !doctorId || !condition || !date || !time) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const when = new Date(date);
    if (Number.isNaN(when.getTime())) {
      return res.status(400).json({ error: 'Invalid date' });
    }
    const appointment = await Appointment.create({
      patientId,
      doctorId,
      condition,
      date: when,
      time,
      startAt: when,        // notifier uses this
      notified5min: false,
    });
    res.status(201).json(appointment);
  } catch (err) {
    console.error('bookAppointment error:', err);
    res.status(500).json({ error: 'Could not book appointment' });
  }
};

// GET /api/appointments/patient/:patientId/doctors  (your richer version)
exports.getPatientDoctors = async (req, res) => {
  try {
    const { patientId } = req.params;

    const appts = await Appointment.find({ patientId })
      .populate('doctorId', 'name specialization image city experience');

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
          specialization: d.specialization || 'General',
          image: d.image || '',
          city: d.city || '',
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
    console.error('getPatientDoctors error:', e);
    return res.status(500).json({ message: 'Failed to load doctors' });
  }
};

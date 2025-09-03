// controllers/prescriptionController.js
const Prescription = require('../models/Prescription');
const MedicalHistoryEntry = require('../models/MedicalHistoryEntry');
const Appointment = require('../models/Appointment');

exports.create = async (req, res) => {
  try {
    const { appointmentId, title, diagnosis, meds, advice, attachments } = req.body;
    const appt = await Appointment.findById(appointmentId).populate('patientId doctorId');
    if (!appt) return res.status(404).json({ message: 'Appointment not found' });

    // ✅ doctor owns the appointment? (object/string safe)
    const doctorId =
      appt.doctorId?._id?.toString?.() ?? appt.doctorId?.toString?.();

    if (!doctorId) {
      return res.status(400).json({ message: 'Appointment has no doctorId' });
    }

    if (doctorId !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'Not your appointment',
        // DEBUG only (remove in prod):
        // expected: doctorId,
        // got: req.user._id.toString(),
      });
    }

    const rx = await Prescription.create({
      appointmentId,
      patientId: appt.patientId,
      doctorId: appt.doctorId,
      title,
      diagnosis,
      meds,
      advice,
      attachments,
    });

    await MedicalHistoryEntry.create({
      patientId: appt.patientId,
      type: 'PRESCRIPTION',
      refId: rx._id,
      byDoctorId: appt.doctorId,
      appointmentId,
    });

    res.status(201).json(rx);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to create prescription' });
  }
};



exports.getByAppointment = async (req, res) => {
  const list = await Prescription.find({ appointmentId: req.params.id }).sort('-createdAt');
  res.json(list);
};

exports.getByPatient = async (req, res) => {
  const list = await Prescription.find({ patientId: req.params.patientId }).sort('-createdAt');
  res.json(list);
};
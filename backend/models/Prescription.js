// models/Prescription.js
const mongoose = require('mongoose');

const MedSchema = new mongoose.Schema({
  name: String,
  dose: String,
  frequency: String,
  duration: String,
  notes: String
}, {_id:false});

const PrescriptionSchema = new mongoose.Schema({
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
  patientId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: String,
  diagnosis: String,
  meds: [MedSchema],
  advice: String,
  attachments: [{ url: String, name: String }],
}, { timestamps: true });

module.exports = mongoose.model('Prescription', PrescriptionSchema);

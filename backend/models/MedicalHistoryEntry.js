// models/MedicalHistoryEntry.js
const mongoose = require('mongoose');
const MedicalHistoryEntrySchema = new mongoose.Schema({
  patientId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type:        { type: String, enum: ['PRESCRIPTION'], required: true },
  refId:       { type: mongoose.Schema.Types.ObjectId, required: true },
  byDoctorId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  appointmentId:{ type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
}, { timestamps: true });

module.exports = mongoose.model('MedicalHistoryEntry', MedicalHistoryEntrySchema);

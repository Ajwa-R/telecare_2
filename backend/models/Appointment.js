const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  condition: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },  
  startAt: { type: Date, required: true },
  notified5min: { type: Boolean, default: false }

//   image: {
//   type: String,
//   default: "https://via.placeholder.com/100", // or your default doctor image
// },
//   experience: {
//   type: Number,
//   default: 5
// },

}, { timestamps: true });

module.exports = mongoose.model("Appointment", appointmentSchema);

// controllers/doctorsController.js
const User = require('../models/User');

// GET /api/doctors
exports.getVerifiedDoctors = async (_req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor', isVerified: true }).select('-password');
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch doctors' });
  }
};

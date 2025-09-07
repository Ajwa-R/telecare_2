// controllers/userAdminController.js
const User = require('../models/User');
const { sendMail } = require('../utils/mailer');

exports.getPendingDoctors = async (_req, res) => {
  try {
    const pending = await User.find({ role: 'doctor', isVerified: false })
      .select('name email specialization image experience isVerified');
    res.json(pending);
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch pending doctors' });
  }
};

exports.getApprovedDoctors = async (_req, res) => {
  try {
    const approved = await User.find({ role: 'doctor', isVerified: true })
      .select('name email specialization image experience isVerified');
    res.json(approved);
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch approved doctors' });
  }
};

exports.approveDoctor = async (req, res) => {
  try {
    const doc = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { isVerified: true } },
      { new: true }
    ).select('name email specialization image experience isVerified');

    if (!doc) return res.status(404).json({ message: 'Doctor not found' });

    try {
      await sendMail({
        to: doc.email,
        subject: 'Your TeleCare doctor account has been approved',
        html: `
          <p>Dear Dr. ${doc.name || ''},</p>
          <p>Your TeleCare doctor account has been <b>approved</b>. You can now sign in and access your dashboard.</p>
          <p>Regards,<br/>TeleCare Team</p>
        `,
      });
    } catch (e) {
      console.error('Email send failed:', e);
    }

    res.json({
      message: 'Approved',
      doctor: {
        _id: doc._id,
        name: doc.name,
        email: doc.email,
        specialization: doc.specialization,
        isVerified: doc.isVerified,
      },
    });
  } catch (e) {
    res.status(500).json({ message: 'Failed to approve doctor' });
  }
};

exports.deleteDoctor = async (req, res) => {
  try {
    const doctor = await User.findByIdAndDelete(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json({ message: 'Doctor deleted successfully' });
  } catch (e) {
    res.status(500).json({ message: 'Failed to delete doctor' });
  }
};

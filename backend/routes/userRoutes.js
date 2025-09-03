const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { sendMail } = require('../utils/mailer');
// const multer = require("multer");
// const { storage } = require("../config/cloudinary");
// const upload = multer({ storage });


// GET: pending doctors (for "New Requests")
router.get('/doctors/pending', async (req, res) => {
  try {
    const pending = await User.find({ role: 'doctor', isVerified: false })
      .select('name specialization image experience isVerified');
    res.json(pending);
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch pending doctors' });
  }
});

// GET: approved doctors (admin view)
router.get('/doctors/approved', async (req, res) => {
  try {
    const approved = await User.find({ role: 'doctor', isVerified: true })
      .select('name specialization image experience isVerified');
    res.json(approved);
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch approved doctors' });
  }
});

// PATCH/PUT: approve a doctor
router.put('/doctors/:id/approve', async (req, res) => {
  try {
    const doc = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { isVerified: true } },
      { new: true }
    ).select('name specialization image experience isVerified');
    if (!doc) return res.status(404).json({ message: 'Doctor not found' });

    //email doctor
    try {
      await sendMail({
        to: doc.email,
        subject: 'your teleCare doctor account has been approved',
        html: `
        <p> Dear Dr. ${doc.name || ''},</p>
        <p> your TeleCare  doctor account has been <b> approved</b>. you can now sign in and access your dashboard</p>
        <p> Regards, <br/> TelCare Team</p>`,
      });
    }catch (e) {
    console.error('Email send failed:', e);
    //do'nt fail the api bcoz odf email
  }
    res.json({ message: 'Approved', doctor: {
      _id: doc._id, name: doc.name, email: doc.email,
      specialization: doc.specialization, isVerified: doc.isVerified
    } });
  } catch (e){
    res.status(500).json({ message: 'failed to approve doctor'});
  }
});

// DELETE: remove doctor
router.delete('/doctors/:id', async (req, res) => {
  try {
    const doctor = await User.findByIdAndDelete(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json({ message: 'Doctor deleted successfully' });
  } catch (e) {
    res.status(500).json({ message: 'Failed to delete doctor' });
  }
});

module.exports = router;

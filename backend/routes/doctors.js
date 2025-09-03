const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Get all verified doctors
router.get("/", async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor", isVerified: true });
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch doctors" });
  }
});

module.exports = router;

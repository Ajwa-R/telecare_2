const express = require("express");
const router = express.Router();
const { protect, requireRole } = require("../middlewares/authMiddleware");

const {create, getByAppointment, getByPatient,} = require("../controllers/prescriptionController");


router.post("/", protect, requireRole("doctor"), create);

router.get("/by-appointment/:id", protect, getByAppointment);


router.get("/patient/:patientId", protect, getByPatient);

module.exports = router;

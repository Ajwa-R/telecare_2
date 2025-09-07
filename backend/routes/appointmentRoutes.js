const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const appt = require('../controllers/appointmentController');

// public/protected per your FE needs:
router.get('/upcoming/:userId', appt.getUpcoming);
router.get('/upcoming-all/:userId', appt.getUpcomingAll);
router.get('/doctor/:id', appt.getDoctorAppointments);
router.get('/latest/:userId', appt.getLatest);

router.post('/', appt.bookAppointment);

// this was already protected in your code
router.get('/patient/:patientId/doctors', protect, appt.getPatientDoctors);

module.exports = router;

const router = require('express').Router();
const { protect, requireRole } = require('../middlewares/authMiddleware');
const ctrl = require('../controllers/prescriptionController');

router.post('/', protect, requireRole('doctor'), ctrl.create);
router.get('/by-appointment/:id', protect, ctrl.getByAppointment);
router.get('/patient/:patientId', protect, ctrl.getByPatient);

module.exports = router;

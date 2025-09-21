const express = require('express');
const router = express.Router();
const { protect, requireRole } = require('../middlewares/authMiddleware');
const { getPendingDoctors, getApprovedDoctors, approveDoctor, deleteDoctor,} = require('../controllers/userAdminController');

router.get('/doctors/pending',  protect, requireRole('admin'), getPendingDoctors);
router.get('/doctors/approved', protect, requireRole('admin'), getApprovedDoctors);
router.put('/doctors/:id/approve', protect, requireRole('admin'), approveDoctor);
router.delete('/doctors/:id',     protect, requireRole('admin'), deleteDoctor);

module.exports = router;

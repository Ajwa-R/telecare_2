const express = require('express');
const router = express.Router();
const { protect, requireRole } = require('../middlewares/authMiddleware');
const admin = require('../controllers/userAdminController');

router.get('/doctors/pending',  protect, requireRole('admin'), admin.getPendingDoctors);
router.get('/doctors/approved', protect, requireRole('admin'), admin.getApprovedDoctors);
router.put('/doctors/:id/approve', protect, requireRole('admin'), admin.approveDoctor);
router.delete('/doctors/:id', protect, requireRole('admin'), admin.deleteDoctor);

module.exports = router;

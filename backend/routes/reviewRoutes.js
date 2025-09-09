const express = require('express');
const router = express.Router();
const { protect, requireRole } = require('../middlewares/authMiddleware');

const { create, publicList, adminList, approve, unapprove, remove,} = require('../controllers/reviewController');

router.post('/', protect, create);

router.get('/public', publicList);

router.get('/admin', protect, requireRole('admin'), adminList);
router.patch('/:id/approve', protect, requireRole('admin'), approve);
router.patch('/:id/reject',  protect, requireRole('admin'), unapprove);
router.delete('/:id',        protect, requireRole('admin'), remove);

module.exports = router;

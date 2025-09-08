const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');


const { registerUser, loginUser, googleAuth, logout, getMe, } = require('../controllers/authController');

// Google OAuth
router.post('/google', googleAuth);

// Register
router.post('/register', registerUser);

// Login
router.post('/login', loginUser);

// Logout
router.post('/logout', logout);

// Current user (cookie-based)
router.get('/me', protect, getMe);

module.exports = router;

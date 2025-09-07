const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  googleAuth,
  logout,
} = require('../controllers/authController');

// Google OAuth
router.post('/google', googleAuth);

// Register
router.post('/register', registerUser);

// Login
router.post('/login', loginUser);

// Logout
router.post('/logout', logout);

module.exports = router;

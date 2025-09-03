// routes/authRoutes.js
// Yahan hum /register aur /login ka route bana rahe hain

const express = require('express');
const router = express.Router();

const upload = require('../middlewares/upload');

const { registerUser, loginUser, googleAuth } = require('../controllers/authController');


//google auth route
router.post('/google', googleAuth);

//register route
// router.post('/register', upload.single('image'), registerUser);
// register route WITH proper multer error handling
 router.post('/register', (req, res, next) => {
   upload.single('image')(req, res, function (err) {
     if (err) {
       // e.g. "Only image files are allowed" or size limit error
       return res.status(400).json({ message: err.message || 'Upload failed' });
     }
     // continue to controller
     return registerUser(req, res, next);
   });
 });

//login route
router.post('/login', loginUser);

module.exports = router;

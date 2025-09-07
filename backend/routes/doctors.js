const express = require('express');
const router = express.Router();
const { getVerifiedDoctors } = require('../controllers/doctorsController');

router.get('/', getVerifiedDoctors);

module.exports = router;

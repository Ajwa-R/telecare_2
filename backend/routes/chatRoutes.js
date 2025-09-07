const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const chat = require('../controllers/chatController');

router.get('/:myId/:partnerId', protect, chat.getConversation);
router.post('/', protect, chat.sendMessage);

module.exports = router;

// controllers/chatController.js
const Message = require('../models/Message');

// GET /api/chats/:myId/:partnerId
exports.getConversation = async (req, res) => {
  try {
    const { myId, partnerId } = req.params;
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: partnerId },
        { senderId: partnerId, receiverId: myId },
      ],
    })
      .sort('createdAt')
      .select('_id senderId receiverId text createdAt');

    res.json(messages);
  } catch (err) {
    console.error('getConversation', err);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
};

// POST /api/chats
exports.sendMessage = async (req, res) => {
  try {
    const senderId = req.user?._id?.toString();
    const { receiverId, text } = req.body;
    if (!senderId) return res.status(401).json({ message: 'Unauthenticated' });
    if (!receiverId || !text) return res.status(400).json({ message: 'receiverId and text are required' });

    const msg = await Message.create({ senderId, receiverId, text });

    // socket notify (optional)
    const io = req.app.get('io');
    if (io) {
      io.to(receiverId).emit('chat:receive', {
        _id: msg._id, senderId, receiverId, text, createdAt: msg.createdAt,
      });
    }

    res.status(201).json({
      _id: msg._id, senderId, receiverId, text, createdAt: msg.createdAt,
    });
  } catch (err) {
    console.error('sendMessage', err);
    res.status(500).json({ message: 'Failed to send message' });
  }
};

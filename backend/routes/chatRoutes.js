const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

// GET all messages between two users
router.get("/:user1Id/:user2Id", async (req, res) => {
  try {
    const { user1Id, user2Id } = req.params;
    const messages = await Message.find({
      $or: [
        { senderId: user1Id, receiverId: user2Id },
        { senderId: user2Id, receiverId: user1Id },
      ],
    }).sort("createdAt");

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});

// POST a new message
router.post("/", async (req, res) => {
  try {
    const { senderId, receiverId, text } = req.body;
    const newMessage = await Message.create({ senderId, receiverId, text });
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ message: "Failed to send message" });
  }
});

module.exports = router;

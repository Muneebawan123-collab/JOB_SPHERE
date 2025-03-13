const express = require("express");
const Message = require("../models/Message");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Send a Message
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const newMessage = new Message({ senderId: req.user.id, receiverId, message });
    await newMessage.save();
    res.json(newMessage);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get Messages between Two Users
router.get("/:userId", authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: req.user.id, receiverId: req.params.userId },
        { senderId: req.params.userId, receiverId: req.user.id },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

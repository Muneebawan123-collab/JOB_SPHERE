const express = require("express");
const Notification = require("../models/Notification");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get Notifications for User
router.get("/", authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Mark Notification as Read
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create a New Notification
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;
    const notification = new Notification({ userId: req.user.id, message });
    await notification.save();
    res.json({ message: "Notification created", notification });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

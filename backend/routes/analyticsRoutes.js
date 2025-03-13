const express = require("express");
const Analytics = require("../models/Analytics");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Track Job View
router.post("/track-view", authMiddleware, async (req, res) => {
  try {
    const { jobId } = req.body;
    await Analytics.create({ userId: req.user.id, jobId, action: "view" });
    res.json({ message: "Job view recorded" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Track Job Application
router.post("/track-apply", authMiddleware, async (req, res) => {
  try {
    const { jobId } = req.body;
    await Analytics.create({ userId: req.user.id, jobId, action: "apply" });
    res.json({ message: "Job application recorded" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get User Analytics
router.get("/user-analytics", authMiddleware, async (req, res) => {
  try {
    const views = await Analytics.countDocuments({ userId: req.user.id, action: "view" });
    const applications = await Analytics.countDocuments({ userId: req.user.id, action: "apply" });

    res.json({ views, applications });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get Employer Analytics
router.get("/employer-analytics", authMiddleware, async (req, res) => {
  try {
    const jobPerformance = await Analytics.aggregate([
      { $match: { action: "apply" } },
      { $group: { _id: "$jobId", count: { $sum: 1 } } },
    ]);

    res.json(jobPerformance);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;

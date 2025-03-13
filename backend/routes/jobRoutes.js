const express = require("express");
const Job = require("../models/Job");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Post a new job (only for Employers)
router.post("/post", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Only employers can post jobs" });
    }

    const job = new Job({ ...req.body, postedBy: req.user.id });
    await job.save();
    res.json({ message: "Job posted successfully", job });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Fetch all jobs
router.get("/all", async (req, res) => {
    try {
      const { keyword, location, employmentType, salaryRange } = req.query;
      let filters = {};
  
      if (keyword) {
        filters.title = { $regex: keyword, $options: "i" }; // Case-insensitive search
      }
      if (location) {
        filters.location = { $regex: location, $options: "i" };
      }
      if (employmentType) {
        filters.employmentType = employmentType;
      }
      if (salaryRange) {
        const [min, max] = salaryRange.split("-").map(Number);
        filters.salary = { $gte: min, $lte: max };
      }
  
      const jobs = await Job.find(filters).populate("postedBy", "name email");
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  

// ✅ Apply for a job
router.post("/apply/:id", authMiddleware, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    res.json({ message: "Application submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

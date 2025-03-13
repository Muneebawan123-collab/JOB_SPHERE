const express = require("express");
const User = require("../models/User");
const multer = require("multer");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Update user profile
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.profile = req.body.profile; // Updating profile data
    await user.save();

    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get user profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Configure Multer Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/resumes/");
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  
  const upload = multer({ storage });
  
  // Resume Upload Route
  router.post("/upload-resume", upload.single("resume"), async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      user.resume = req.file.path; // Save file path in database
      await user.save();
  
      res.json({ message: "Resume uploaded successfully", resume: user.resume });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Get User Resume
  router.get("/resume", async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user || !user.resume) {
        return res.status(404).json({ message: "Resume not found" });
      }
  
      res.json({ resume: user.resume });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

module.exports = router;

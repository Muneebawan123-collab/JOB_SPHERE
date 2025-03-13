const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const loginLimiter = require("../middleware/rateLimiter");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// ✅ Signup Route with Validation
router.post(
  "/signup",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email format"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("role").notEmpty().withMessage("Role is required"),
  ],
  async (req, res) => {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, email, password, role } = req.body;

      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const newUser = new User({ name, email, password: hashedPassword, role });
      await newUser.save();

      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

// ✅ Login Route with Validation
router.post(
  "/login",
  loginLimiter,
  [
    body("email").isEmail().withMessage("Invalid email format"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      // Generate JWT Token
      const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
        expiresIn: "7d",
      });

      res.status(200).json({ token, user: { name: user.name, role: user.role } });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

module.exports = router;

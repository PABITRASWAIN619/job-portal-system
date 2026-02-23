const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// SIGNUP: POST /api/users/signup
router.post("/signup", async (req, res) => {
  console.log("SIGNUP REQUEST RECEIVED:", req.body);
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    // Hash password here manually
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword
    });

    console.log("✅ USER SAVED TO DB:", newUser._id);
    res.status(201).json({ message: "Signup Successful!" });
  } catch (error) {
    console.error("❌ SIGNUP ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// LOGIN: POST /api/users/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, user: { id: user._id, name: user.name } });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
});

module.exports = router;
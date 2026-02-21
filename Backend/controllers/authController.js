const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ---------------- SIGNUP ----------------
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2. Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create user with role
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role // This ensures "admin" or "jobseeker" is saved
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    
    res.status(201).json({ 
      message: "User registered successfully",
      token, 
      user: {
        id: user._id,
        name: user.name,
        role: user.role
      } 
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ---------------- LOGIN ----------------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    // ✅ SEND THIS SPECIFIC OBJECT
    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role // Make sure this is "admin" or "jobseeker"
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
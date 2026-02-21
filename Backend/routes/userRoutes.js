const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/upload"); // Your multer config
const User = require("../models/User");

// ✅ PUT route to update profile
router.put("/profile", protect, upload.single("profilePic"), async (req, res) => {
  try {
    const { name, role, skills, education, experience } = req.body;
    
    // Find user and prepare updates
    const updateData = {
      name,
      role,
      education,
      experience,
      // If skills come as a string, split it into an array
      skills: typeof skills === "string" ? skills.split(",") : skills 
    };

    // If a new image was uploaded, add the path to the update object
    if (req.file) {
      updateData.profilePic = req.file.path;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id, 
      { $set: updateData },
      { new: true } // Returns the updated document
    ).select("-password");

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error updating profile" });
  }
});

module.exports = router;
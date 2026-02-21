const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const Application = require("../models/Application");
const Job = require("../models/Job");
const User = require("../models/User");
const upload = require("../middleware/upload");

const calculateMatchScore = (jobSkills = [], userSkills = []) => {
  if (!jobSkills || jobSkills.length === 0) return 0;
  const match = jobSkills.filter(skill => userSkills.includes(skill));
  return Math.round((match.length / jobSkills.length) * 100);
};

router.post("/:jobId", protect, upload.single("resume"), async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    const user = await User.findById(req.user.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // ✅ FIXED: Using 'applicant' instead of 'user' to match your Model
    const existing = await Application.findOne({
      applicant: req.user.id,
      job: req.params.jobId
    });

    if (existing) {
      return res.status(400).json({ message: "Already applied" });
    }

    const score = calculateMatchScore(
      job.skills || [],
      user.skills || []
    );

    // ✅ FIXED: Changed 'user' to 'applicant' and 'matchScore' to 'matchingScore'
    const application = await Application.create({
      applicant: req.user.id,
      job: req.params.jobId,
      resume: req.file ? req.file.path : "",
      matchingScore: score, // Matches 'matchingScore' in your Application.js
    });

    res.status(201).json(application);

  } catch (error) {
    console.error("Application Error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/my", protect, async (req, res) => {
  try {
    // ✅ FIXED: Using 'applicant' field
    const applications = await Application.find({ applicant: req.user.id })
      .populate("job")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
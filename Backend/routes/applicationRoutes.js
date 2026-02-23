const express = require("express");
const router = express.Router();
const multer = require("multer");
const Application = require("../models/Application");

// Setup storage for resumes
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// 📄 GET: My Applications
router.get("/my", async (req, res) => {
  try {
    const apps = await Application.find().populate("job");
    res.json(apps);
  } catch (error) {
   res.status(500).json({ message: "Error fetching applications" });
  }
});

// 📩 POST: Apply for a job WITH Resume
router.post("/:jobId", upload.single("resume"), async (req, res) => {
  try {
    const newApp = await Application.create({
      job: req.params.jobId,
      applicant: req.body.userId, 
      resume: req.file ? req.file.path : "", // Saves file path
      status: "Applied"
    });
    res.status(201).json(newApp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
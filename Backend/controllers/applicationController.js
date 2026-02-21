const Application = require("../models/Application");

exports.applyToJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const userId = req.user.id; // Comes from your Auth Middleware

    // 1. Check if user already applied
    const existingApplication = await Application.findOne({ 
      job: jobId, 
      applicant: userId 
    });

    if (existingApplication) {
      return res.status(400).json({ message: "You have already applied for this job" });
    }

    // 2. Create new application
    const newApplication = new Application({
      job: jobId,
      applicant: userId,
      status: "Applied"
    });

    await newApplication.save();
    res.status(201).json({ message: "Applied successfully!" });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during application" });
  }
};

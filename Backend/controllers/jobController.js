const Job = require("../models/Job");

// ---------------- GET ALL JOBS ----------------
exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("postedBy", "name role");
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Get Jobs Error:", error);
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
};

// ---------------- CREATE JOB ----------------
exports.createJob = async (req, res) => {
  try {
    const { title, description, company, location } = req.body;

    if (!title || !description || !company) {
      return res.status(400).json({
        message: "Title, Company, and Description are required",
      });
    }

    const newJob = await Job.create({
      title,
      description,
      company,
      location: location || "Remote",
      postedBy: req.user.id, // from JWT middleware
    });

    res.status(201).json({
      message: "Job created successfully",
      job: newJob,
    });

  } catch (error) {
    console.error("Create Job Error:", error);
    res.status(500).json({ message: "Failed to create job" });
  }
};
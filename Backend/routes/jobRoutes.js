const express = require("express");
const router = express.Router();
const Job = require("../models/Job");

// POST a new job
router.post("/", async (req, res) => {
  try {
    const { title, description, company, location } = req.body;
    const newJob = await Job.create({ title, description, company, location });
    res.status(201).json(newJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET all jobs
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
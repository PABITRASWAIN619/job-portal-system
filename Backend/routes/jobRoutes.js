const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Job route working ✅");
});

module.exports = router;

// CREATE JOB
router.post("/", async (req, res) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET ALL JOBS
router.get("/", async (req, res) => {
  const jobs = await Job.find();
  res.json(jobs);
});

module.exports = router;
const express = require("express");
const router = express.Router();
const { createJob, getJobs } = require("../controllers/jobController");
const protect = require("../middleware/authMiddleware");

// ✅ Ensure 'protect' is here so req.user is populated
router.post("/", protect, createJob); 
router.get("/", getJobs);

module.exports = router;
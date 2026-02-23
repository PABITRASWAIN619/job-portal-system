const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  resume: { type: String }, // Path to the uploaded file
  status: { type: String, default: "Pending" }
}, { timestamps: true });

module.exports = mongoose.model("Application", ApplicationSchema);
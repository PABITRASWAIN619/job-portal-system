const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // We will hash this in the route
  profilePic: { type: String, default: "" },
  skills: { type: [String], default: [] },
  education: { type: String, default: "" },
  experience: { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
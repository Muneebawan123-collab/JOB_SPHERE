const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  requirements: { type: String },
  location: { type: String, required: true },
  salary: { type: String },
  employmentType: { type: String, enum: ["Full-time", "Part-time", "Contract", "Internship"] },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Employer who posted the job
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Job", JobSchema);

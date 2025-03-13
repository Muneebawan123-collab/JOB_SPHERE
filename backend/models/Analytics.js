const mongoose = require("mongoose");

const AnalyticsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  action: { type: String, enum: ["view", "apply"], required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Analytics", AnalyticsSchema);

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["job_seeker", "employer"], required: true },
    profile: {
      skills: [String],
      experience: String,
      education: String,
      certifications: String,
      companyInfo: String, // Only for Employers
      jobHistory: [{ title: String, company: String, years: Number }],
    },
  });

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model("User", UserSchema);
module.exports = User;

const mongoose = require("mongoose");

const tutorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  specialization: { type: String, required: true },
  bio: { type: String },
  availability: { type: [String], default: [] }, // e.g., ["Monday", "Wednesday"]
  pricePerHour: { type: Number, required: true },
  rating: { type: Number, default: 0 }, // Rating based on student feedback
  profilePicture: { type: String }, // Optional: Link to the tutor's profile picture
  createdAt: { type: Date, default: Date.now },
});

const Tutor = mongoose.model("Tutor", tutorSchema);

module.exports = Tutor;

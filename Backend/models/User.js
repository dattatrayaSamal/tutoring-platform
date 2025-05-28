// models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["student", "tutor"] },
  subjects: [String],
  preferences: {
    tutoringStyle: String,
    availability: [String],
    location: String,
  },
  verified: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
});

module.exports = mongoose.model("User", UserSchema);

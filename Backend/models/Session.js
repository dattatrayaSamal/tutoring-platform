const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    tutor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    subject: String,
    scheduledAt: Date,
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled"],
      default: "scheduled",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Session", SessionSchema);

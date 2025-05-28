const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middlewares/authMiddleware");

// Match tutors for a student based on subject, availability, location
router.get("/match/:studentId", auth, async (req, res) => {
  const student = await User.findById(req.params.studentId);

  const tutors = await User.find({
    role: "tutor",
    subjects: { $in: student.subjects },
    "preferences.location": student.preferences.location,
    "preferences.availability": { $in: student.preferences.availability },
  });

  res.json(tutors);
});

module.exports = router;

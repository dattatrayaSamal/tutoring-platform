const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const Session = require("../models/Session");
const Feedback = require("../models/Feedback");

router.get("/summary", auth, async (req, res) => {
  const sessionCount = await Session.countDocuments();
  const feedbackCount = await Feedback.countDocuments();
  const averageRating = await Feedback.aggregate([
    { $group: { _id: null, avgRating: { $avg: "$rating" } } },
  ]);

  res.json({
    totalSessions: sessionCount,
    totalFeedbacks: feedbackCount,
    averageRating: averageRating[0]?.avgRating || 0,
  });
});

module.exports = router;

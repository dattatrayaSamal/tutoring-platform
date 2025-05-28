const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const Feedback = require("../models/Feedback");

router.post("/", auth, async (req, res) => {
  const feedback = new Feedback(req.body);
  await feedback.save();
  res.status(201).json(feedback);
});

router.get("/user/:userId", auth, async (req, res) => {
  const feedbacks = await Feedback.find({ to: req.params.userId });
  res.json(feedbacks);
});

module.exports = router;

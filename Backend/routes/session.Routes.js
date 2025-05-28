const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const Session = require("../models/Session");

// Add session routes (create, update, get, delete)
router.post("/", auth, async (req, res) => {
  try {
    const session = await Session.create(req.body);
    res.status(201).json(session);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/", auth, async (req, res) => {
  const sessions = await Session.find({
    $or: [{ student: req.user.id }, { tutor: req.user.id }],
  });
  res.json(sessions);
});

module.exports = router;

const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const Message = require("../models/message");

router.post("/", auth, async (req, res) => {
  const message = new Message(req.body);
  await message.save();
  res.status(201).json(message);
});

router.get("/session/:sessionId", auth, async (req, res) => {
  const messages = await Message.find({ session: req.params.sessionId });
  res.json(messages);
});

module.exports = router;

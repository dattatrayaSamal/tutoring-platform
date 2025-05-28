const express = require("express");
const router = express.Router();
const { getMatchedTutors } = require("../controllers/matchController");
const authenticate = require("../middlewares/authMiddleware");

router.get("/tutors", authenticate, getMatchedTutors);

module.exports = router;

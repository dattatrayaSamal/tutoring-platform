const User = require("../models/User");

exports.getMatchedTutors = async (req, res) => {
  try {
    const student = req.user;

    // Example matching logic: match tutors with same subjects
    const tutors = await User.find({
      role: "tutor",
      subjects: { $in: student.subjects },
    }).select("name subjects rating availability");

    res.json(tutors);
  } catch (error) {
    console.error("Error in getMatchedTutors:", error);
    res.status(500).json({ message: "Failed to fetch matched tutors" });
  }
};

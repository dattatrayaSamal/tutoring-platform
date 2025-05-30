const Session = require("../models/Session");
const Feedback = require("../models/Feedback");
const User = require("../models/User");

exports.getPlatformSummary = async (req, res) => {
  try {
    const sessionCount = await Session.countDocuments();
    const feedbackCount = await Feedback.countDocuments();
    const userCount = await User.countDocuments();
    const averageRating = await Feedback.aggregate([
      { $group: { _id: null, avgRating: { $avg: "$rating" } } },
    ]);

    res.json({
      totalSessions: sessionCount,
      totalFeedbacks: feedbackCount,
      totalUsers: userCount,
      averageRating: averageRating[0]?.avgRating || 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserStats = async (req, res) => {
  try {
    const userId = req.params.userId;

    const sessionsAsStudent = await Session.countDocuments({ student: userId });
    const sessionsAsTutor = await Session.countDocuments({ tutor: userId });
    const feedbacks = await Feedback.find({ to: userId });

    const averageRating =
      feedbacks.reduce((acc, curr) => acc + curr.rating, 0) /
      (feedbacks.length || 1);

    res.json({
      sessionsAsStudent,
      sessionsAsTutor,
      feedbackCount: feedbacks.length,
      averageRating,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

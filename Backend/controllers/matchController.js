const User = require("../models/User");
const Session = require("../models/Session");

exports.getMatchedTutors = async (req, res) => {
  try {
    const student = await User.findById(req.user.id);
    if (!student || student.role !== "student") {
      return res.status(400).json({ message: "Invalid student" });
    }

    // Get tutors who teach the student's preferred subjects
    let tutors = await User.find({
      role: "tutor",
      subjects: { $in: student.subjects || [] },
    }).select("-password");

    // Filter by availability (simplified example)
    if (student.availability && student.availability.length > 0) {
      tutors = tutors.filter((tutor) => {
        return (
          tutor.availability &&
          tutor.availability.some((avail) =>
            student.availability.includes(avail)
          )
        );
      });
    }

    // Sort by rating (highest first)
    tutors.sort((a, b) => b.rating - a.rating);

    res.json(tutors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.findCompatibleStudents = async (req, res) => {
  try {
    const tutor = await User.findById(req.user.id);
    if (!tutor || tutor.role !== "tutor") {
      return res.status(400).json({ message: "Invalid tutor" });
    }

    // Find students who need tutoring in subjects the tutor teaches
    const students = await User.find({
      role: "student",
      subjects: { $in: tutor.subjects || [] },
    }).select("-password");

    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

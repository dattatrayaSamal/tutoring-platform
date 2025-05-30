const express = require("express");
const router = express.Router();
const Tutor = require("../models/Tutor");

// Middleware to check if the user is an admin (you can customize this based on your auth system)
const authMiddleware = require("../middlewares/authMiddleware");

// 1. Get all tutors
router.get("/", async (req, res) => {
  try {
    const tutors = await Tutor.find();
    res.status(200).json(tutors);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch tutors", error: err.message });
  }
});

// 2. Get a specific tutor by ID
router.get("/:id", async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.params.id);
    if (!tutor) {
      return res.status(404).json({ message: "Tutor not found" });
    }
    res.status(200).json(tutor);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch tutor", error: err.message });
  }
});

// 3. Add a new tutor (Only accessible by admins or authorized users)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      name,
      email,
      specialization,
      bio,
      availability,
      pricePerHour,
      profilePicture,
    } = req.body;

    const newTutor = new Tutor({
      name,
      email,
      specialization,
      bio,
      availability,
      pricePerHour,
      profilePicture,
    });

    await newTutor.save();
    res
      .status(201)
      .json({ message: "Tutor created successfully", tutor: newTutor });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to create tutor", error: err.message });
  }
});

// 4. Update a tutor's details (Only accessible by admins or the tutor themselves)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const {
      name,
      email,
      specialization,
      bio,
      availability,
      pricePerHour,
      profilePicture,
    } = req.body;

    const updatedTutor = await Tutor.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        specialization,
        bio,
        availability,
        pricePerHour,
        profilePicture,
      },
      { new: true }
    );

    if (!updatedTutor) {
      return res.status(404).json({ message: "Tutor not found" });
    }

    res
      .status(200)
      .json({ message: "Tutor updated successfully", tutor: updatedTutor });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to update tutor", error: err.message });
  }
});

// 5. Delete a tutor (Only accessible by admins or the tutor themselves)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedTutor = await Tutor.findByIdAndDelete(req.params.id);
    if (!deletedTutor) {
      return res.status(404).json({ message: "Tutor not found" });
    }

    res.status(200).json({ message: "Tutor deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete tutor", error: err.message });
  }
});

module.exports = router;

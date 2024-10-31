const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  createMeetup,
  getAllMeetups,
  searchMeetups,
  getMeetupDetails,
  registerForMeetup,
  unregisterFromMeetup,
} = require("../controllers/meetupController");

const router = express.Router();

// Route to create a new event
router.post("/create", authMiddleware, createMeetup);

// Route to list all upcoming meetups
router.get("/upcoming", authMiddleware, getAllMeetups);

// Route to search for meetups with keywords
router.get("/search", authMiddleware, searchMeetups);

// Route to display details of a specific meetup
router.get("/:meetupId", authMiddleware, getMeetupDetails);

// Route to register the user for a meetup
router.post("/:meetupId/register", authMiddleware, registerForMeetup);

// Route to cancel the registration for a meetup
router.delete("/:meetupId/unregister", authMiddleware, unregisterFromMeetup);

module.exports = router;

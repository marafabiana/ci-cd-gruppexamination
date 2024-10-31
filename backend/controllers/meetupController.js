const Meetup = require("../models/Meetup");
const User = require("../models/User");

// 🌸Function to create a new event
const createMeetup = async (req, res) => {
  try {
    const { title, date, location, description, capacity } = req.body;

    // Mandatory fields verification
    if (!title || !date || !location || !description || !capacity) {
      return res.status(400).json({
        error: "Title, date, location, description, and capacity are required",
      });
    }

    const meetup = new Meetup({
      title,
      date,
      location,
      description,
      host: req.user.name,
      createdBy: req.user.userId,
      capacity,
      registeredUsers: [],
    });

    await meetup.save();
    res.status(201).json({ message: "Event created successfully!", meetup });
  } catch (error) {
    res.status(500).json({ error: `Error creating the event.` });
  }
};

// 🌸Function to list all upcoming meetups for logged-in users
const getAllMeetups = async (req, res) => {
  try {
    const currentDate = new Date();
    const meetups = await Meetup.find({ date: { $gte: currentDate } }) // Filter upcoming events
      .sort({ date: 1 }) // Sort by date (nearest first)
      .select("title date location description host"); // Select only the necessary fields

    res.status(200).json(meetups);
  } catch (error) {
    res.status(500).json({ error: "Error fetching upcoming meetings." });
  }
};

// 🌸Function to search for events based on keywords
const searchMeetups = async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword) {
      return res
        .status(400)
        .json({ error: "A keyword is required for the search." });
    }

    // Search for events with a title or description that contains the keyword
    const meetups = await Meetup.find({
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    }).sort({ date: 1 }); // Sort the results by date

    res.status(200).json(meetups);
  } catch (error) {
    res.status(500).json({ error: "Error fetching meetings." });
  }
};

// 🌸Function to display full details of a specific meetup
const getMeetupDetails = async (req, res) => {
  try {
    const { meetupId } = req.params;
    const meetup = await Meetup.findById(meetupId);

    if (!meetup) {
      return res.status(404).json({ error: "Meeting not found" });
    }

    // Return the event details, including the number of available spots and registered participants
    res.status(200).json({
      _id: meetup._id,
      title: meetup.title,
      date: meetup.date,
      location: meetup.location,
      description: meetup.description,
      host: meetup.host,
      capacity: meetup.capacity,
      registeredCount: meetup.registeredUsers.length,
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching meeting details" });
  }
};

// 🌸Function to register the user for a meetup
const registerForMeetup = async (req, res) => {
  try {
    const { meetupId } = req.params;
    const userId = req.user.userId;

    // Fetch the event by ID
    const meetup = await Meetup.findById(meetupId);
    if (!meetup) {
      return res.status(404).json({ error: "Meeting not found" });
    }

    // Check if the event is fully booked
    if (meetup.registeredUsers.length >= meetup.capacity) {
      return res.status(400).json({ message: "This meeting is fully booked." });
    }

    // Check if the user is already registered
    if (meetup.registeredUsers.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You are already registered for this meeting." });
    }

    // Add the user to the registered participants
    meetup.registeredUsers.push(userId);
    await meetup.save();

    res.status(200).json({ message: "Registration completed successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error completing the registration." });
  }
};

// 🌸Function to cancel the user's registration for a meetup
const unregisterFromMeetup = async (req, res) => {
  try {
    const { meetupId } = req.params;
    const userId = req.user.userId;

    // Fetch the event by ID
    const meetup = await Meetup.findById(meetupId);
    if (!meetup) {
      return res.status(404).json({ error: "Meeting not found" });
    }

    // Check if the user is registered for the event
    const userIndex = meetup.registeredUsers.indexOf(userId);
    if (userIndex === -1) {
      return res
        .status(400)
        .json({ message: "You are not registered for this meeting." });
    }

    // Remove the user from the registered participants list
    meetup.registeredUsers.splice(userIndex, 1); // Remove the user from the array
    await meetup.save();

    res.status(200).json({ message: "Registration canceled successfully." });
  } catch (error) {
    res.status(500).json({ error: "Error canceling the registration." });
  }
};

module.exports = {
  createMeetup,
  getAllMeetups,
  searchMeetups,
  getMeetupDetails,
  registerForMeetup,
  unregisterFromMeetup,
};

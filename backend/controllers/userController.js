const Meetup = require("../models/Meetup");
const User = require("../models/User");

// 🌸Function to retrieve the user profile with upcoming and past meetups
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const currentDate = new Date();

    // Fetch events the user is registered for
    const meetups = await Meetup.find({
      registeredUsers: userId, // Filter events the user is registered for
    });

    // Separate events into upcoming and past
    const upcomingMeetups = meetups.filter(
      (meetup) => meetup.date >= currentDate
    );
    const pastMeetups = meetups.filter((meetup) => meetup.date < currentDate);

    // Format the response
    res.status(200).json({
      upcomingMeetups: upcomingMeetups.map((meetup) => ({
        id: meetup._id,
        title: meetup.title,
        date: meetup.date,
        location: meetup.location,
        description: meetup.description,
        host: meetup.host,
      })),
      pastMeetups: pastMeetups.map((meetup) => ({
        id: meetup._id,
        title: meetup.title,
        date: meetup.date,
        location: meetup.location,
        description: meetup.description,
        host: meetup.host,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching user profile" });
  }
};

module.exports = { getUserProfile };

const mongoose = require("mongoose");

const meetupSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  host: { type: String, required: true }, // Host name
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // Reference to the event creator
  capacity: { type: Number, required: true }, // Total number of available spots
  registeredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // IDs of registered users
});

module.exports = mongoose.model("Meetup", meetupSchema);

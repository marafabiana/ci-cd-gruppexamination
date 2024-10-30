// backend/server.js

//❗️
const cors = require("cors");

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const userRoutes = require("./routes/userRoutes");
const meetupRoutes = require("./routes/meetupRoutes");
const app = express();

//❗️
app.use(cors({ origin: "http://localhost:5173" }));

app.use(express.json());

// Connect to Mongoose
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Connected to MongoDB 🎉."))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

//Routes
app.use("/api/users", userRoutes);
app.use("/api/meetups", meetupRoutes);

app.listen(3000, () => console.log("Server running on port 3000 🚀."));

const cors = require("cors");
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const userRoutes = require("./routes/userRoutes");
const meetupRoutes = require("./routes/meetupRoutes");
const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

// Connect to Mongoose
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Connected to MongoDB 🎉."))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/meetups", meetupRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀.`));

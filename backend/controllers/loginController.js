const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "Incorrect email or password." });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Incorrect email or password." });
    }

    const token = jwt.sign(
      { userId: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "6h" }
    );

    
    res
      .status(200)
      .json({ message: "Successful login.", token, name: user.name });
  } catch (error) {
    res.status(500).json({ error: "Error logging in." });
  }
};

module.exports = loginUser;

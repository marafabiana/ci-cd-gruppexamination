import React, { useState } from "react";
import "../Styles/Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [feedback, setFeedback] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://ci-cd-gruppexamination-1.onrender.com/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFeedback(
          "Congratulations, your account has been successfully created!"
        );
        setFormData({ name: "", email: "", password: "" });
      } else {
        const data = await response.json();
        setFeedback(data.error || "Registration failed.");
      }
    } catch (error) {
      setFeedback("Error connecting to server");
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-heading">
        New to Meetup? We'll help you get started.
      </h2>
      <p className="register-subheading">Create an account.</p>
      <form className="register-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>First and Last name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <button type="submit" className="submit-button">
          Join
        </button>
      </form>
      {feedback && <p className="feedback">{feedback}</p>}
    </div>
  );
};

export default Register;

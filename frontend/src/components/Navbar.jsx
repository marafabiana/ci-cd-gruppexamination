import React from "react";
import { Link } from "react-router-dom";
import "../Styles/Navbar.css";

const Navbar = () => {
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <h1>Meetup</h1>
      </Link>
      <div className="navbar-links">
        {isLoggedIn ? (
          <>
            <Link to="/profile">
              <button className="navbar-button">Profile</button>
            </Link>
            <button
              className="navbar-button"
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/";
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              <button className="navbar-button">Log In</button>
            </Link>
            <Link to="/register">
              <button className="navbar-button navbar-signup">Sign Up</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

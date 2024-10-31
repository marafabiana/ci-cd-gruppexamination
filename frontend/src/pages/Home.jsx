import React from "react";
import { Link } from "react-router-dom";
import "../Styles/Home.css";

const Home = () => {
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  return (
    <div className="home-container">
      <h2 className="home-heading">
        The People Platform—Where Interests Become Friendships
      </h2>

      {isLoggedIn ? (
        <Link to="/events">
          <button className="home-button primary-button">See All Events</button>
        </Link>
      ) : (
        <>
          <p className="home-description">
            Whatever your interest, from hiking and reading to networking and
            skill sharing, there are thousands of people who share it on Meetup.
            Events are happening every day—sign up to join the fun.
          </p>
          <Link to="/register">
            <button className="home-button secondary-button">
              Join Meetup
            </button>
          </Link>
        </>
      )}
    </div>
  );
};

export default Home;

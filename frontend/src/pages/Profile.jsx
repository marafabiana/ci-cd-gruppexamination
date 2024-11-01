import React, { useEffect, useState } from "react";
import "../Styles/Profile.css";

const Profile = () => {
  const [upcomingMeetups, setUpcomingMeetups] = useState([]);
  const [pastMeetups, setPastMeetups] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [overlayFeedback, setOverlayFeedback] = useState("");

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("https://ci-cd-gruppexamination-1.onrender.com/api/users/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUpcomingMeetups(data.upcomingMeetups);
        setPastMeetups(data.pastMeetups);
      } else {
        setOverlayFeedback("Error fetching profile data.");
      }
    } catch (error) {
      setOverlayFeedback("Error connecting to the server.");
    }
  };

  const getMeetupDetails = async (eventId) => {
    try {
      const response = await fetch(
        `https://ci-cd-gruppexamination-1.onrender.com/api/meetups/${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setSelectedEvent(data);
      } else {
        setOverlayFeedback("Error fetching event details.");
      }
    } catch (error) {
      setOverlayFeedback("Error connecting to the server.");
    }
  };

  const unregisterFromMeetup = async (eventId) => {
    try {
      const response = await fetch(
        `https://ci-cd-gruppexamination-1.onrender.com/api/meetups/${eventId}/unregister`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.ok) {
        alert("Successfully unregistered from event.");
        setSelectedEvent(null);
        fetchUserProfile();
      } else {
        const data = await response.json();
        alert(data.error || "Error unregistering from the event.");
      }
    } catch (error) {
      alert("Error connecting to the server.");
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <div className="profile-container">
      <h2 className="profile-heading">Your Registered Events</h2>

      {overlayFeedback && <p className="feedback">{overlayFeedback}</p>}

      <h3 className="meetup-heading">Upcoming Meetups:</h3>
      <ul className="meetup-list">
        {upcomingMeetups.map((event) => (
          <li key={event.id} className="meetup-item">
            <h3>{event.title}</h3>
            <p>Date: {new Date(event.date).toLocaleDateString()}</p>
            <button
              onClick={() => getMeetupDetails(event.id)}
              className="details-button"
            >
              Details
            </button>
          </li>
        ))}
      </ul>

      <h3 className="meetup-heading">Past Meetups:</h3>
      <ul className="meetup-list">
        {pastMeetups.map((event) => (
          <li key={event.id} className="meetup-item">
            <h3>{event.title}</h3>
            <p>Date: {new Date(event.date).toLocaleDateString()}</p>
            <button
              onClick={() => getMeetupDetails(event.id)}
              className="details-button"
            >
              Details
            </button>
          </li>
        ))}
      </ul>

      {selectedEvent && (
        <div className="overlay">
          <div className="overlay-content">
            <h2>{selectedEvent.title}</h2>
            <p>Date: {new Date(selectedEvent.date).toLocaleDateString()}</p>
            <p>Location: {selectedEvent.location}</p>
            <p>Description: {selectedEvent.description}</p>
            <p>Host: {selectedEvent.host}</p>
            <p>Capacity: {selectedEvent.capacity}</p>
            <p>Registered Users: {selectedEvent.registeredCount}</p>

            {overlayFeedback && <p className="feedback">{overlayFeedback}</p>}

            <button
              onClick={() => setSelectedEvent(null)}
              className="close-button"
            >
              Return
            </button>
            <button
              onClick={() => unregisterFromMeetup(selectedEvent._id)}
              className="unregister-button"
            >
              Unregister
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

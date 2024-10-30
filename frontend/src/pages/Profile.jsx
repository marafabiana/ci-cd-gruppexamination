import React, { useEffect, useState } from "react";

const Profile = () => {
  const [upcomingMeetups, setUpcomingMeetups] = useState([]);
  const [pastMeetups, setPastMeetups] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [overlayFeedback, setOverlayFeedback] = useState("");

  // Function to fetch the user profile and retrieve the registered meetups
  const fetchUserProfile = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/users/profile", {
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

  // Function to fetch details of the specific meetup
  const getMeetupDetails = async (eventId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/meetups/${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setSelectedEvent(data); // Store the selected meetup to display in the overlay
      } else {
        setOverlayFeedback("Error fetching event details.");
      }
    } catch (error) {
      setOverlayFeedback("Error connecting to the server.");
    }
  };

  // Function to cancel meetup registration
  const unregisterFromMeetup = async (eventId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/meetups/${eventId}/unregister`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.ok) {
        alert("Successfully unregistered from event.");
        setSelectedEvent(null); // Close the overlay
        fetchUserProfile(); // Update the list of registered meetups
      } else {
        const data = await response.json();
        alert(data.error || "Error unregistering from the event.");
      }
    } catch (error) {
      alert("Error connecting to the server.");
    }
  };

  // Load the user profile when mounting the component
  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Your Registered Events</h2>

      {/* Error or success feedback */}
      {overlayFeedback && <p>{overlayFeedback}</p>}

      {/* List of upcoming meetups */}
      <h3>Upcoming Meetups:</h3>
      <ul>
        {upcomingMeetups.map((event) => (
          <li key={event.id} style={{ marginBottom: "1rem" }}>
            <h3>{event.title}</h3>
            <p>
              Date: {new Date(event.date).toLocaleDateString()} at{" "}
              {new Date(event.date).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <button onClick={() => getMeetupDetails(event.id)}>Details</button>
          </li>
        ))}
      </ul>

      {/* List of past meetups */}
      <h3>Past Meetups:</h3>
      <ul>
        {pastMeetups.map((event) => (
          <li key={event.id} style={{ marginBottom: "1rem" }}>
            <h3>{event.title}</h3>
            <p>
              Date: {new Date(event.date).toLocaleDateString()} at{" "}
              {new Date(event.date).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <button onClick={() => getMeetupDetails(event.id)}>Details</button>
          </li>
        ))}
      </ul>

      {/* Overlay for meetup details */}
      {selectedEvent && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "2rem",
              width: "90%",
              maxWidth: "500px",
              borderRadius: "8px",
            }}
          >
            <h2>{selectedEvent.title}</h2>
            <p>
              Date: {new Date(selectedEvent.date).toLocaleDateString()} at{" "}
              {new Date(selectedEvent.date).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p>Location: {selectedEvent.location}</p>
            <p>Description: {selectedEvent.description}</p>
            <p>Host: {selectedEvent.host}</p>
            <p>Capacity: {selectedEvent.capacity}</p>
            <p>Registered Users: {selectedEvent.registeredCount}</p>

            {/* Error or success feedback in the overlay */}
            {overlayFeedback && (
              <p style={{ color: "red" }}>{overlayFeedback}</p>
            )}

            <button onClick={() => setSelectedEvent(null)}>Return</button>
            <button onClick={() => unregisterFromMeetup(selectedEvent._id)}>
              Unregister
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

import React, { useEffect, useState } from "react";
import "../Styles/EventsPage.css";

const EventsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [overlayFeedback, setOverlayFeedback] = useState("");

  const username = localStorage.getItem("username") || "User";

  const handleSearch = async () => {
    if (searchTerm.trim() === "") {
      setOverlayFeedback("Please enter a keyword to search.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/meetups/search?keyword=${searchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
        setOverlayFeedback(
          data.length ? "" : "No meetings found with that keyword."
        );
      } else {
        setOverlayFeedback("Error fetching meetings.");
      }
    } catch (error) {
      setOverlayFeedback("Error connecting to the server.");
    }
  };

  const fetchAllEvents = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/meetups/upcoming",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
        setOverlayFeedback(data.length ? "" : "No upcoming meetings found.");
      } else {
        setOverlayFeedback("Error loading meetings.");
      }
    } catch (error) {
      setOverlayFeedback("Error connecting to the server.");
    }
  };

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
        setSelectedEvent(data);
      } else {
        setOverlayFeedback("Error fetching event details.");
      }
    } catch (error) {
      setOverlayFeedback("Error connecting to the server.");
    }
  };

  const registerForMeetup = async (eventId) => {
    if (!eventId) {
      setOverlayFeedback("Event ID is missing. Please try again.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/meetups/${eventId}/register`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setOverlayFeedback(
          data.message || "Registration completed successfully!"
        );

        setSelectedEvent((prevEvent) => ({
          ...prevEvent,
          registeredCount: prevEvent.registeredCount + 1,
        }));
      } else {
        const errorData = await response.json();
        setOverlayFeedback(
          errorData.message || "Error registering for the event."
        );
      }
    } catch (error) {
      setOverlayFeedback("Error connecting to the server.");
    }
  };

  useEffect(() => {
    if (!searchTerm) {
      fetchAllEvents();
    }
  }, [searchTerm]);

  const closeOverlay = () => {
    setSelectedEvent(null);
    setOverlayFeedback("");
  };

  return (
    <div className="events-page">
      <h2 className="greeting">Hello, {username}! Explore upcoming events:</h2>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for events"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
      </div>

      <h2>Upcoming Events</h2>
      <ul className="event-list">
        {events.map((event) => (
          <li key={event._id} className="event-item">
            <h3>{event.title}</h3>
            <p>
              Date: {new Date(event.date).toLocaleDateString()} at{" "}
              {new Date(event.date).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <p>Location: {event.location}</p>
            <p>Host: {event.host}</p>
            <button
              onClick={() => getMeetupDetails(event._id)}
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

            {overlayFeedback && <p className="feedback">{overlayFeedback}</p>}

            <button onClick={closeOverlay} className="close-button">
              Return
            </button>
            <button
              onClick={() => registerForMeetup(selectedEvent?._id)}
              className="attend-button"
            >
              Attend
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;

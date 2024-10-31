import React, { useEffect, useState } from "react";

const EventsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [overlayFeedback, setOverlayFeedback] = useState("");

  // Recupera o nome do usuário do localStorage
  const username = localStorage.getItem("username") || "User";

  // Função para buscar eventos com base no termo de pesquisa
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

  // Função para carregar todos os próximos eventos
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

  // Função para buscar detalhes do evento específico
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
        setSelectedEvent(data); // Armazena o evento selecionado para exibir no overlay
      } else {
        setOverlayFeedback("Error fetching event details.");
      }
    } catch (error) {
      setOverlayFeedback("Error connecting to the server.");
    }
  };

  // Função para inscrever o usuário no evento e exibir a mensagem do backend
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

        // Atualiza a contagem de inscritos no estado do evento selecionado
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

  // Carrega todos os eventos futuros apenas se o campo de busca estiver vazio
  useEffect(() => {
    if (!searchTerm) {
      fetchAllEvents();
    }
  }, [searchTerm]);

  // Função para fechar o overlay e limpar o feedback
  const closeOverlay = () => {
    setSelectedEvent(null);
    setOverlayFeedback(""); // Limpa o feedback ao fechar o overlay
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Hello, {username}! Explore upcoming events:</h2>

      {/* Campo de pesquisa */}
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Search for events"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <h2>Upcoming events</h2>
      <ul>
        {events.map((event) => (
          <li key={event._id} style={{ marginBottom: "1rem" }}>
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
            <button onClick={() => getMeetupDetails(event._id)}>Details</button>
          </li>
        ))}
      </ul>

      {/* Overlay para detalhes do evento */}
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

            {overlayFeedback && (
              <p>{overlayFeedback}</p>
            )}

            <button onClick={closeOverlay}>Return</button>
            <button onClick={() => registerForMeetup(selectedEvent?._id)}>
              Attend
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;

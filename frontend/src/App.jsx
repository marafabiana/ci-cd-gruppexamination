import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import EventsPage from './pages/EventsPage'; 

const App = () => {
  const isLoggedIn = Boolean(localStorage.getItem('token')); // 

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/events" element={isLoggedIn ? <EventsPage /> : <Navigate to="/login" />} />
        <Route path="/profile" element={<Profile />} />
        
      </Routes>
    </Router>
  );
};

export default App;


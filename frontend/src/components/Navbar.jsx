import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const isLoggedIn = Boolean(localStorage.getItem('token')); // Check if the user is logged in

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem' }}>
      {/* Redirect to the homepage */}
      <Link to="/">
        <h1>Meetup Logo</h1>
      </Link>
      <div>
        {isLoggedIn ? (
          <>
            <Link to="/profile">
              <button>Profile</button>
            </Link>
            <button onClick={() => {
              localStorage.removeItem('token'); // Logout
              window.location.href = '/'; // Redirect to the homepage
            }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">
              <button>Log In</button>
            </Link>
            <Link to="/register">
              <button>Sign Up</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const isLoggedIn = Boolean(localStorage.getItem('token')); 

  return (
    <div style={{ padding: '2rem' }}>
      <h2>The people platform—Where interests become friendships</h2>
      
      {isLoggedIn ? (
        <Link to="/events">
          <button>See all events</button>
        </Link>
      ) : (
        <>
          <p>
            Whatever your interest, from hiking and reading to networking and skill sharing, there are thousands of people who share it on Meetup. Events are happening every day—sign up to join the fun.
          </p>
          <Link to="/register">
            <button>Join Meetup</button>
          </Link>
        </>
      )}
    </div>
  );
};

export default Home;

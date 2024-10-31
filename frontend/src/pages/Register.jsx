import React, { useState } from 'react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [feedback, setFeedback] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:3000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
  
      if (response.ok) {
        setFeedback('Congratulations, your account has been successfully created!');
        setFormData({ name: '', email: '', password: '' });
      } else {
        const data = await response.json();
        setFeedback(data.error || 'Registration failed.');
      }
    } catch (error) {
      setFeedback('Error connecting to server');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>New to Meetup? We'll help you get started.</h2>
      <p>Create an account.</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label>First and Last name: </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email: </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password: </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Join</button>
      </form>
      {feedback && <p>{feedback}</p>}
    </div>
  );
};

export default Register;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';  // Use useNavigate instead of useHistory
import axios from 'axios';

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');  // New state for email
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');  // New state for name
  const [bio, setBio] = useState('');  // New state for bio
  const [error, setError] = useState('');  // Track error messages
  const navigate = useNavigate();  // Initialize navigate hook

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const signupData = {
      requestInfo: {
        token: null,
        timestamp: new Date().toISOString(),
      },
      data: {
        username,
        email,  // Include email in the request
        name,    // Include name in the request
        bio,     // Include bio in the request
        password,
      },
    };

    try {
      // Make the API call to the backend for signup
      const response = await axios.post('http://localhost:8080/api/v1/users/signup', signupData);
      
      console.log('Signup successful:', response.data);

      // Navigate to the login page after successful signup
      navigate('/login');
    } catch (err) {
      console.error('Signup error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}  {/* Display error message if signup fails */}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label> {/* New email field */}
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="name">Name:</label> {/* New name field */}
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="bio">Bio:</label> {/* New bio field */}
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
      
      <p>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
};

export default SignupPage;

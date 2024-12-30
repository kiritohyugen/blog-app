import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';  // useNavigate instead of useHistory
import axios from 'axios';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();  // Initialize navigate hook

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!username || !password) {
      alert('Please enter both username and password!');
      return;
    }

    // Prepare the login data to match the required backend format
    const loginData = {
      requestInfo: {
        token: null,  // Your backend expects this to be null
        timestamp: new Date().toISOString(),
      },
      data: {
        username,
        password,
      },
    };

    try {
      // Make the API call to the backend for login
      const response = await axios.post('http://localhost:8080/api/v1/users/login', loginData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Login successful:', response.data);
      
      // Extract token from the response
      const token = response.data.data.token;

      if (token) {
        // Store JWT token in localStorage
        localStorage.setItem('authToken', token);

        // Navigate to the home page or a protected page after successful login
        navigate('/home');  // Assuming '/home' is the main page for authenticated users
      } else {
        setError('Login failed. Please check your credentials and try again.');
      }
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <div>
      <h2>Log In</h2>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}  {/* Display error message if login fails */}
      
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
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Log In</button>
      </form>
      
      <p>
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
};

export default LoginPage;

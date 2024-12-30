import React, { useState } from "react";
import axios from "axios";
import '../App.css'; // Add any required styles here

const LogoutPopup = ({ onClose, onLogout }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogout = async () => {
    const token = localStorage.getItem("authToken");

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/users/logout",
        {
          requestInfo: {
            token: token,
            timestamp: new Date().toISOString(),
          },
          data: {
            username: username,
            password: password,
          },
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.responseInfo.success) {
        console.log("Logout successful.");
        onLogout(); // Trigger logout logic in the parent component
        onClose();  // Close the popup
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      console.error("Error during logout:", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="logout-popup-overlay">
      <div className="logout-popup">
        <h2>Logout</h2>
        <p>Enter your username and password to logout:</p>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="error">{error}</p>}
        <button onClick={handleLogout}>Logout</button>
        <button
          onClick={() => {
            console.log("Cancel clicked.");
            onClose(); // Close the popup without logging out
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default LogoutPopup;

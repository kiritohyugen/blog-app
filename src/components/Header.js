import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoutPopup from '../pages/LogoutPopup'; // Import the LogoutPopup component
import '../App.css';

const Header = () => {
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear localStorage and navigate to the login page
    console.log("Logout confirmed, clearing auth token.");
    localStorage.removeItem("authToken");
    setShowLogoutPopup(false); // Ensure the popup disappears
    navigate("/login");
  };

  return (
    <header className="header">
      <h1 className="logo">My Blog</h1>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/signup">Signup</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li>
            <button
              onClick={() => {
                console.log("Logout button clicked");
                setShowLogoutPopup(true);
              }}
              className="logout-button"
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>
      {showLogoutPopup && (
        <LogoutPopup
          onClose={() => {
            console.log("Popup closed.");
            setShowLogoutPopup(false);
          }}
          onLogout={handleLogout}
        />
      )}
    </header>
  );
};

export default Header;

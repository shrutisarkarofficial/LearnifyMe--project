import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../style/Header.css";
import { FaBars, FaTimes } from "react-icons/fa";
import logoImage from "../../assets/LearnifyMe_logo(1).png";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="logo" onClick={() => navigate("/")}>
          <img src={logoImage} alt="LearnifyMe Logo" className="logo-icon" />
          LearnifyMe
        </div>

        {/* Navigation Links */}
        <div className={`nav-links ${menuOpen ? "active" : ""}`}>
          {/* Add About and Contact here */}
          <Link to="/home" className="nav-link">
            Home
          </Link>
          <Link to="/about" className="nav-link">
            About
          </Link>
          <Link to="/contact" className="nav-link">
            Contact
          </Link>

          {/* Buttons */}
          <button className="btn sign-in" onClick={() => navigate("/LogIn")}>
            Log In
          </button>
          <button className="btn sign-up" onClick={() => navigate("/SignUp")}>
            Sign Up
          </button>
        </div>

        {/* Mobile Menu Icon */}
        <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>
    </nav>
  );
};

export default Header;
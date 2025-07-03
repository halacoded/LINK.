import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar__logo">
        LINK.
      </Link>
      <div className="navbar__options">
        <Link to="/login" className="navbar__link">
          Login
        </Link>
        <Link to="/signup" className="navbar__link">
          Sign Up
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;

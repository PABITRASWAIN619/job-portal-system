// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import "./styles/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        JobPortal
      </Link>

      <div className="nav-buttons">
        <Link to="/" className="nav-link">
          Home
        </Link>

        <Link to="/login" className="nav-link">
          Login
        </Link>

        <Link to="/signup" className="signup-btn">
          Signup
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;

// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import "./styles/Navbar.css"; // ✅ Correct path

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">JobPortal</div>
      <div className="nav-buttons">
        <Link to="/" className="btn">Home</Link>
        <Link to="/login" className="btn">Login</Link>
        <Link to="/signup" className="btn primary">Signup</Link>
      </div>
    </nav>
  );
};

export default Navbar;

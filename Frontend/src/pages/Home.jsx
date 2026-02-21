import React from "react";
import { Link } from "react-router-dom";
import "./home.css";

function Home() {
  return (
    <div className="home">
      <div className="home-content">
        <h1>Welcome to Job Portal</h1>
        <p>Connect with jobs and opportunities tailored for you.</p>
        <div className="home-buttons">
          <Link to="/signup" className="btn signup-btn">Signup</Link>
          <Link to="/login" className="btn login-btn">Login</Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
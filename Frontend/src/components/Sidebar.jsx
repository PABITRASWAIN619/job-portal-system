import React from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

function Sidebar({ setActivePage }) {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h2>Job Portal</h2>
      </div>

      <div className="sidebar-nav">
        {/* These update the Dashboard content */}
        <div className="nav-item" onClick={() => setActivePage("view")}>
          🏠 View Jobs
        </div>

        <div className="nav-item" onClick={() => setActivePage("post")}>
          ➕ Post Job
        </div>

        <div className="nav-item" onClick={() => setActivePage("myapplications")}>
          📄 My Applications
        </div>

        {/* ✅ This navigates to the separate Profile page */}
        <div className="nav-item profile-nav" onClick={() => navigate("/profile")}>
          👤 My Profile
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
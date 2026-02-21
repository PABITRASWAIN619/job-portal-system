import React, { useEffect, useState } from "react";
import Profile from "./Profile"; // Your existing Profile component
import api from "../axiosConfig";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./UserDashboard.css";

function UserDashboard() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [resume, setResume] = useState(null);
  const [view, setView] = useState("jobs"); // 'jobs' or 'profile'
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/api/jobs");
        setJobs(res.data);
      } catch (err) {
        console.error("Error fetching jobs", err);
      }
    };
    fetchJobs();
  }, []);

  const applyJob = async (jobId) => {
    if (!resume) return alert("Upload resume first!");
    const formData = new FormData();
    formData.append("resume", resume);

    try {
      await api.post(`/api/applications/${jobId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Applied Successfully!");
      setResume(null);
    } catch (err) {
      alert("Application failed.");
    }
  };

 const logout = () => {
  localStorage.clear();
  // Ensure the path is exactly "/login"
  navigate("/login", { replace: true }); 
};
  return (
    <div className="user-dashboard-container" style={{ display: "flex", height: "100vh" }}>
      {/* Pass setView to Sidebar so clicking "Profile" in Sidebar 
        changes the 'view' state here 
      */}
      <Sidebar 
        handleLogout={logout} 
        role="user" 
        setView={setView} 
      />

      <main className="user-dashboard-main" style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
        {view === "jobs" ? (
          <>
            <h1 style={{ color: "green" }}>USER DASHBOARD</h1>
            <h1>Welcome {user?.name}</h1>
            <hr />
            <h2>Available Jobs</h2>
            {jobs.map((job) => (
              <div key={job._id} className="job-card">
                <h3>{job.title}</h3>
                <p>{job.description}</p>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setResume(e.target.files[0])}
                />
                <button onClick={() => applyJob(job._id)}>Apply</button>
              </div>
            ))}
          </>
        ) : (
          <Profile /> 
        )}
      </main>
    </div>
  );
}

export default UserDashboard;
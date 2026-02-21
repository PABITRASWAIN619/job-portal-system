import React, { useEffect, useState } from "react";
import api from "../axiosConfig";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [company, setCompany] = useState(""); // 👈 Added state for company
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get("/api/jobs");
      setJobs(res.data);
    } catch (err) {
      console.error("Error fetching jobs", err);
    }
  };

  const postJob = async () => {
    // 👈 Check if company is included
    if (!title || !description || !company) {
      return alert("Please fill Title, Company, and Description");
    }

    try {
      await api.post("/api/jobs", { 
        title, 
        description, 
        company, // 👈 Sending required company field
        location: "Remote" // Optional but good to have
      });

      alert("Job Posted Successfully!");
      setTitle("");
      setDescription("");
      setCompany(""); // Clear company field
      fetchJobs();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error posting job");
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="admin-dashboard-container">
      <Sidebar handleLogout={logout} role="admin" />

      <main className="admin-dashboard-main">
        <h1 style={{ color: "red" }}>ADMIN DASHBOARD</h1>
        <h1>Welcome Admin {user?.name}</h1>

        <div className="job-post-form">
          <h2>Post New Job</h2>

          <input
            type="text"
            placeholder="Job Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="text"
            placeholder="Company Name"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />

          <textarea
            placeholder="Job Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button onClick={postJob}>Post Job</button>
        </div>

        <h2>All Jobs & Applications</h2>

        {jobs.map((job) => (
          <div key={job._id} className="job-card">
            <h3>{job.title}</h3>
            <p><strong>Company:</strong> {job.company}</p>
            <p>{job.description}</p>

            <div className="applications-list">
              {job.applications?.length > 0 ? (
                job.applications.map((app) => (
                  <div key={app._id} className="application-card">
                    <p><strong>User:</strong> {app.user?.name}</p>
                    <a href={app.resume} target="_blank" rel="noreferrer">
                      View Resume
                    </a>
                  </div>
                ))
              ) : (
                <p>No Applications Yet</p>
              )}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

export default AdminDashboard;
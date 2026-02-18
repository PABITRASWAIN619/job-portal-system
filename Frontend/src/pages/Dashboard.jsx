import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");

  // Redirect to login if no token
  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true }); // replace prevents back navigation
    }
  }, [token, navigate]);

  // Fetch jobs
  useEffect(() => {
    if (!token) return; // skip fetching if no token

    const fetchJobs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/jobs", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.jobs) setJobs(res.data.jobs);
        else if (Array.isArray(res.data)) setJobs(res.data);
        else setJobs([]);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true }); // ensure redirect
  };

  // Safe filter
  const filteredJobs = Array.isArray(jobs)
    ? jobs.filter((job) =>
        job.title.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  // If no token, do not render Dashboard content
  if (!token) return null;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>JobPortal Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </header>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search jobs by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Loading jobs...</p>
      ) : filteredJobs.length === 0 ? (
        <p>No jobs found.</p>
      ) : (
        <div className="jobs-grid">
          {filteredJobs.map((job) => (
            <div className="job-card" key={job._id}>
              <h3>{job.title}</h3>
              <p>
                <strong>Company:</strong> {job.company}
              </p>
              <p>
                <strong>Location:</strong> {job.location}
              </p>
              <p>
                <strong>Posted:</strong>{" "}
                {new Date(job.createdAt).toLocaleDateString()}
              </p>
              <button>Apply Now</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;

import React, { useEffect, useState } from "react";
import api from "../axiosConfig";
import { useNavigate, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activePage, setActivePage] = useState("view");
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [company, setCompany] = useState("");
  const [selectedFiles, setSelectedFiles] = useState({});

  const BACKEND_URL = "http://localhost:5000";

  useEffect(() => {
    fetchUser();
    fetchJobs();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await api.get("/users/profile");
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch (err) {
      console.error("Failed to fetch user", err);
    }
  };

  // ✅ HELPER FUNCTION TO FIX IMAGE PATHS
  const getImageUrl = (path) => {
    if (!path) return null;
    // If path already contains "uploads", don't add it again
    const cleanPath = path.replace(/^\//, ""); 
    return cleanPath.includes("uploads") 
      ? `${BACKEND_URL}/${cleanPath}` 
      : `${BACKEND_URL}/uploads/${cleanPath}`;
  };

  const fetchJobs = async () => {
    try {
      const res = await api.get("/jobs");
      setJobs(res.data);
    } catch (err) {
      console.error("Error fetching jobs", err);
    }
  };

  const fetchMyApplications = async () => {
    try {
      const res = await api.get("/applications/my");
      setApplications(res.data);
    } catch (err) {
      console.error("Failed to load applications", err);
    }
  };

  const handleApply = async (jobId) => {
    const file = selectedFiles[jobId];
    if (!file) return alert("Please select a resume file first!");
    const formData = new FormData();
    formData.append("resume", file);
    try {
      await api.post(`/applications/${jobId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccessMessage("Applied Successfully! ✅");
      setSelectedFiles({ ...selectedFiles, [jobId]: null });
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      alert("Apply failed.");
    }
  };

  const postJob = async () => {
    if (!title || !description || !company) return alert("Fill all fields");
    try {
      await api.post("/jobs", { title, description, company });
      setSuccessMessage("Job Posted! 🚀");
      setTitle("");
      setDescription("");
      setCompany("");
      setTimeout(() => {
        setSuccessMessage("");
        setActivePage("view");
        fetchJobs();
      }, 2000);
    } catch (err) {
      alert("Post failed.");
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar
        setActivePage={(page) => {
          setActivePage(page);
          if (page === "myapplications") fetchMyApplications();
        }}
      />

      <div className="dashboard-content">
        <div className="top-navbar">
          <div className="user-info">
            {/* ✅ CLICKABLE PROFILE PIC WITH FIXED PATH */}
            <Link to="/profile" className="profile-link-wrapper">
              {user?.profilePic ? (
                <img
                  src={getImageUrl(user.profilePic)}
                  alt="Profile"
                  className="nav-profile-pic clickable"
                  onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
                />
              ) : (
                <div className="nav-profile-placeholder clickable">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
            </Link>
            <h1>Welcome, {user?.name || "User"}</h1>
          </div>

          <button className="logout-btn" onClick={() => { localStorage.clear(); navigate("/Home"); }}>
            Logout
          </button>
        </div>

        {successMessage && <div className="success-banner">{successMessage}</div>}

        {activePage === "view" && (
          <div className="section">
            <h2>Available Opportunities</h2>
            <div className="grid">
              {jobs.map((job) => (
                <div key={job._id} className="card">
                  <h3>{job.title}</h3>
                  <p className="comp">{job.company}</p>
                  <p className="desc">{job.description}</p>
                  <div className="apply-box">
                    <input type="file" accept=".pdf" onChange={(e) => setSelectedFiles({ ...selectedFiles, [job._id]: e.target.files[0] })} />
                    <button onClick={() => handleApply(job._id)}>Apply Now</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activePage === "post" && (
          <div className="section">
            <h2>Create Job Post</h2>
            <div className="form-card">
              <input type="text" placeholder="Job Title" value={title} onChange={(e) => setTitle(e.target.value)} />
              <input type="text" placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} />
              <textarea placeholder="Job Description" value={description} onChange={(e) => setDescription(e.target.value)} />
              <button className="submit-btn" onClick={postJob}>Publish Job</button>
            </div>
          </div>
        )}

        {activePage === "myapplications" && (
          <div className="section">
            <h2>My Applications</h2>
            {applications.length === 0 ? <p>No applications yet.</p> : (
              <div className="app-list">
                {applications.map((app) => (
                  <div key={app._id} className="app-card">
                    <div>
                      <h4>{app.job?.title}</h4>
                      <p>{app.job?.company}</p>
                    </div>
                    <div className="app-right">
                      <span className="status">Status: {app.status}</span>
                      {app.resume && (
                        <a href={getImageUrl(app.resume)} target="_blank" rel="noreferrer" className="resume-link">
                          📄 View Resume
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
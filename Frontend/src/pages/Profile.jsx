import React, { useState } from "react";
import api from "../axiosConfig";
import { useNavigate } from "react-router-dom"; // for redirect
import "./Profile.css";

function Profile() {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [user, setUser] = useState(storedUser || {});
  const [profilePic, setProfilePic] = useState(null);
  const [previewPic, setPreviewPic] = useState(user.profilePic || "");
  const [resume, setResume] = useState(null);
  const [success, setSuccess] = useState("");

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
    if (file) setPreviewPic(URL.createObjectURL(file));
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    setResume(file);
  };

  const updateProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      // 1️⃣ Update name + profile pic
      const formData = new FormData();
      formData.append("name", user.name);
      if (profilePic) formData.append("profilePic", profilePic);

      const res = await api.put("/users/profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      let updatedUser = { ...user, ...res.data };

      // 2️⃣ Upload resume separately if selected
      if (resume) {
        const resumeForm = new FormData();
        resumeForm.append("resume", resume);

        const resumeRes = await api.put("/users/profile/resume", resumeForm, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        updatedUser = { ...updatedUser, resume: resumeRes.data.resume };
      }

      // 3️⃣ Update state + localStorage
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // 4️⃣ Clear file inputs
      setProfilePic(null);
      setResume(null);

      // 5️⃣ Show success message and redirect after short delay
      setSuccess("Profile Updated Successfully ✅");
      setTimeout(() => {
        navigate("/dashboard"); // automatically go to dashboard
      }, 1000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>My Profile</h2>
        {success && <div className="success-msg">{success}</div>}

        {/* Profile Picture */}
        <div className="profile-image-section">
          {previewPic ? (
            <img
              src={profilePic ? previewPic : `http://localhost:5000/uploads/${previewPic}`}
              alt="Profile"
              className="profile-image"
            />
          ) : (
            <div className="profile-placeholder">No Image</div>
          )}
        </div>

        <input
          type="text"
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
        />
        <input type="file" onChange={handleProfilePicChange} />

        {/* Resume Upload */}
        <div style={{ marginTop: "10px" }}>
          <input type="file" onChange={handleResumeChange} />
          {user.resume && (
            <a
              href={`http://localhost:5000/uploads/${user.resume}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "block", marginTop: "5px" }}
            >
              View Resume
            </a>
          )}
        </div>

        <button onClick={updateProfile} style={{ marginTop: "10px" }}>
          Update Profile
        </button>
      </div>
    </div>
  );
}

export default Profile;
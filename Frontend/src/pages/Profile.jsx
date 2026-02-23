import React, { useState } from "react";
import api from "../axiosConfig";
import "./Profile.css";

function Profile() {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const [name, setName] = useState(storedUser?.name || "");
  const [role, setRole] = useState(storedUser?.role || "");
  const [skills, setSkills] = useState("");
  const [education, setEducation] = useState("");
  const [experience, setExperience] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [success, setSuccess] = useState("");

  const updateProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("name", name);
      formData.append("role", role);
      formData.append("skills", skills);
      formData.append("education", education);
      formData.append("experience", experience);

      if (profilePic) {
        formData.append("profilePic", profilePic);
      }

      const res = await api.put("/api/users/profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      localStorage.setItem("user", JSON.stringify(res.data));

      setSuccess("Profile Updated Successfully ✅");
    } catch (error) {
      console.error(error);
      alert("Profile update failed");
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>My Profile</h2>

        {success && <div className="success-msg">{success}</div>}

        <div className="profile-image-section">
          {storedUser?.profilePic && (
            <img
              src={`http://localhost:5000/${storedUser.profilePic}`}
              alt="Profile"
              className="profile-image"
            />
          )}
        </div>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Role (jobseeker/admin)"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />

        <input
          type="text"
          placeholder="Skills (comma separated)"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />

        <input
          type="text"
          placeholder="Education"
          value={education}
          onChange={(e) => setEducation(e.target.value)}
        />

        <textarea
          placeholder="Experience"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
        />

        <input
          type="file"
          onChange={(e) => setProfilePic(e.target.files[0])}
        />

       <button onClick={updateProfile}>Update Profile</button>
<button className="back-btn" onClick={() => window.history.back()}>
  ← Back to Dashboard
</button>
      </div>
    </div>
  );
}

export default Profile;
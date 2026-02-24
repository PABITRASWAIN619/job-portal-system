import React, { useState } from "react";
import api from "../axiosConfig";
import "./Profile.css";

function Profile() {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const [name, setName] = useState(storedUser?.name || "");
  const [profilePic, setProfilePic] = useState(null);
  const [previewPic, setPreviewPic] = useState(
    storedUser?.profilePic || ""
  );
  const [success, setSuccess] = useState("");

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
    if (file) {
      setPreviewPic(URL.createObjectURL(file));
    }
  };

  const updateProfile = async () => {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("name", name);
    if (profilePic) {
      formData.append("profilePic", profilePic);
    }

    const res = await api.put("/users/profile", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    const updatedUser = {
      ...storedUser,
      ...res.data,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    setSuccess("Profile Updated Successfully ✅");

    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1000);
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>My Profile</h2>

        {success && <div className="success-msg">{success}</div>}

        <div className="profile-image-section">
          {previewPic ? (
            <img
              src={
                profilePic
                  ? previewPic
                  : `http://localhost:5000/uploads/${previewPic}`
              }
              alt="Profile"
              className="profile-image"
            />
          ) : (
            <div className="profile-placeholder">No Image</div>
          )}
        </div>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input type="file" onChange={handleProfilePicChange} />

        <button onClick={updateProfile}>Update Profile</button>
      </div>
    </div>
  );
}

export default Profile;
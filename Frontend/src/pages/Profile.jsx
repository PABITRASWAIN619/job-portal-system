import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", role: "", skills: "" });
  const [previewImg, setPreviewImg] = useState(null);
  const fileInputRef = useRef(null);
  const token = localStorage.getItem("token");

  // Load User Data
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setFormData({
        name: storedUser.name,
        role: storedUser.role,
        skills: storedUser.skills?.join(", ") || ""
      });
      if (storedUser.profilePic) {
        setPreviewImg(`http://localhost:5000/${storedUser.profilePic}`);
      }
    }
  }, []);

  const handleImageClick = () => {
    if (isEditing) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImg(URL.createObjectURL(file)); // Show local preview
      setFormData({ ...formData, profilePic: file });
    }
  };

  const handleSave = async () => {
    const data = new FormData();
    data.append("name", formData.name);
    data.append("role", formData.role);
    data.append("skills", formData.skills);
    if (formData.profilePic) data.append("profilePic", formData.profilePic);

    try {
      const res = await axios.put("http://localhost:5000/api/users/profile", data, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data" 
        },
      });
      
      localStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data);
      setIsEditing(false);
      alert("✅ Profile Updated!");
    } catch (err) {
      alert("❌ Update failed. Check backend console.");
    }
  };

  if (!user) return <div className="loader">Loading Profile...</div>;

  return (
    <div className="profile-container">
      <div className="profile-card glass-card">
        <div className={`avatar-section ${isEditing ? "editing" : ""}`} onClick={handleImageClick}>
          {previewImg ? (
            <img src={previewImg} alt="Profile" className="profile-img" />
          ) : (
            <div className="avatar-placeholder">{user.name.charAt(0)}</div>
          )}
          {isEditing && <div className="img-overlay">Change Photo</div>}
          <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileChange} />
        </div>

        <div className="profile-info-section">
          {isEditing ? (
            <div className="edit-form">
              <input 
                type="text" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                placeholder="Your Name"
              />
              <select 
                value={formData.role} 
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="jobseeker">Job Seeker</option>
                <option value="employer">Employer</option>
              </select>
              <input 
                type="text" 
                value={formData.skills} 
                onChange={(e) => setFormData({...formData, skills: e.target.value})} 
                placeholder="Skills (comma separated: React, Node)"
              />
            </div>
          ) : (
            <div className="view-mode">
              <h1>{user.name}</h1>
              <p className="role-tag">{user.role}</p>
              <div className="skills-container">
                {user.skills?.map((skill, i) => (
                  <span key={i} className="skill-badge">{skill}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="profile-actions">
          {isEditing ? (
            <>
              <button className="save-btn" onClick={handleSave}>Save</button>
              <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
            </>
          ) : (
            <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
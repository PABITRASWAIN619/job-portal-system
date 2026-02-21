import React, { useState } from "react";
import api from "../axiosConfig";
import { useNavigate, Link } from "react-router-dom";
import "./signup.css";

function Signup() {
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false); // New state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "jobseeker"
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await api.post("/api/auth/signup", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });

      setIsSuccess(true); // Show success message on screen
      setTimeout(() => navigate("/login"), 3000); // Redirect after 3 seconds
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  // If signup is successful, show this on the browser screen
  if (isSuccess) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2 style={{ color: "green" }}>✅ Account Created!</h2>
          <p>Redirecting you to the login page...</p>
          <Link to="/login">Click here if not redirected</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} required />
          
          <select name="role" value={formData.role} onChange={handleChange}>
  <option value="jobseeker">Job Seeker</option>
  <option value="employes">Employer (Admin)</option> 
</select>

          <button type="submit">Signup</button>
        </form>
        <p>Already have account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}

export default Signup;
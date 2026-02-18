// src/pages/Login.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./login.css"; // Create login.css similar to signup.css

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState(""); // popup message

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);

      // Save JWT token
      localStorage.setItem("token", res.data.token);

      setMessage("🎉 Login Successful! Redirecting to Dashboard...");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
        </form>

        {/* Success or error message */}
        {message && (
          <p style={{ textAlign: "center", marginTop: "15px" }}>{message}</p>
        )}

        {/* Link to Signup page */}
        <p style={{ textAlign: "center", marginTop: "15px" }}>
          Don’t have an account?{" "}
          <Link to="/signup" style={{ color: "#270b9a", fontWeight: "bold" }}>
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;

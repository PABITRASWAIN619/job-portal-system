import React, { useState } from "react";
import api from "../axiosConfig";
import { useNavigate, Link } from "react-router-dom";
import "./Signup.css";
function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      return alert("Passwords do not match! ❌");
    }

    try {
      await api.post("/users/signup", {
        name,
        email,
        password,
      });

      alert("Signup Successful ✅ Please Login.");
      navigate("/login"); // Go to Login after Signup
    } catch (err) {
      alert(err.response?.data?.message || "Signup Failed ❌");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Create Account 🚀</h2>
        <form onSubmit={handleSignup}>
          <input type="text" placeholder="Name" required value={name} onChange={(e) => setName(e.target.value)} />
          <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          <input type="password" placeholder="Confirm Password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          <button type="submit" className="signup-btn">Signup</button>
        </form>
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}

export default Signup;
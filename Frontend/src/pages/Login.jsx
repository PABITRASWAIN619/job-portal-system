import React, { useState } from "react";
import api from "../axiosConfig";
import { useNavigate } from "react-router-dom";
import "./login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await api.post("/api/auth/login", { email, password });
    
    // 1. Get token and user from the response
    const { token, user } = response.data;

    if (!user || !user.role) {
      alert("Login failed: User role is missing.");
      return;
    }

    // 2. Save to localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    // 3. YOUR NEW ROLE LOGIC GOES HERE:
    const userRole = user.role.toLowerCase().trim();

    console.log("User Role detected:", userRole);

    if (userRole === "admin" || userRole === "employes") {
      console.log("Admin/Employer access granted");
      navigate("/admin-dashboard", { replace: true });
    } else if (userRole === "jobseeker") {
      console.log("Jobseeker access granted");
      navigate("/user-dashboard", { replace: true });
    } else {
      // Fallback if role is something unexpected
      console.warn("Unknown role, defaulting to user dashboard");
      navigate("/user-dashboard", { replace: true });
    }

  } catch (err) {
    console.error("Login attempt failed:", err);
    alert("❌ " + (err.response?.data?.message || "Invalid email or password"));
  }
};
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-btn">Login</button>
        </form>
        <p className="auth-footer">
          Don't have an account? <span onClick={() => navigate("/signup")}>Sign up</span>
        </p>
      </div>
    </div>
  );
}

export default Login;
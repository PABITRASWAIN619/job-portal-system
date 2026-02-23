import React, { useState } from "react";
import api from "../axiosConfig";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

function Login() {
  const image =[
    
  ]
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Added loading state for better UX
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/users/login", { email, password });
      
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Invalid Email or Password ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome Back</h2>
        <p className="subtitle">Please enter your details to sign in.</p>
        
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input 
              type="email" 
              placeholder="Email Address" 
              required 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>
          <div className="input-group">
            <input 
              type="password" 
              placeholder="Password" 
              required 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>
          
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="signup-text">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
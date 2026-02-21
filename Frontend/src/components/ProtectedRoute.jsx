import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");

  // 1. If no token or user data, force to login
  if (!token || !userString) {
    return <Navigate to="/login" replace />;
  }

  let user;
  try {
    user = JSON.parse(userString);
  } catch (error) {
    // If data is corrupted, clear it and force login
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  // 2. Verify role existence and normalize it
  if (!user || !user.role) {
    return <Navigate to="/login" replace />;
  }

  // Inside ProtectedRoute.jsx
const currentRole = user.role.toLowerCase().trim();

if (allowedRole === "admin") {
  // Allow both "admin" and "employes" strings to pass
  if (currentRole === "admin" || currentRole === "employes") {
    return children;
  } else {
    return <Navigate to="/login" replace />;
  }
}
  // 4. Everything is perfect, show the page
  return children;
};

export default ProtectedRoute;
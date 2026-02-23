import axios from "axios";

const api = axios.create({
  // Base URL points to your backend API prefix
  baseURL: "http://localhost:5000/api", 
});

// This interceptor automatically attaches your Token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
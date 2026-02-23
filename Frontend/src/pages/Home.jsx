import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./home.css";

function Home() {
  const images = [
    "https://tse4.mm.bing.net/th/id/OIP.72qvz1XtXvrRlKLcktkUlwHaDk?pid=Api&P=0&h=180",
    "https://tse1.mm.bing.net/th/id/OIP.xmaM2rOvrpeSovn6KF0D6AHaEc?pid=Api&P=0&h=180",
    "https://tse3.mm.bing.net/th/id/OIP.Q4bUGod2r91k-h4h8CvUJAHaEK?pid=Api&P=0&h=180",
    "https://tse3.mm.bing.net/th/id/OIP.EjOfN53B7s6KvzyED8-lRAHaDt?pid=Api&P=0&h=180",
    "https://tse3.mm.bing.net/th/id/OIP._WI1c2cyRTVUlgoIopUCVgHaDR?pid=Api&P=0&h=180"
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000); // change image every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home">
      <div
        className="home-bg"
        style={{ backgroundImage: `url(${images[current]})` }}
      ></div>

      <div className="home-content">
        <h1>Welcome to Job Portal</h1>
        <p>Connect with jobs and opportunities tailored for you.</p>
        <div className="home-buttons">
          <Link to="/signup" className="btn signup-btn">Signup</Link>
          <Link to="/login" className="btn login-btn">Login</Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
import "./Home.css";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home">
      <div className="home-content">
        <h1>Welcome to JobPortal 🚀</h1>
        <p>Find your dream job from top companies.</p>

        <div className="home-buttons">
          <Link to="/login">
            <button className="btn login-btn">Login</button>
          </Link>
          <Link to="/signup">
            <button className="btn signup-btn">Signup</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
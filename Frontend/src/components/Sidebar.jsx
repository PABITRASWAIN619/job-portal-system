// src/components/Sidebar.jsx
function Sidebar({ handleLogout, setView }) {
  return (
    <div className="sidebar" style={{ width: "250px", background: "#333", color: "#fff", height: "100vh", position: "sticky", top: 0 }}>
      <h2>Menu</h2>
      <ul>
        <li onClick={() => setView("jobs")} style={{ cursor: "pointer", padding: "10px" }}>
          🏠 Dashboard / Jobs
        </li>
        <li onClick={() => setView("profile")} style={{ cursor: "pointer", padding: "10px" }}>
          👤 My Profile
        </li>
        <li onClick={handleLogout} style={{ cursor: "pointer", padding: "10px", color: "red", marginTop: "20px" }}>
          🚪 Logout
        </li>
      </ul>
    </div>
  );
}
export default Sidebar;
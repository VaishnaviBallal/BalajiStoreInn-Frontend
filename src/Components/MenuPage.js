import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { showSuccess } from "../utils/Toast";

function MenuPage() {

  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");

    if (!loggedIn) {
      navigate("/");
    }
  }, [navigate]);

  const logout = () => {

    localStorage.removeItem("loggedIn");

    showSuccess("Logged out successfully");

    navigate("/");

  };

  return (

    <div className="menu-page">

      <button className="logoutBtn" onClick={logout}>
        Logout
      </button>

      <h1>Balaji Inn Store System</h1>

      <div className="menu-buttons">

        <Link to="/dashboard">
          <button>Dashboard</button>
        </Link>

        <Link to="/items-entry">
          <button>Items</button>
        </Link>

        <Link to="/daily-entry">
          <button>Daily Entry</button>
        </Link>

        <Link to="/reports">
          <button>Reports</button>
        </Link>
        
        <Link to="/bin">
  <button>🗑️ Recycle Bin</button>
</Link>

      </div>

    </div>

  );
}

export default MenuPage;
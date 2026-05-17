import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { showSuccess } from "../utils/Toast";
import "../styles/HomePage.css";

function HomePage() {

  const navigate = useNavigate();

  useEffect(() => {

    const loggedIn = localStorage.getItem("loggedIn");

    if (!loggedIn) {
      navigate("/login");
    }

  }, [navigate]);

  const logout = () => {

    localStorage.removeItem("loggedIn");

    showSuccess("Logged out successfully");

    navigate("/");

  };

  return (

    <div className="home-container">

      {/* TOP BAR */}
      <div className="top-bar">

        <h1 className="main-title">
          🍽 Balaji Inn Admin Panel
        </h1>

        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>

      </div>

      {/* DASHBOARD CARDS */}
      <div className="dashboard-grid">

        {/* LIVE ORDERS */}
        <div
          className="dashboard-card"
          onClick={() => navigate("/admin-orders")}
        >
          <h2>📦 Live Orders</h2>
          <p>
            View and manage customer food orders
          </p>
        </div>

        {/* STOCK DASHBOARD */}
        <div
          className="dashboard-card"
          onClick={() => navigate("/dashboard")}
        >
          <h2>📊 Dashboard</h2>
          <p>
            View stock analytics and inventory
          </p>
        </div>

        {/* ITEMS ENTRY */}
        <div
          className="dashboard-card"
          onClick={() => navigate("/items-entry")}
        >
          <h2>➕ Items Entry</h2>
          <p>
            Add and manage stock items
          </p>
        </div>

        {/* DAILY ENTRY */}
        <div
          className="dashboard-card"
          onClick={() => navigate("/daily-entry")}
        >
          <h2>📝 Daily Entry</h2>
          <p>
            Maintain daily stock usage
          </p>
        </div>

        {/* ITEM LOOKUP */}
        <div
          className="dashboard-card"
          onClick={() => navigate("/item-lookup")}
        >
          <h2>🔍 Item Lookup</h2>
          <p>
            Search and view item details
          </p>
        </div>

        {/* REPORTS */}
        <div
          className="dashboard-card"
          onClick={() => navigate("/reports")}
        >
          <h2>📑 Reports</h2>
          <p>
            Generate reports and analytics
          </p>
        </div>

        {/* RECYCLE BIN */}
        <div
          className="dashboard-card"
          onClick={() => navigate("/bin")}
        >
          <h2>🗑️ Recycle Bin</h2>
          <p>
            View deleted items and restore them
          </p>
        </div>

      </div>

    </div>

  );

}

export default HomePage;
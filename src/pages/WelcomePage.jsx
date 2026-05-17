import { useNavigate } from "react-router-dom";
import "../../src/styles/WelcomePage.css";

function WelcomePage() {

  const navigate = useNavigate();

  return (

    <div className="welcome-container">

      <div className="overlay">

        <h1 className="main-title">
          🍽 Balaji Inn
        </h1>

        <p className="subtitle">
          Smart Restaurant Management System
        </p>

        <div className="card-container">

          {/* CUSTOMER CARD */}
          <div
            className="welcome-card"
            onClick={() => navigate("/customer-menu")}
          >

            <h2>🍔 Order Food</h2>

            <p>
              Scan menu and place your order instantly
            </p>

          </div>

          {/* ADMIN CARD */}
          <div
            className="welcome-card"
            onClick={() => navigate("/login")}
          >

            <h2>🔐 Admin Panel</h2>

            <p>
              Manage stock, orders and reports
            </p>

          </div>

        </div>

      </div>

    </div>

  );
}

export default WelcomePage;
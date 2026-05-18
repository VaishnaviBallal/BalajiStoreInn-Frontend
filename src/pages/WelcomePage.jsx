import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import "../../src/styles/WelcomePage.css";

import bg from "../assets/login-bg.jpg";

function WelcomePage() {

  const navigate = useNavigate();

  // CUSTOMER CLICK
  const handleCustomerClick = () => {

    toast.info(
      "📱 Please scan the QR code available on your table"
    );
  };

  return (

    <div
      className="welcome-container"
      style={{ backgroundImage: `url(${bg})` }}
    >

      <div className="overlay">

        {/* TITLE CARD */}
        <div className="balaji-card">

          <h1 className="main-title">
            🍽 Balaji Inn
          </h1>

          <p className="subtitle">
            Smart Restaurant Management System
          </p>

        </div>

        {/* CARDS */}
        <div className="card-container">

          {/* CUSTOMER CARD */}
          <div
            className="welcome-card"
            onClick={handleCustomerClick}
          >

            <h2>📱 Scan Table QR</h2>

            <p>
              Scan your table QR code to view menu & place order
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
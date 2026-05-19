import React, { useState, useEffect } from "react";
import "../styles/Dashboard.css";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // Load products
  const loadProducts = () => {
    fetch("https://balajirestaurant.onrender.com/products")
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadProducts();
    const interval = setInterval(loadProducts, 5000);
    return () => clearInterval(interval);
  }, []);

  // LIVE SEARCH FILTER (FIX)
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const lowStockItems = items.filter((item) => item.quantity < 10);

  return (
    <div className="dashboard">

      {/* HEADER */}
      <div className="dashHeader">
        <button className="backBtn" onClick={() => navigate("/home")}>
          🏠 Home
        </button>

        <h1>📊 Inventory Dashboard</h1>
      </div>

      {/* STATS */}
      <div className="statsGrid">

        <div className="statCard blue">
          <h3>Total Items</h3>
          <p>{items.length}</p>
        </div>

        <div className="statCard red">
          <h3>Low Stock</h3>
          <p>{lowStockItems.length}</p>
        </div>

        <div className="statCard green">
          <h3>Available</h3>
          <p>{items.length - lowStockItems.length}</p>
        </div>

      </div>

      {/* SEARCH */}
      <div className="searchBox">
        <input
          type="text"
          placeholder="🔍 Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="tableContainer">
        <h2>📦 Inventory List</h2>

        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Stock</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>

                  <td>
                    {item.quantity} {item.unit}
                  </td>

                  <td>
                    {item.quantity === 0 ? (
                      <span className="badge out">Out Of Stock</span>
                    ) : item.quantity < 10 ? (
                      <span className="badge low">Less Than 5</span>
                    ) : (
                      <span className="badge ok">Available</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: "center" }}>
                  No items found 😕
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
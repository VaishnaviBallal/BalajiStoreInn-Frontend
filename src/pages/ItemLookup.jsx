import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/ItemSearch.css";

function ItemLookup() {

  const navigate = useNavigate();

  const [search, setSearch] = useState("");   // ✅ FIX ADDED
  const [data, setData] = useState(null);

  const API = "http://localhost:8080/reports/item";

  const handleChange = async (e) => {
  const value = e.target.value;
  setSearch(value);

  if (!value.trim()) {
    setData(null);
    return;
  }

  try {
    const res = await axios.get(`${API}?name=${value}`);
    setData(res.data);
  } catch {
    setData(null);
  }
};


  const searchItem = async () => {


    if (!search.trim()) {
      alert("Please enter item name");
      return;
    }

    try {
      const res = await axios.get(`${API}?name=${search}`);
      setData(res.data);
    } catch (err) {
      if (err.response?.status === 404) {
        alert("Item not found");
      } else {
        alert("Server error");
      }
      setData(null);
    }
  };

  // ✅ ENTER KEY HANDLER
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      searchItem();
    }
  };

  return (
    <div className="page">

      {/* Back Button */}
      <button className="backBtn" onClick={() => navigate("/home")}>
        🏠 Home
      </button>

      <h2>Item Lookup</h2>

      {/* Search Box */}
      <div className="search-box">

        <input
          type="text"
          placeholder="Search item..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}   // ⭐ ENTER SUPPORT
        />

        <button onClick={searchItem}>Search</button>

      </div>

      {/* Result */}
      {data && (
        <div className="search-card">

          <h2 className="item-title">{data.itemName}</h2>

          <div className="grid">

            <div className="box">
              <span>Opening</span>
              <h3>{data.openingStock}</h3>
            </div>

            <div className="box">
              <span>Purchased</span>
              <h3>{data.purchased}</h3>
            </div>

            <div className="box">
              <span>Used</span>
              <h3>{data.used}</h3>
            </div>

            <div className="box">
              <span>Closing</span>
              <h3>{data.closingStock}</h3>
            </div>

            <div className="box money">
              <span>Purchase ₹</span>
              <h3>{data.purchaseAmount?.toFixed(2)}</h3>
            </div>

            <div className="box money">
              <span>Usage ₹</span>
              <h3>{data.usageAmount?.toFixed(2)}</h3>
            </div>

            <div className="box total">
              <span>Stock Value ₹</span>
              <h2>{data.stockValue?.toFixed(2)}</h2>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default ItemLookup;
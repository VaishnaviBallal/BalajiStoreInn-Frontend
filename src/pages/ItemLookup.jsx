import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/ItemSearch.css";

/* =========================
   FORMAT HELPERS
========================= */
const toNumber = (v) =>
  v === null || v === undefined ? 0 : Number(String(v).replace(/,/g, ""));

const format2 = (v) => toNumber(v).toFixed(2);

const formatMoney = (v) =>
  toNumber(v).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

function ItemLookup() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const [data, setData] = useState(null);
  const [history, setHistory] = useState([]);

  const [allItems, setAllItems] = useState([]);

  const SUMMARY_API = "https://balajirestaurant.onrender.com/reports/item";
  const DAYWISE_API = "https://balajirestaurant.onrender.com/item/daywise";
  const PDF_API = "https://balajirestaurant.onrender.com/item/daywise/pdf";

  /* =========================
     LOAD ALL ITEMS
  ========================= */
  useEffect(() => {http://
    axios
      .get("https://balajirestaurant.onrender.com/products")
      .then((res) => setAllItems(res.data || []))
      .catch(() => setAllItems([]));
  }, []);

  /* =========================
     LOCAL FILTER (NO API)
  ========================= */
  useEffect(() => {
    if (search.trim() === "") {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const filtered = allItems
      .map((i) => i.name)
      .filter((name) =>
        name.toLowerCase().includes(search.toLowerCase())
      );

    setSuggestions(filtered);

    const exactMatch = filtered.some(
      (name) => name.toLowerCase() === search.toLowerCase()
    );

    setShowDropdown(!exactMatch && filtered.length > 0);
  }, [search, allItems]);

  /* =========================
     SEARCH API
  ========================= */
  const searchItem = async (itemName) => {
    if (!itemName || !itemName.trim()) return;

    try {
      setShowDropdown(false);

      const [summaryRes, historyRes] = await Promise.all([
        axios.get(`${SUMMARY_API}?name=${itemName.trim()}`),
        axios.get(`${DAYWISE_API}?name=${itemName.trim()}`),
      ]);

      setData(summaryRes.data);
      setHistory(historyRes.data || []);
    } catch (err) {
      console.error(err);
      setData(null);
      setHistory([]);
      alert("Item not found");
    }
  };

  /* =========================
     ENTER KEY
  ========================= */
  const handleKeyDown = (e) => {
    if (e.key !== "Enter") return;
    searchItem(search);
  };

  /* =========================
     PDF DOWNLOAD
  ========================= */
  const downloadPdf = () => {
    if (!data) return;
    window.open(`${PDF_API}?name=${data.itemName}`, "_blank");
  };

  /* =========================
     TOTAL CALCULATION
  ========================= */
  const totals = history.reduce(
    (acc, r) => {
      acc.opening += Number(r.openingStock || 0);
      acc.purchased += Number(r.purchased || 0);
      acc.used += Number(r.used || 0);
      acc.closing += Number(r.closingStock || 0);
      acc.purchaseAmt += Number(r.purchaseAmount || 0);
      acc.usageAmt += Number(r.usageAmount || 0);
      acc.stockValue += Number(r.stockValue || 0);
      return acc;
    },
    {
      opening: 0,
      purchased: 0,
      used: 0,
      closing: 0,
      purchaseAmt: 0,
      usageAmt: 0,
      stockValue: 0,
    }
  );

  return (
    <div className="page">
      <button className="backBtn" onClick={() => navigate("/home")}>
        🏠 Home
      </button>

      <h2>Item Lookup</h2>

      {/* SEARCH */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Type item name..."
          value={search}
          autoComplete="off"
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button onClick={() => searchItem(search)}>Search</button>

        <button
          className="downloadBtn"
          onClick={downloadPdf}
          disabled={!data}
        >
          Download PDF
        </button>

        {/* DROPDOWN */}
        {showDropdown && suggestions.length > 0 && (
          <ul className="dropdown">
            {suggestions.map((item, idx) => (
              <li
                key={idx}
                onClick={() => {
                  setSearch(item);
                  setShowDropdown(false);
                  searchItem(item);
                }}
              >
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>

      {(data || history.length > 0) && (
        <div className="result-layout">

          {/* SUMMARY */}
          {data && (
            <div className="search-card">
              <h2 className="item-title">{data.itemName}</h2>

              <div className="grid">
                <div className="box">
                  <span>Opening</span>
                  <h3>{format2(data.openingStock)}</h3>
                </div>
                <div className="box">
                  <span>Purchased</span>
                  <h3>{format2(data.purchased)}</h3>
                </div>
                <div className="box">
                  <span>Used</span>
                  <h3>{format2(data.used)}</h3>
                </div>
                <div className="box">
                  <span>Closing</span>
                  <h3>{format2(data.closingStock)}</h3>
                </div>
                <div className="box money">
                  <span>Purchase ₹</span>
                  <h3>{formatMoney(data.purchaseAmount)}</h3>
                </div>
                <div className="box money">
                  <span>Usage ₹</span>
                  <h3>{formatMoney(data.usageAmount)}</h3>
                </div>
                <div className="box total">
                  <span>Stock Value ₹</span>
                  <h2>{formatMoney(data.stockValue)}</h2>
                </div>
              </div>
            </div>
          )}

          {/* TABLE */}
          {history.length > 0 && (
            <div className="history-table">
              <h2>Daywise Report</h2>

              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Opening</th>
                    <th>Purchased</th>
                    <th>Used</th>
                    <th>Closing</th>
                    <th>Purchase ₹</th>
                    <th>Usage ₹</th>
                    <th>Stock Value ₹</th>
                  </tr>
                </thead>

                <tbody>
                  {history.map((r, i) => (
                    <tr key={i}>
                      <td>{r.date}</td>
                      <td>{format2(r.openingStock)}</td>
                      <td>{format2(r.purchased)}</td>
                      <td>{format2(r.used)}</td>
                      <td>{format2(r.closingStock)}</td>
                      <td>₹ {formatMoney(r.purchaseAmount)}</td>
                      <td>₹ {formatMoney(r.usageAmount)}</td>
                      <td>₹ {formatMoney(r.stockValue)}</td>
                    </tr>
                  ))}

                  {/* TOTAL ROW */}
                  <tr style={{ fontWeight: "bold", background: "#e3f2fd" }}>
                    <td>TOTAL</td>
                    <td>{format2(totals.opening)}</td>
                    <td>{format2(totals.purchased)}</td>
                    <td>{format2(totals.used)}</td>
                    <td>{format2(totals.closing)}</td>
                    <td>₹ {formatMoney(totals.purchaseAmt)}</td>
                    <td>₹ {formatMoney(totals.usageAmt)}</td>
                    <td>₹ {formatMoney(totals.stockValue)}</td>
                  </tr>
                </tbody>

              </table>
            </div>
          )}

        </div>
      )}
    </div>
  );
}

export default ItemLookup;
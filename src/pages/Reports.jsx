import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Reports.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* =========================
   NUMBER FORMAT HELPERS
========================= */

const toNumber = (value) => {
  if (value === null || value === undefined) return 0;
  return Number(String(value).replace(/,/g, ""));
};

const format2 = (value) => {
  return toNumber(value).toFixed(2);
};

const formatMoney = (value) => {
  return toNumber(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const Reports = () => {
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  /* =========================
     FETCH REPORT
  ========================= */
  const fetchReport = async () => {
    if (!startDate || !endDate) {
      toast.warning("Please select both dates");
      return;
    }

    try {
      const response = await axios.get(
        `https://balajirestaurant.onrender.com/reports/items?start=${startDate}&end=${endDate}`
      );

      if (Array.isArray(response.data)) {
        setReports(response.data);

        if (response.data.length === 0) {
          toast.info("No data found for selected dates");
        } else {
          toast.success("Report generated successfully");
        }
      } else {
        setReports([]);
        toast.error("Invalid report data");
      }
    } catch (error) {
      console.error(error);
      setReports([]);
      toast.error("Error fetching report");
    }
  };

  /* =========================
     DOWNLOAD PDF
  ========================= */
  const downloadPdf = () => {
    if (!startDate || !endDate) {
      toast.warning("Please select both dates");
      return;
    }

    toast.success("Downloading PDF...");

    window.open(
      `http://balajirestaurant.onrender.com/items/pdf?start=${startDate}&end=${endDate}`,
      "_blank"
    );
  };

  /* =========================
     ENTER KEY SUPPORT
  ========================= */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        fetchReport();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [startDate, endDate]);

  /* =========================
     TOTAL CALCULATION ✅
  ========================= */
  const totals = reports.reduce(
    (acc, item) => {
      acc.opening += toNumber(item.openingStock);
      acc.purchased += toNumber(item.purchased);
      acc.used += toNumber(item.used);
      acc.closing += toNumber(item.closingStock);
      acc.purchaseAmt += toNumber(item.purchaseAmount);
      acc.usageAmt += toNumber(item.usageAmount);
      acc.stockValue += toNumber(item.stockValue);
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
    <div className="report-container">

      <button className="backBtn" onClick={() => navigate("/home")}>
        🏠 Home
      </button>

      <h2>Store Reports</h2>

      {/* DATE SELECTION */}
      <div className="date-selection">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <button className="generate-btn" onClick={fetchReport}>
          Generate Report
        </button>

        <button className="download-btn" onClick={downloadPdf}>
          Download PDF
        </button>
      </div>

      {/* TABLE */}
      <div className="report-table-container">
        <table className="report-table">

          <thead>
            <tr>
              <th>Date</th>
              <th>Item Name</th>
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
            {reports.map((item, index) => (
              <tr key={index}>
                <td>{new Date(item.date).toLocaleDateString()}</td>
                <td>{item.itemName}</td>

                <td>{format2(item.openingStock)}</td>
                <td>{format2(item.purchased)}</td>
                <td>{format2(item.used)}</td>
                <td>{format2(item.closingStock)}</td>

                <td>₹ {formatMoney(item.purchaseAmount)}</td>
                <td>₹ {formatMoney(item.usageAmount)}</td>
                <td>₹ {formatMoney(item.stockValue)}</td>
              </tr>
            ))}

            {/* ✅ TOTAL ROW */}
            {reports.length > 0 && (
              <tr style={{ fontWeight: "bold", background: "#e3f2fd" }}>
                <td colSpan="2">TOTAL</td>

                <td>{format2(totals.opening)}</td>
                <td>{format2(totals.purchased)}</td>
                <td>{format2(totals.used)}</td>
                <td>{format2(totals.closing)}</td>

                <td>₹ {formatMoney(totals.purchaseAmt)}</td>
                <td>₹ {formatMoney(totals.usageAmt)}</td>
                <td>₹ {formatMoney(totals.stockValue)}</td>
              </tr>
            )}

            {reports.length === 0 && (
              <tr>
                <td colSpan="9" style={{ textAlign: "center" }}>
                  No data available
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default Reports;
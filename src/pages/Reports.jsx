import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Reports.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Reports = () => {

  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const formatNumber = (value) => {
  return value ? Number(value).toFixed(2) : "0.00";
};

  // Fetch Report
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

        if(response.data.length === 0){
          toast.info("No data found for selected dates");
        }else{
          toast.success("Report generated successfully");
        }

      } else {

        setReports([]);
        toast.error("Invalid report data");

      }

    } catch (error) {

      console.error("Error fetching report:", error);
      setReports([]);
      toast.error("Error fetching report");

    }

  };

  // Download PDF
  const downloadPdf = () => {

    if (!startDate || !endDate) {
      toast.warning("Please select both dates");
      return;
    }

    toast.success("Downloading PDF...");

    window.open(
  `https://balajirestaurant.onrender.com/reports/items/pdf?start=${startDate}&end=${endDate}`
);

  };

  return (

    <div className="report-container">

      {/* Home Button */}
      <button
        className="backBtn"
        onClick={() => navigate("/home")}
      >
        🏠 Home
      </button>

      <h2>Store Reports</h2>

      {/* Date Selection */}
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

        <button
          className="generate-btn"
          onClick={fetchReport}
        >
          Generate Report
        </button>

        <button
          className="download-btn"
          onClick={downloadPdf}
        >
          Download PDF
        </button>

      </div>

      {/* Table Container */}
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

            {reports.map((item,index)=>(

              <tr key={index}>
                <td>{item.itemName}</td>
                <td>{item.openingStock}</td>
                <td>{item.purchased}</td>
                <td>{item.used}</td>
                <td>{item.closingStock}</td>
                <td>{formatNumber(item.purchaseAmount)}</td>
<td>{formatNumber(item.usageAmount)}</td>
<td>{formatNumber(item.stockValue)}</td>
              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
      />

    </div>

  );

};

export default Reports;
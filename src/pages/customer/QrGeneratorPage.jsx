import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "../../styles/QrGenerator.css";

function QRGeneratorPage() {
  const [tables, setTables] = useState(10);

  const baseUrl = "https://balajirestaurant.onrender.com/customer-menu";

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="qrContainer">

      <h1>🍽 Table QR Code Generator</h1>

      <div className="controlBox">
        <label>Number of Tables:</label>

        <input
          type="number"
          value={tables}
          min="1"
          max="100"
          onChange={(e) => setTables(e.target.value)}
        />

        <button onClick={handlePrint}>
          🖨 Print / Download
        </button>
      </div>

      <div className="qrGrid">
        {Array.from({ length: tables }, (_, i) => i + 1).map((table) => (
          <div className="qrCard" key={table}>
            <h3>Table {table}</h3>

            <QRCodeCanvas
              value={`${baseUrl}/${table}`}
              size={150}
            />

            <p>{`${baseUrl}/${table}`}</p>
          </div>
        ))}
      </div>

    </div>
  );
}

export default QRGeneratorPage;
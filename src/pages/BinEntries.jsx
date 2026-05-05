import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/BinEntries.css";

function BinEntries() {
 const navigate = useNavigate();
  const [binItems, setBinItems] = useState([]);

  const API = "http://balajirestaurant.onrender.com/entries/bin";

  useEffect(() => {
    loadBin();
  }, []);

  const loadBin = async () => {
    const res = await axios.get(API);
    setBinItems(res.data);
  };
  const deletePermanent = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure? This will permanently delete the entry."
  );

  if (!confirmDelete) return;

  await axios.delete(
    `http://balajirestaurant.onrender.com/entries/permanent/${id}`
  );

  loadBin();
};

  const restoreItem = async (id) => {
    await axios.put(`http://balajirestaurant.onrender.com/entries/restore/${id}`);
    loadBin();
  };

  return (
    <div className="bin-page">

      <h2 className="bin-title">🗑️ Recycle Bin</h2>
       <button className="backBtn" onClick={() => navigate("/home")}>
        🏠 Home
      </button>

      <table className="bin-table">

        <thead>
          <tr>
            <th>Date</th>
            <th>Item</th>
            <th>Type</th>
            <th>Qty</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {binItems.length === 0 ? (
            <tr>
              <td colSpan="5" className="empty-bin">
                No deleted items found
              </td>
            </tr>
          ) : (
            binItems.map(e => (
              <tr key={e.id}>
                <td>{e.entryTime}</td>
                <td>{e.itemName}</td>
                <td>{e.type}</td>
                <td>{e.quantity}</td>

                <td>
                  <button
                    className="restore-btn"
                    onClick={() => restoreItem(e.id)}
                  >
                    Restore ♻️
                  </button>
                  <button className="deleteBtn" onClick={() => deletePermanent(e.id)}>
    Delete Permanently❌
  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>

      </table>

    </div>
  );
}

export default BinEntries;
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/BinEntries.css";

function BinEntries() {
  const navigate = useNavigate();
  const [binItems, setBinItems] = useState([]);

  const API = "https://balajirestaurant.onrender.com/entries/bin";

  useEffect(() => {
    loadBin();
  }, []);

  const loadBin = async () => {
    try {
      const res = await axios.get(API);
      setBinItems(res.data);
    } catch (err) {
      console.error("Load bin error:", err);
    }
  };

  // ================= RESTORE (TOAST CONFIRM) =================
  const restoreItem = (id) => {
    toast((t) => (
      <div className="toastBox">
        <p>♻️ Restore this item?</p>

        <div className="toastButtons">
          <button
            className="yesBtn"
            onClick={async () => {
              try {
                await axios.put(
                  `https://balajirestaurant.onrender.com/entries/restore/${id}`
                );

                toast.dismiss(t.id);
                toast.success("Item restored");

                loadBin();
              } catch (err) {
                toast.error("Restore failed");
              }
            }}
          >
            Yes
          </button>

          <button
            className="noBtn"
            onClick={() => toast.dismiss(t.id)}
          >
            No
          </button>
        </div>
      </div>
    ), {
      closeOnClick: false,
      autoClose: false
    });
  };

  // ================= DELETE PERMANENT (TOAST CONFIRM) =================
  const deletePermanent = (id) => {
    toast((t) => (
      <div className="toastBox">
        <p>⚠️ Delete permanently?</p>

        <div className="toastButtons">
          <button
            className="yesBtn"
            onClick={async () => {
              try {
                await axios.delete(
                  `https://balajirestaurant.onrender.com/entries/permanent/${id}`
                );

                toast.dismiss(t.id);
                toast.success("Deleted permanently");

                loadBin();
              } catch (err) {
                toast.error("Delete failed");
              }
            }}
          >
            Yes
          </button>

          <button
            className="noBtn"
            onClick={() => toast.dismiss(t.id)}
          >
            No
          </button>
        </div>
      </div>
    ), {
      closeOnClick: false,
      autoClose: false
    });
  };

  return (
    <div className="bin-page">

      <h2 className="bin-title">🗑️ Recycle Bin</h2>

      <button className="backBtn" onClick={() => navigate("/home")}>
        🏠 Home
      </button>

      {/* TABLE WRAPPER FOR MOBILE */}
      <div className="tableWrapper">

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
              binItems.map((e) => (
                <tr key={e.id}>
                  <td>{e.entryTime}</td>
                  <td>{e.itemName}</td>
                  <td>{e.type}</td>
                  <td>{e.quantity}</td>

                  <td className="actionCell">

                    <button
                      className="restore-btn"
                      onClick={() => restoreItem(e.id)}
                    >
                      Restore ♻️
                    </button>

                    <button
                      className="deleteBtn"
                      onClick={() => deletePermanent(e.id)}
                    >
                      Delete ❌
                    </button>

                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>

      </div>

    </div>
  );
}

export default BinEntries;
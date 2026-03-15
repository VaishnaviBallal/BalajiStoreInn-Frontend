import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { showSuccess, showError, showInfo } from "../utils/Toast";

function DailyEntry({ items }) {

  const navigate = useNavigate();

  const [entries, setEntries] = useState([]);
  const [date, setDate] = useState("");
  const [item, setItem] = useState("");
  const [type, setType] = useState("");
  const [qty, setQty] = useState("");
  const [editId, setEditId] = useState(null);

  const API_URL = "http://localhost:8080/entries";

  // Load entries
  useEffect(() => {

    axios.get(API_URL)
      .then(res => setEntries(res.data))
      .catch(err => {
        console.error(err);
        showError("Failed to load entries");
      });

  }, []);

  const saveEntry = async () => {

    if (!date || !item || !type || !qty) {
      showError("Please fill all fields");
      return;
    }

    const entry = {
      itemName: item,
      type: type,
      quantity: Number(qty)
    };

    try {

      if (editId) {

        await axios.put(`${API_URL}/${editId}`, entry);
        showSuccess("Entry updated successfully");

      } else {

        await axios.post(API_URL, entry);
        showSuccess("Entry saved successfully");

      }

      const res = await axios.get(API_URL);
      setEntries(res.data);

      setDate("");
      setItem("");
      setType("");
      setQty("");
      setEditId(null);

    } catch (error) {

      console.error(error);
      showError("Error saving entry");

    }

  };

  // DELETE ENTRY
  const deleteEntry = async (id) => {

    if (!window.confirm("Are you sure you want to delete this entry?")) {
      return;
    }

    try {

      await axios.delete(`${API_URL}/${id}`);
      setEntries(entries.filter(e => e.id !== id));

      showSuccess("Entry deleted successfully");

    } catch (error) {

      console.error(error);
      showError("Error deleting entry");

    }

  };

  // EDIT ENTRY
  const editEntry = (entry) => {

    setItem(entry.itemName);
    setType(entry.type);
    setQty(entry.quantity);
    setEditId(entry.id);

    showInfo("Editing entry");

  };

  return (

    <div className="page">

      {/* Home Button */}
      <button
        className="backBtn"
        onClick={() => navigate("/home")}
      >
        🏠 Home
      </button>

      <h2>Daily Entry</h2>

      <div className="form-box">

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <select
          value={item}
          onChange={(e) => setItem(e.target.value)}
        >

          <option value="">Select Item</option>

          {items.map((i) => (

            <option key={i.id} value={i.name}>
              {i.name}
            </option>

          ))}

        </select>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
        >

          <option value="">Select Type</option>
          <option value="purchase">Purchase</option>
          <option value="usage">Usage</option>

        </select>

        <input
          type="number"
          placeholder="Quantity"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
        />

        <button className="button" onClick={saveEntry}>
          {editId ? "Update Entry" : "Save"}
        </button>

      </div>

      <h3>Daily Records</h3>

      <div className="table-container">

        <table className="table">

          <thead>

            <tr>
              <th>Date</th>
              <th>Item</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>

          </thead>

          <tbody>

            {entries.map((e) => (

              <tr key={e.id}>

                <td>{e.entryTime}</td>

                <td>{e.itemName}</td>

                <td
                  style={{
                    color: e.type === "purchase" ? "green" : "red",
                    fontWeight: "bold"
                  }}
                >
                  {e.type}
                </td>

                <td>{e.quantity}</td>

                <td>
                  <button
                    className="edit-btn"
                    onClick={() => editEntry(e)}
                  >
                    Edit
                  </button>
                </td>

                <td>
                  <button
                    className="delete-btn"
                    onClick={() => deleteEntry(e.id)}
                  >
                    Delete
                  </button>
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );
}

export default DailyEntry;
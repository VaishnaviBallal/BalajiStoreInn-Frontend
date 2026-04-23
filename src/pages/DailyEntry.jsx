import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Select from "react-select";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function DailyEntry() {

  const navigate = useNavigate();

  const [entries, setEntries] = useState([]);
  const [items, setItems] = useState([]);

  const [date, setDate] = useState("");
  const [item, setItem] = useState("");
  const [type, setType] = useState("");
  const [qty, setQty] = useState("");
  const [price, setPrice] = useState("");
  const [editId, setEditId] = useState(null);

  const ENTRY_API = "https://balajirestaurant.onrender.com/entries";
  const ITEM_API = "https://balajirestaurant.onrender.com/products";

  const itemOptions = items.map(i => ({
    value: i.name,
    label: i.name
  }));

  useEffect(() => {
    loadEntries();
    loadItems();
  }, []);

  useEffect(() => {
    if (date) loadEntries();
  }, [date]);

  const loadEntries = async () => {
    try {
      if (!date) return;
      const res = await axios.get(`${ENTRY_API}/by-date?date=${date}`);
      setEntries(res.data);
    } catch (error) {
      toast.error("Error loading entries");
    }
  };

  const loadAllEntries = async () => {
    try {
      const res = await axios.get(`${ENTRY_API}/all`);
      setEntries(res.data);
    } catch (error) {
      toast.error("Error loading all entries");
    }
  };

  const loadItems = async () => {
    try {
      const res = await axios.get(ITEM_API);
      setItems(res.data);
    } catch (error) {
      toast.error("Error loading items");
    }
  };

  const saveEntry = async () => {

    if (!date || !item || !type || !qty || (type === "purchase" && !price)) {
      toast.warning("Please fill all fields");
      return;
    }

    const entry = {
      itemName: item,
      type,
      quantity: Number(qty),
      price: type === "purchase" ? Number(price) : 0,
      entryTime: date
    };

    try {
      if (editId) {
        await axios.put(`${ENTRY_API}/${editId}`, entry);
        toast.success("Entry updated");
      } else {
        await axios.post(ENTRY_API, entry);
        toast.success("Entry saved");
      }

      loadEntries();

      setItem("");
      setType("");
      setQty("");
      setPrice("");
      setEditId(null);

    } catch (error) {
      toast.error("Error saving entry");
    }
  };

  const deleteEntry = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await axios.delete(`${ENTRY_API}/${id}`);
      setEntries(entries.filter(e => e.id !== id));
      toast.success("Deleted");
    } catch (error) {
      toast.error("Error deleting");
    }
  };

  const editEntry = (entry) => {
    setItem(entry.itemName);
    setDate(entry.entryTime);
    setType(entry.type);
    setQty(entry.quantity);
    setPrice(entry.price);
    setEditId(entry.id);
  };

  const formatPrice = (value) => {
    return value ? Number(value).toFixed(2) : "0.00";
  };

  return (
    <div className="page">

      <button className="backBtn" onClick={() => navigate("/home")}>
        🏠 Home
      </button>

      <h2>Daily Entry</h2>

      <div className="form-box">

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        {/* ✅ FIXED DROPDOWN WRAPPED IN DIV */}
       <div className="item-select">
  <Select
    options={itemOptions}
    value={itemOptions.find(o => o.value === item) || null}
    onChange={(selected) => setItem(selected?.value || "")}
    placeholder="Select Item"
    isClearable
  />
</div>
        <select value={type} onChange={(e) => setType(e.target.value)}>
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

        {type === "purchase" && (
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        )}

        <button className="button" onClick={saveEntry}>
          {editId ? "Update Entry" : "Save"}
        </button>

        <button onClick={loadAllEntries} className="button">
          Show All Entries
        </button>

      </div>

      <h3>Daily Records</h3>

      <table className="table">

        <thead>
          <tr>
            <th>Date</th>
            <th>Item</th>
            <th>Type</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>

        <tbody>
          {entries.map(e => (
            <tr key={e.id}>
              <td>{e.entryTime}</td>
              <td>{e.itemName}</td>
              <td>{e.type}</td>
              <td>{e.quantity}</td>
              <td>₹ {formatPrice(e.price)}</td>
              <td>₹ {formatPrice(e.totalPrice)}</td>

              <td>
                <button className="edit-btn" onClick={() => editEntry(e)}>Edit</button>
              </td>

              <td>
                <button className="delete-btn" onClick={() => deleteEntry(e.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>

      <ToastContainer position="top-right" autoClose={2000} />

    </div>
  );
}

export default DailyEntry;
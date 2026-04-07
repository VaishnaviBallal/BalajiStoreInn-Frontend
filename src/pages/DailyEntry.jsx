import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
  const [editId, setEditId] = useState(null);
  const [price, setPrice] = useState("");
  const formatPrice = (value) => {
  return value ? Number(value).toFixed(2) : "0.00";
};

  const ENTRY_API = "https://balajirestaurant.onrender.com/entries";
  const ITEM_API = "https://balajirestaurant.onrender.com/products";

  
  useEffect(() => {
  loadEntries();
  loadItems();
}, []);

  // 🔥 NEW: Load entries when date changes
useEffect(() => {
  if (date) {
    loadEntries();
  }
}, [date]);

  // Load daily entries
 const loadEntries = async () => {
  try {
    if (!date) return; // 🔥 prevent empty call

    const res = await axios.get(`${ENTRY_API}/by-date?date=${date}`);
    setEntries(res.data);
  } catch (error) {
    console.log(error);
    toast.error("Error loading entries");
  }
};

const loadAllEntries = async () => {
  try {
    const res = await axios.get(`${ENTRY_API}/all`);
    setEntries(res.data);
  } catch (error) {
    console.log(error);
    toast.error("Error loading all entries");
  }
};
  

  // Load items
  const loadItems = async () => {

    try {

      const res = await axios.get(ITEM_API);
      setItems(res.data);

    } catch (error) {

      console.log(error);
      toast.error("Error loading items");

    }

  };

  // Save entry
  const saveEntry = async () => {

  if (!date || !item || !type || !qty || (type === "purchase" && !price)) {
  toast.warning("Please fill all fields");
  return;
}

  const entry = {
  itemName: item,
  type: type,
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

      loadEntries(); // reload same selected date
      setItem("");
      setType("");
      setQty("");
      setEditId(null);
      setPrice("");

    } catch (error) {

      console.error(error);
      toast.error("Error saving entry");

    }

  };

  // Delete entry
  const deleteEntry = async (id) => {

    if (!window.confirm("Are you sure you want to delete this entry?")) return;

    try {

      await axios.delete(`${ENTRY_API}/${id}`);

      setEntries(entries.filter(e => e.id !== id));

      toast.success("Entry deleted");

    } catch (error) {

      console.error(error);
      toast.error("Error deleting entry");

    }

  };

  // Edit entry
  const editEntry = (entry) => {

    setItem(entry.itemName);
    setType(entry.type);
    setQty(entry.quantity);
     setPrice(Number(entry.price).toFixed(2)); 
    setEditId(entry.id);

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

      {/* Form */}
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

          <option value="" disabled>
            Select Item
          </option>

          {items.length > 0 ? (
            items.map((i) => (
              <option key={i.id} value={i.name}>
                {i.name}
              </option>
            ))
          ) : (
            <option disabled>Loading items...</option>
          )}

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
  step="0.01"
  placeholder="Quantity"
  value={qty}
  onChange={(e) => setQty(e.target.value)}
/>

        {type === "purchase" && (
  <input
    type="number"
    placeholder="Price per unit"
    value={price}
    onChange={(e) => setPrice(e.target.value)}
  />
)}

        <button
          className="button"
          onClick={saveEntry}
        >
          {editId ? "Update Entry" : "Save"}
        </button>
<button onClick={loadAllEntries} className="button">
  Show All Entries
</button>
      </div>

      <h3>Daily Records</h3>

      {/* Table */}
      <div className="table-container">

        <table className="table">

          <thead>
            <tr>
              <th>Date</th>
              <th>Item</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Price</th>
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
<td>₹ {formatPrice(e.price)}</td>
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

      <ToastContainer position="top-right" autoClose={2000} />

    </div>

  );

}

export default DailyEntry;
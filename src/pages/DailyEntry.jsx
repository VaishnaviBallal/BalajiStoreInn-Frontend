import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Select from "react-select";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

function DailyEntry() {

  const navigate = useNavigate();

  const [entries, setEntries] = useState([]);
  const [items, setItems] = useState([]);

  const [date, setDate] = useState("");
  const [item, setItem] = useState("");
  const [productId, setProductId] = useState("");
  const [type, setType] = useState("");
  const [qty, setQty] = useState("");
  const [price, setPrice] = useState("");
  const [editId, setEditId] = useState(null);

  const ENTRY_API = "http://localhost:8080/entries";
  const ITEM_API = "http://localhost:8080/products";

  const itemOptions = items.map(i => ({
    value: i.id,
    label: i.name
  }));

  useEffect(() => {
    loadItems();
    loadAllEntries();
  }, []);

  useEffect(() => {
    if (date) loadEntriesByDate();
    else loadAllEntries();
  }, [date]);

  const loadEntriesByDate = async () => {
    try {
      const res = await axios.get(`${ENTRY_API}/by-date?date=${date}`);
      setEntries(res.data);
    } catch {
      toast.error("Error loading entries");
    }
  };

  const loadAllEntries = async () => {
    try {
      const res = await axios.get(`${ENTRY_API}/all`);
      setEntries(res.data);
    } catch {
      toast.error("Error loading all entries");
    }
  };

  const loadItems = async () => {
    try {
      const res = await axios.get(ITEM_API);
      setItems(res.data);
    } catch {
      toast.error("Error loading items");
    }
  };

  const formatPrice = (value) =>
    value ? Number(value).toFixed(2) : "0.00";

  // ================= SAVE ENTRY (FIXED LOGIC) =================
  const saveEntry = async () => {

    if (!date || !item || !productId || !type || !qty || (type === "purchase" && !price)) {
      toast.warning("Please fill all fields");
      return;
    }

    try {

      const qtyNum = Number(qty);

      // GET PRODUCT
      const res = await axios.get(`${ITEM_API}/${productId}`);
      const product = res.data;

      let updatedStock = Number(product.quantity || 0);

      // STOCK LOGIC
      if (type === "usage") {
        if (qtyNum > updatedStock) {
          toast.error(`Insufficient Stock. Available: ${updatedStock}`);
          return;
        }
        updatedStock -= qtyNum;
      }

      if (type === "purchase") {
        updatedStock += qtyNum;
      }

      // ENTRY OBJECT (NO CSS CHANGE NEEDED)
      const entry = {
        productId,
        itemName: item,
        type,
        quantity: qtyNum,
        price: type === "purchase" ? Number(price) : 0,
        entryTime: date
      };

      if (editId) {
        await axios.put(`${ENTRY_API}/${editId}`, entry);
        toast.success("Entry updated");
      } else {
        await axios.post(ENTRY_API, entry);
        toast.success("Entry saved");
      }

      // UPDATE PRODUCT STOCK
      await axios.put(`${ITEM_API}/${productId}`, {
        ...product,
        quantity: updatedStock
      });

      // REFRESH UI
      loadItems();
      loadAllEntries();

      // RESET
      setItem("");
      setProductId("");
      setType("");
      setQty("");
      setPrice("");
      setEditId(null);

    } catch (err) {
      console.error(err);
      toast.error("Error saving entry");
    }
  };

  // ================= DELETE =================
  const deleteEntry = async (id) => {

    const entryToDelete = entries.find(e => e.id === id);

    if (!entryToDelete) {
      toast.error("Entry not found");
      return;
    }

    confirmAlert({
      title: "Confirm Delete",
      message: `
Date : ${entryToDelete.entryTime}
Item : ${entryToDelete.itemName}
Type : ${entryToDelete.type}
Quantity : ${entryToDelete.quantity}
Price : ₹ ${formatPrice(entryToDelete.price)}
      `,
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              await axios.delete(`${ENTRY_API}/${id}`);
              setEntries(entries.filter(e => e.id !== id));
              toast.success("Deleted successfully");
            } catch {
              toast.error("Error deleting entry");
            }
          }
        },
        { label: "No" }
      ]
    });
  };

  // ================= EDIT =================
  const editEntry = (entry) => {
    setItem(entry.itemName);
    setProductId(entry.productId);
    setDate(entry.entryTime);
    setType(entry.type);
    setQty(entry.quantity);
    setPrice(entry.price);
    setEditId(entry.id);
    toast.info("Editing entry");
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

        <Select
          options={itemOptions}
          value={itemOptions.find(o => o.value === productId) || null}
          onChange={(selected) => {
            setProductId(selected?.value || "");
            setItem(selected?.label || "");
          }}
          placeholder="Select Item"
          isClearable
        />

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

              <td>
                <button className="edit-btn" onClick={() => editEntry(e)}>
                  Edit
                </button>
              </td>

              <td>
                <button className="delete-btn" onClick={() => deleteEntry(e.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>


    </div>
  );
}

export default DailyEntry;
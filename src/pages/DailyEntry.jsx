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

  const ENTRY_API = "https://balajirestaurant.onrender.com/entries";
  const ITEM_API = "https://balajirestaurant.onrender.com/products";

  const itemOptions = items.map(i => ({
    value: i.id,
    label: i.name
  }));

  // LOAD DATA
  useEffect(() => {
    loadItems();
    loadAllEntries();
  }, []);

  // FILTER BY DATE
  useEffect(() => {
    if (date) {
      loadEntriesByDate();
    } else {
      loadAllEntries();
    }
  }, [date]);

  // LOAD ENTRIES BY DATE
  const loadEntriesByDate = async () => {

    try {

      const res = await axios.get(
        `${ENTRY_API}/by-date?date=${date}`
      );

      setEntries(res.data);

    } catch (error) {

      toast.error("Error loading entries");

    }

  };

  // LOAD ALL ENTRIES
  const loadAllEntries = async () => {

    try {

      const res = await axios.get(`${ENTRY_API}/all`);

      setEntries(res.data);

    } catch (error) {

      toast.error("Error loading all entries");

    }

  };

  // LOAD ITEMS
  const loadItems = async () => {

    try {

      const res = await axios.get(ITEM_API);

      setItems(res.data);

    } catch (error) {

      toast.error("Error loading items");

    }

  };

  // SAVE ENTRY
  const saveEntry = async () => {

    if (
      !date ||
      !item ||
      !productId ||
      !type ||
      !qty ||
      (type === "purchase" && !price)
    ) {
      toast.warning("Please fill all fields");
      return;
    }

    const entry = {

      productId: productId,

      itemName: item,

      type: type,

      quantity: Number(qty),

      price:
        type === "purchase"
          ? Number(price)
          : 0,

      entryTime: date

    };

    try {

      // UPDATE
      if (editId) {

        await axios.put(`${ENTRY_API}/${editId}`, entry);

        toast.success("Entry updated");

      }

      // SAVE
      else {

        await axios.post(ENTRY_API, entry);

        toast.success("Entry saved");

      }

      loadEntriesByDate();

      setItem("");
      setProductId("");
      setType("");
      setQty("");
      setPrice("");
      setEditId(null);

    } catch (error) {

      toast.error("Error saving entry");

    }

  };

  // DELETE ENTRY
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

Total : ₹ ${formatPrice(entryToDelete.totalPrice)}
      `,

      buttons: [

        {
          label: "Yes",

          onClick: async () => {

            try {

              await axios.delete(`${ENTRY_API}/${id}`);

              setEntries(entries.filter(e => e.id !== id));

              toast.success("Deleted successfully");

            } catch (error) {

              toast.error("Error deleting entry");

            }

          }
        },

        {
          label: "No"
        }

      ]

    });

  };

  // EDIT ENTRY
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

  // FORMAT PRICE
  const formatPrice = (value) => {
    return value ? Number(value).toFixed(2) : "0.00";
  };

  return (

    <div className="page">

      <button
        className="backBtn"
        onClick={() => navigate("/home")}
      >
        🏠 Home
      </button>

      <h2>Daily Entry</h2>

      <div className="form-box">

        {/* DATE */}
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        {/* ITEM DROPDOWN */}
        <div className="item-select">

          <Select
            options={itemOptions}
            value={
              itemOptions.find(o => o.value === productId) || null
            }
            onChange={(selected) => {

              setProductId(selected?.value || "");

              setItem(selected?.label || "");

            }}
            placeholder="Select Item"
            isClearable
          />

        </div>

        {/* TYPE */}
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">Select Type</option>
          <option value="purchase">Purchase</option>
          <option value="usage">Usage</option>
        </select>

        {/* QUANTITY */}
        <input
          type="number"
          placeholder="Quantity"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
        />

        {/* PRICE */}
        {type === "purchase" && (

          <input
            type="number"
            placeholder="Price"
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

        <button
          onClick={loadAllEntries}
          className="button"
        >
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

      <ToastContainer
        position="top-right"
        autoClose={2000}
      />

    </div>

  );

}

export default DailyEntry;
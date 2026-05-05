import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { showSuccess, showError, showInfo } from "../utils/Toast";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

function ItemsEntry({ items, setItems }) {

  const [itemName, setItemName] = useState("");
  const [unit, setUnit] = useState("");
  const [qty, setQty] = useState("");
  const [editId, setEditId] = useState(null);
  const [price, setPrice] = useState("");

  const [filteredItems, setFilteredItems] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const navigate = useNavigate();

  const API_URL = "https://balajirestaurant.onrender.com/products";

  const formatPrice = (value) => {
    return value ? Number(value).toFixed(2) : "0.00";
  };

  useEffect(() => {

  const handleKeyDown = (e) => {

    if (e.key === "Enter") {
      addItem();   // 🔥 triggers save/update
    }

  };

  window.addEventListener("keydown", handleKeyDown);

  return () => {
    window.removeEventListener("keydown", handleKeyDown);
  };

}, [itemName, unit, qty, price, editId]);

  // 🔹 Load items
  useEffect(() => {
    axios.get(API_URL)
      .then(res => setItems(res.data))
      .catch(err => {
        console.error(err);
         toast.error("Failed to load items");
      });
  }, [setItems]);

  // 🔹 ADD / UPDATE
  const addItem = () => {

    if (itemName.trim() === "" || unit === "" || qty === "" || price === "") {
      showError("Please fill all fields");
      return;
    }

    const trimmedName = itemName.trim().toLowerCase();

    // 🔥 CHECK DUPLICATE
    const exists = items.find(
      (item) =>
        item.name.trim().toLowerCase() === trimmedName &&
        item.id !== editId   // 👈 IMPORTANT: allow same item when editing
    );

    if (exists) {
       toast.error("Item already exists");
      return;
    }

    const itemData = {
      name: itemName.trim(),
      unit: unit,
      quantity: Number(qty),
      price: Number(price)
    };

    // ✏️ UPDATE
    if (editId) {
      axios.put(`${API_URL}/${editId}`, itemData)
        .then(res => {

          const updated = items.map(item =>
            item.id === editId ? res.data : item
          );

          setItems(updated);

           toast.success("Item updated successfully");

          resetForm();

        })
        .catch(err => {
          console.error(err);
           toast.error("Error updating item");
        });
    }

    // ➕ ADD
    else {
      axios.post(API_URL, itemData)
        .then(res => {

          setItems([...items, res.data]);

           toast.success("Item added successfully");

          resetForm();

        })
        .catch(err => {
          console.error(err);
           toast.error("Error adding item");
        });
    }
  };

  // 🔹 RESET FORM
  const resetForm = () => {
    setItemName("");
    setUnit("");
    setQty("");
    setPrice("");
    setEditId(null);
  };

  // 🔹 DELETE
  const deleteItem = (id) => {

    if (!window.confirm("Are you sure you want to delete this item?")) return;

    axios.delete(`${API_URL}/${id}`)
      .then(() => {
        setItems(items.filter(item => item.id !== id));
         toast.success("Item deleted successfully");
      })
      .catch(err => {
        console.error(err);
         toast.error("Error deleting item");
      });
  };

  // 🔹 EDIT BUTTON
  const editItem = (item) => {
    setItemName(item.name);
    setUnit(item.unit);
    setQty(item.quantity);
    setPrice(Number(item.price).toFixed(2));
    setEditId(item.id);

     toast.info("Editing item");
  };

  return (

    <div className="page">

      <button className="backBtn" onClick={() => navigate("/home")}>
        🏠 Home
      </button>

      <h2>Items Entry</h2>
      {/* Toast Container */}
   <ToastContainer
     position="top-right"
     autoClose={2000}
   />

      <div className="form-box">

        {/* 🔍 SEARCH */}
        <div style={{ position: "relative" }}>

          <input
            type="text"
            placeholder="Enter or search item..."
            value={itemName}
            onChange={(e) => {

              const value = e.target.value;
              setItemName(value);

              if (value.trim() === "") {
                setFilteredItems([]);
                setShowSuggestions(false);
                return;
              }

              const filtered = items.filter(i =>
                i.name.toLowerCase().includes(value.toLowerCase())
              );

              setFilteredItems(filtered);
              setShowSuggestions(true);
            }}
            onFocus={() => {
              if (itemName) setShowSuggestions(true);
            }}
            onBlur={() => {
              setTimeout(() => setShowSuggestions(false), 200);
            }}
          />

          {/* Suggestions */}
          {showSuggestions && filteredItems.length > 0 && (
            <div className="suggestions-box">
              {filteredItems.map((i) => (
                <div
                  key={i.id}
                  className="suggestion-item"
                  onClick={() => {

                    setItemName(i.name);
                    setUnit(i.unit);
                    setQty(i.quantity);
                    setPrice(i.price);
                    setEditId(i.id);

                    setShowSuggestions(false);

                    toast.info("Item already exists. Loaded for update.");
                  }}
                >
                  {i.name}
                </div>
              ))}

            </div>
          )}

        </div>

        {/* UNIT */}
        <select value={unit} onChange={(e) => setUnit(e.target.value)}>
          <option value="">Select Unit</option>
          <option>KG</option>
          <option>Litre</option>
          <option>Gram</option>
          <option>Nos</option>
           <option>Bottle</option>
            <option>Packet</option>
        </select>

        {/* QTY */}
        <input
          type="number"
          step="any"
          min="0"
          placeholder="Opening Qty"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
        />

        {/* PRICE */}
        <input
          type="number"
          placeholder="Price per unit"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <button className="button" onClick={addItem}>
          {editId ? "Update Item" : "Add Item"}
        </button>

      </div>

      <h3>Items List</h3>

      <div className="table-container">

        <table className="table">

          <thead>
            <tr>
              <th>Date</th>
              <th>Item</th>
              <th>Unit</th>
              <th>Opening Qty</th>
              <th>Price</th>
              <th>Total Price</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>

          <tbody>

            {items.map((item) => (

              <tr key={item.id}>
                <td>{item.createdDate}</td>
                <td>{item.name}</td>
                <td>{item.unit}</td>
                <td>{item.quantity}</td>
                <td>{formatPrice(item.price)}</td>
                <td>{formatPrice(item.quantity * item.price)}</td>

                <td>
                  <button
                    className="edit-btn"
                    onClick={() => editItem(item)}
                  >
                    Edit
                  </button>
                </td>

                <td>
                  <button
                    className="delete-btn"
                    onClick={() => deleteItem(item.id)}
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


export default ItemsEntry;
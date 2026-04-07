import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { showSuccess, showError, showInfo } from "../utils/Toast";

function ItemsEntry({ items, setItems }) {

  const [itemName, setItemName] = useState("");
  const [unit, setUnit] = useState("");
  const [qty, setQty] = useState("");
  const [editId, setEditId] = useState(null);
  const [price, setPrice] = useState("");
  const formatPrice = (value) => {
  return value ? Number(value).toFixed(2) : "0.00";
};

  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
const [showSuggestions, setShowSuggestions] = useState(false);

  const API_URL =  "https://balajirestaurant.onrender.com/products";

  // Load items
  useEffect(() => {

    axios.get(API_URL)
      .then(res => {
        setItems(res.data);
      })
      .catch(err => {
        console.error(err);
        showError("Failed to load items");
      });

  }, [setItems]);

  // ADD OR UPDATE
  const addItem = () => {

   if (itemName === "" || unit === "" || qty === "" || price === "") {
  showError("Please fill all fields");
  return;
}

   const itemData = {
  name: itemName,
  unit: unit,
  quantity: Number(qty),
  price: Number(price)
};

    if (editId) {

      axios.put(`${API_URL}/${editId}`, itemData)
        .then(res => {

          const updated = items.map(item =>
            item.id === editId ? res.data : item
          );

          setItems(updated);
          setEditId(null);

          showSuccess("Item updated successfully");

        })
        .catch(err => {
          console.error(err);
          showError("Error updating item");
        });

    } else {

      axios.post(API_URL, itemData)
        .then(res => {

          setItems([...items, res.data]);
          showSuccess("Item added successfully");

        })
        .catch(err => {
          console.error(err);
          showError("Error adding item");
        });

    }

    setItemName("");
    setUnit("");
    setQty("");
    setPrice("");

  };

  // DELETE
  const deleteItem = (id) => {

    if (!window.confirm("Are you sure you want to delete this item?")) {
      return;
    }

    axios.delete(`${API_URL}/${id}`)
      .then(() => {

        setItems(items.filter(item => item.id !== id));
        showSuccess("Item deleted successfully");

      })
      .catch(err => {
        console.error(err);
        showError("Error deleting item");
      });

  };

  // EDIT
 const editItem = (item) => {
  setItemName(item.name);
  setUnit(item.unit);
  setQty(item.quantity);
 setPrice(Number(item.price).toFixed(2));
  setEditId(item.id);

  showInfo("Editing item");
};
  return (

    <div className="page">

      {/* Back Button */}
      <button
        className="backBtn"
        onClick={() => navigate("/home")}
      >
        🏠 Home
      </button>

      <h2>Items Entry</h2>

      <div className="form-box">

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

  {showSuggestions && filteredItems.length > 0 && (
    <div className="suggestions-box">
      {filteredItems.map((i) => (
        <div
          key={i.id}
          className="suggestion-item"
          onClick={() => {
            setItemName(i.name);
            setShowSuggestions(false);
          }}
        >
          {i.name}
        </div>
      ))}
    </div>
  )}

</div>

        <select
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
        >
          <option value="">Select Unit</option>
          <option>KG</option>
          <option>Litre</option>
          <option>Gram</option>
          <option>Nos</option>
        </select>

      <input
  type="number"
  step="any"
  min="0"
  placeholder="Opening Qty"
  value={qty}
  onChange={(e) => setQty(e.target.value)}
/>
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

            {items.map((item, index) => (

              <tr key={item.id}>

               <td>{item.createdDate}</td>
                <td>{item.name}</td>
                <td>{item.unit}</td>
                <td>{item.quantity}</td>
                <td>{formatPrice(item.price)}</td>
                <td>{formatPrice(item.quantity * item.price)}</td> {/* ✅ NEW */}

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
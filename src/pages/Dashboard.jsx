import React, { useState, useEffect } from "react";
import "../styles/Dashboard.css";
import { useNavigate } from "react-router-dom";

export default function Dashboard() { 
  const [items, setItems] = useState([]); 
  const [search, setSearch] = useState(""); 
  const [searchResult, setSearchResult] = useState(null);
  const navigate = useNavigate();
  // Function to load products 
  const loadProducts = () => { 
    fetch("http://localhost:8080/products") 
    .then((res) => res.json()) 
    .then((data) => { 
      setItems(data); }) 
      .catch((err) => console.error(err)); 
    };

    // Load products on page load and refresh every 5 seconds 
    useEffect(() => { 
      loadProducts(); 
      const interval = setInterval(() => { 
        loadProducts(); 
      }, 5000);
       return () => clearInterval(interval);
       }, []);

    // Search item 
    const handleSearch = () => { 
      const item = items.find( 
        (i) => i.name.toLowerCase().includes(search.toLowerCase())
       ); 
       if (!item) { 
        setSearchResult(null); 
        alert("Item not found"); 
        return;
       } 
       setSearchResult(item);
       };

       // Low stock filter 
       const lowStockItems = items.filter((item) => item.quantity < 10); 
       return ( 
        
       <div className="dashboard"> 
        {/* Back Button */}
      <button
        className="backBtn"
        onClick={() => navigate("/home")}
      >
        🏠 Home
      </button>
       <h1>Dashboard</h1> 
       {/* Summary Cards */} 
       <div className="cards"> 
        <div className="card">
         <h3>Total Items</h3> 
         <p>{items.length}</p> 
         </div>
         <div className="card"> 
          <h3>Low Stock Items</h3> 
          <p>{lowStockItems.length}</p> 
          </div> </div> 
          {/* Low Stock Section */} 
          <div className="lowStock"> 
            <h2>⚠ Low Stock (Less than 10)</h2> 
            {lowStockItems.length === 0 ? ( 
              <p>No low stock items</p> 
            ) : ( 
            <ul> 
              {lowStockItems.map((item) => (
  <li key={item.id} className="lowItem"> 
  {item.name.toUpperCase()} → {item.quantity} {item.unit} 
  </li> 
))} 
</ul> 
)}
 </div> 
 {/* Search Section */} 
 <div className="searchBox"> 
  <h2>Search Item Stock</h2> 
  <input type="text"
   placeholder="Enter item name" 
   value={search} 
   onChange={(e) => setSearch(e.target.value)} 
   />

  <button onClick={handleSearch}>Search</button> 
  </div>
   {/* Search Result */}
    {searchResult && ( 
      <div className="result"> 
      <h3>{searchResult.name.toUpperCase()}</h3>
       <p> 
        Current Stock: {searchResult.quantity} {searchResult.unit} 
      </p>
       </div> )} 
       </div> 
       ); 
       }
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import ItemsEntry from "./pages/ItemsEntry";
import DailyEntry from "./pages/DailyEntry";
import Reports from "./pages/Reports";
import ItemLookup from "./pages/ItemLookup";
import BinEntries from "./pages/BinEntries";
import MenuPage from "../src/Components/MenuPage";
import CustomerMenu from "../src/pages/customer/CustomerMenu";
import AdminOrdersPage from "../src/pages/customer/AdminOrderPage";
import WelcomePage from "../src/pages/WelcomePage";

function App() {

  const [items, setItems] = useState([]);
  const [entries, setEntries] = useState([]);
  const [orders, setOrders] = useState([]);

  return (

    <BrowserRouter>

      <Routes>
<Route path="/" element={<WelcomePage />} />
<Route path="/login" element={<LoginPage />} />

        <Route path="/home" element={<HomePage />} />
        <Route path="/menu" element={<MenuPage />} />

        <Route 
          path="/dashboard" 
          element={<Dashboard items={items} entries={entries} />} 
        />

        <Route 
          path="/items-entry" 
          element={<ItemsEntry items={items} setItems={setItems} />} 
        />

        <Route 
          path="/daily-entry" 
          element={
            <DailyEntry 
              items={items} 
              entries={entries} 
              setEntries={setEntries} 
            />
          } 
        />
<Route path="/item-lookup" element={<ItemLookup />} />
        <Route 
          path="/reports" 
          element={<Reports entries={entries} />} 
        />
 <Route path="/bin" element={<BinEntries />} />

 <Route
  path="/customer-menu"
  element={
    <CustomerMenu
      orders={orders}
      setOrders={setOrders}
    />
  }
/>
<Route
  path="/admin-orders"
  element={<AdminOrdersPage orders={orders} />}
/>
      </Routes>
     

{/* ✅ Footer goes here */}
  

      {/* Toast Notification System */}
      <ToastContainer position="top-right" autoClose={2000} />

    </BrowserRouter>

  );
  
}

export default App;
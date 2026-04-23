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


function App() {

  const [items, setItems] = useState([]);
  const [entries, setEntries] = useState([]);

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<LoginPage />} />

        <Route path="/home" element={<HomePage />} />

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

      </Routes>

{/* ✅ Footer goes here */}
  

      {/* Toast Notification System */}
      <ToastContainer position="top-right" autoClose={2000} />

    </BrowserRouter>

  );
  
}

export default App;
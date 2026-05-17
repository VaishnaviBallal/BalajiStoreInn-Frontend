import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import "../../styles/AdminOrderPage.css";

function AdminOrderPage() {

  const clientRef = useRef(null);

  const [newOrders, setNewOrders] = useState([]);
  const [acceptedOrders, setAcceptedOrders] = useState([]);
  const [historyOrders, setHistoryOrders] = useState([]);

  const [tab, setTab] = useState("NEW");

  // CONNECT WS
  useEffect(() => {

    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),

      onConnect: () => {
        console.log("ADMIN CONNECTED");

        client.subscribe("/topic/orders", (msg) => {
          const order = JSON.parse(msg.body);

          console.log("📦 ORDER UPDATE:", order);

          setNewOrders(prev => [order, ...prev]);
        });
      }
    });

    client.activate();
    clientRef.current = client;

    return () => client.deactivate();
  }, []);

  // LOAD HISTORY
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const res = await axios.get("http://localhost:8080/orders/all");

    const all = res.data;

    setNewOrders(all.filter(o => o.status === "NEW"));
    setAcceptedOrders(all.filter(o => o.status === "ACCEPTED"));
    setHistoryOrders(all.filter(o => o.status === "COMPLETED"));
  };

  // ACCEPT ORDER
  const acceptOrder = async (id) => {
    console.log("👉 ACCEPT CLICKED:", id);

    const res = await axios.put(`http://localhost:8080/orders/accept/${id}`);

    const updated = res.data;

    setNewOrders(prev => prev.filter(o => o.id !== id));
    setAcceptedOrders(prev => [updated, ...prev]);
  };

  // UI RENDER
  const renderItems = (items) => {
    return items.map(i => (
      <div key={i.name} className="itemRow">
        <span>{i.name}</span>
        <span>{i.quantity} × ₹{i.price}</span>
      </div>
    ));
  };

  return (
    <div className="adminContainer">

      <h1>🍽 Admin Panel</h1>

      {/* TABS */}
      <div className="tabs">
        <button onClick={() => setTab("NEW")}>New Orders</button>
        <button onClick={() => setTab("ACCEPTED")}>Accepted</button>
        <button onClick={() => setTab("HISTORY")}>History</button>
      </div>

      {/* NEW */}
      {tab === "NEW" && newOrders.map(order => (
        <div key={order.id} className="orderCard">
          <h3>Table {order.tableNo}</h3>

          {renderItems(order.items)}

          <p>Total: ₹{order.total}</p>

          <button onClick={() => acceptOrder(order.id)}>
            Accept Order
          </button>
        </div>
      ))}

      {/* ACCEPTED */}
      {tab === "ACCEPTED" && acceptedOrders.map(order => (
        <div key={order.id} className="orderCard accepted">
          <h3>Table {order.tableNo}</h3>

          {renderItems(order.items)}

          <p>Total: ₹{order.total}</p>
        </div>
      ))}

      {/* HISTORY */}
      {tab === "HISTORY" && historyOrders.map(order => (
        <div key={order.id} className="orderCard history">
          <h3>Table {order.tableNo}</h3>

          {renderItems(order.items)}

          <p>Total: ₹{order.total}</p>
        </div>
      ))}

    </div>
  );
}

export default AdminOrderPage;
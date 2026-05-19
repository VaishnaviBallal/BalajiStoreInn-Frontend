import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import "../../styles/AdminOrderPage.css";
import notificationSound from "../../assets/alert.mp3";
import { toast } from "react-toastify";

function AdminOrderPage() {
  const navigate = useNavigate();
  const clientRef = useRef(null);
  const audioRef = useRef(null);

  const [newOrders, setNewOrders] = useState([]);
  const [acceptedOrders, setAcceptedOrders] = useState([]);
  const [historyOrders, setHistoryOrders] = useState([]);
  const [tab, setTab] = useState("NEW");

  const BASE_URL = "https://balajirestaurant.onrender.com";

  // =====================================
  // INIT AUDIO + NOTIFICATION PERMISSION
  // =====================================
  useEffect(() => {

    audioRef.current = new Audio(notificationSound);

    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

  }, []);

  // =====================================
  // LOAD ORDERS
  // =====================================
  const loadOrders = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/orders/all`);

      const all = res.data;

      setNewOrders(all.filter(o => o.status === "NEW"));
      setAcceptedOrders(all.filter(o => o.status === "ACCEPTED"));
      setHistoryOrders(all.filter(o => o.status === "COMPLETED"));

    } catch (err) {
      console.error("LOAD ERROR:", err);
    }
  };

  // =====================================
  // WEBSOCKET (ONLY NOTIFICATION FIXED)
  // =====================================
  useEffect(() => {

    loadOrders();

    const client = new Client({

      webSocketFactory: () => new SockJS(`${BASE_URL}/ws`),
      reconnectDelay: 3000,

      onConnect: () => {

        console.log("CONNECTED");

        client.subscribe("/topic/orders", (msg) => {

          const order = JSON.parse(msg.body);

          if (order.status === "NEW") {

            // 🔊 SOUND
            try {
              if (audioRef.current) {
                audioRef.current.currentTime = 0;

                const playPromise = audioRef.current.play();
                if (playPromise) {
                  playPromise.catch(err => {
                    console.log("Sound blocked:", err);
                  });
                }
              }
            } catch (err) {
              console.log(err);
            }

            // 📳 VIBRATION
            navigator.vibrate?.(200);

            // 🔔 NOTIFICATION FIXED
            if ("Notification" in window) {

              if (Notification.permission === "granted") {
                new Notification("🍽 New Order Received", {
                  body: `Table ${order.tableNo} placed order`,
                  icon: "/logo192.png"
                });

              } else if (Notification.permission !== "denied") {

                Notification.requestPermission().then(permission => {
                  if (permission === "granted") {
                    new Notification("🍽 New Order Received", {
                      body: `Table ${order.tableNo} placed order`,
                      icon: "/logo192.png"
                    });
                  }
                });
              }
            }
          }

          loadOrders();
        });
      },

      onDisconnect: () => {
        console.log("DISCONNECTED");
      }
    });

    client.activate();
    clientRef.current = client;

    return () => client.deactivate();

  }, []);

  // =====================================
  // ENABLE SOUND
  // =====================================
  const enableSound = async () => {
    try {

      if (Notification.permission !== "granted") {
        await Notification.requestPermission();
      }

      if (audioRef.current) {
        audioRef.current.muted = false;
        audioRef.current.volume = 1;

        await audioRef.current.play();
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      toast.success("📱 Sound Enabled");

    } catch (err) {
      console.log(err);
    }
  };

  // =====================================
  // ACCEPT ORDER
  // =====================================
  const acceptOrder = async (id) => {
    await axios.put(`${BASE_URL}/orders/${id}/accept`);
    loadOrders();
  };

  // =====================================
  // COMPLETE ORDER
  // =====================================
  const completeOrder = async (id) => {
    await axios.put(`${BASE_URL}/orders/${id}/complete`);
    loadOrders();
  };

  // =====================================
  // DELETE ORDER (RESTORED TOAST CONFIRM)
  // =====================================
  const deleteOrder = (id) => {

    toast((t) => (
      <div className="toastBox">
        <p>🗑 Delete this order?</p>

        <div className="toastButtons">
          <button
            className="yesBtn"
            onClick={async () => {
              try {
                await axios.delete(`${BASE_URL}/orders/${id}`);
                toast.dismiss(t.id);
                toast.success("Order deleted");
                loadOrders();
              } catch (err) {
                toast.error("Delete failed");
              }
            }}
          >
            Yes
          </button>

          <button className="noBtn" onClick={() => toast.dismiss(t.id)}>
            No
          </button>
        </div>
      </div>
    ), {
      autoClose: false,
      closeOnClick: false
    });
  };

  // =====================================
  // CLEAR HISTORY (RESTORED TOAST CONFIRM)
  // =====================================
  const clearHistory = () => {

    toast((t) => (
      <div className="toastBox">
        <p>🧹 Clear all history?</p>

        <div className="toastButtons">
          <button
            className="yesBtn"
            onClick={async () => {
              try {
                await axios.delete(`${BASE_URL}/orders/history/clear`);
                toast.dismiss(t.id);
                toast.success("History cleared");
                loadOrders();
              } catch (err) {
                toast.error("Failed to clear");
              }
            }}
          >
            Yes
          </button>

          <button className="noBtn" onClick={() => toast.dismiss(t.id)}>
            No
          </button>
        </div>
      </div>
    ), {
      autoClose: false,
      closeOnClick: false
    });
  };

  // =====================================
  // RENDER ITEMS
  // =====================================
  const renderItems = (items) =>
    items.map((i, index) => (
      <div key={index} className="itemRow">
        <span>{i.name}</span>
        <span>{i.quantity} × ₹{i.price}</span>
      </div>
    ));

  return (
    <div className="adminContainer">

      <div className="adminHeaders">
        <button className="backBtn" onClick={() => navigate("/home")}>
          ⬅ Back
        </button>

        <h1>🍽 Balaji Inn Orders</h1>

        <button className="enableSoundBtn" onClick={enableSound}>
          🔊 Enable Sound
        </button>
      </div>

      <div className="tabs">
        <button className={tab === "NEW" ? "activeTab" : ""} onClick={() => setTab("NEW")}>
          🆕 New Orders ({newOrders.length})
        </button>

        <button className={tab === "ACCEPTED" ? "activeTab" : ""} onClick={() => setTab("ACCEPTED")}>
          🍳 Accepted ({acceptedOrders.length})
        </button>

        <button className={tab === "HISTORY" ? "activeTab" : ""} onClick={() => setTab("HISTORY")}>
          📜 History ({historyOrders.length})
        </button>
      </div>

      {/* NEW */}
      {tab === "NEW" && (
        <div className="ordersGrid">
          {newOrders.map(order => (
            <div key={order.id} className="orderCard">

              <div className="orderTop">
                <h3>🪑 Table {order.tableNo}</h3>
                <span className="status new">NEW</span>
              </div>

              <div className="itemsBox">
                {renderItems(order.items)}
              </div>

              <h2 className="total">₹{order.total}</h2>

              <button className="acceptBtn" onClick={() => acceptOrder(order.id)}>
                ✅ Accept Order
              </button>

            </div>
          ))}
        </div>
      )}

      {/* ACCEPTED */}
      {tab === "ACCEPTED" && (
        <div className="ordersGrid">
          {acceptedOrders.map(order => (
            <div key={order.id} className="orderCard acceptedCard">

              <div className="orderTop">
                <h3>🪑 Table {order.tableNo}</h3>
                <span className="status accepted">ACCEPTED</span>
              </div>

              <div className="itemsBox">
                {renderItems(order.items)}
              </div>

              <h2 className="total">₹{order.total}</h2>

              <button className="completeBtn" onClick={() => completeOrder(order.id)}>
                🍳 Complete Order
              </button>

            </div>
          ))}
        </div>
      )}

      {/* HISTORY */}
      {tab === "HISTORY" && (
        <div>
          <div className="historyTop">
            <button className="clearHistoryBtn" onClick={clearHistory}>
              🗑 Clear History
            </button>
          </div>

          <div className="ordersGrid">
            {historyOrders.map(order => (
              <div key={order.id} className="orderCard historyCard">

                <div className="orderTop">
                  <h3>🪑 Table {order.tableNo}</h3>
                  <span className="status completed">COMPLETED</span>
                </div>

                <div className="itemsBox">
                  {renderItems(order.items)}
                </div>

                <h2 className="total">₹{order.total}</h2>

                <button className="deleteBtn" onClick={() => deleteOrder(order.id)}>
                  🗑 Delete Order
                </button>

              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminOrderPage;
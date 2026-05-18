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
  const BASE_URL = "https://balajirestaurant.onrender.com";

  const [tab, setTab] = useState("NEW");

  // =====================================
  // INIT AUDIO
  // =====================================
  useEffect(() => {

    audioRef.current = new Audio(notificationSound);

  }, []);

  // =====================================
  // LOAD ORDERS
  // =====================================
  const loadOrders = async () => {

    try {

      console.log("📥 Loading Orders...");

      const res = await axios.get(`${BASE_URL}/orders/all`)

      const all = res.data;

      console.log("✅ ORDERS:", all);

      setNewOrders(
        all.filter(o => o.status === "NEW")
      );

      setAcceptedOrders(
        all.filter(o => o.status === "ACCEPTED")
      );

      setHistoryOrders(
        all.filter(o => o.status === "COMPLETED")
      );

    } catch (err) {

      console.error("❌ LOAD ERROR:", err);
    }
  };

  // =====================================
  // WEBSOCKET
  // =====================================
  useEffect(() => {

    loadOrders();

    const client = new Client({

      webSocketFactory: () =>
       new SockJS(`${BASE_URL}/ws`),

      reconnectDelay: 3000,

      onConnect: () => {

        console.log("🟢 ADMIN CONNECTED");

        client.subscribe("/topic/orders", (msg) => {

          console.log("🔥 RAW MESSAGE:", msg);

          const order = JSON.parse(msg.body);

          console.log("📦 ORDER UPDATE:", order);

          // 🔔 PLAY SOUND ONLY FOR NEW ORDER
          if (order.status === "NEW") {

            if (audioRef.current) {

              audioRef.current.currentTime = 0;

              audioRef.current.play().catch(err => {

                console.log("🔇 AUDIO BLOCKED:", err);

              });
            }

            // OPTIONAL BROWSER NOTIFICATION
            if (Notification.permission === "granted") {

              new Notification("🍽 New Order Received", {
                body: `Table ${order.tableNo} placed order`,
              });
            }
          }

          loadOrders();
        });
      },

      onDisconnect: () => {
        console.log("🔴 ADMIN DISCONNECTED");
      }
    });

    client.activate();

    clientRef.current = client;

    return () => client.deactivate();

  }, []);

  // =====================================
  // ENABLE NOTIFICATION PERMISSION
  // =====================================
  const enableSound = async () => {

    try {

      if (Notification.permission !== "granted") {

        await Notification.requestPermission();
      }

      if (audioRef.current) {

        await audioRef.current.play();

        audioRef.current.pause();

        audioRef.current.currentTime = 0;
      }

      toast.success(
      "📱 Sound Enabled"
    );

    } catch (err) {

      console.log(err);
    }
  };

  // =====================================
  // ACCEPT ORDER
  // =====================================
  const acceptOrder = async (id) => {

    try {

      console.log("👉 ACCEPT ORDER:", id);

     await axios.put(`${BASE_URL}/orders/${id}/accept`)

      loadOrders();

    } catch (err) {

      console.error("❌ ACCEPT ERROR:", err);
    }
  };

  // =====================================
  // COMPLETE ORDER
  // =====================================
  const completeOrder = async (id) => {

    try {

      console.log("🍳 COMPLETE ORDER:", id);

    await axios.put(`${BASE_URL}/orders/${id}/complete`)
      loadOrders();

    } catch (err) {

      console.error("❌ COMPLETE ERROR:", err);
    }
  };

  // =====================================
  // DELETE SINGLE ORDER
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
             await axios.delete(`${BASE_URL}/orders/${id}`)

              toast.success("Order deleted");
              loadOrders();
              toast.dismiss(t.id);

            } catch (err) {
              toast.error("Delete failed");
            }
          }}
        >
          Yes
        </button>

        <button
          className="noBtn" onClick={() => toast.dismiss(t.id)}>
          No
        </button>
      </div>
    </div>
  ), {
    closeOnClick: false,
    autoClose: false
  });
};

  // =====================================
  // CLEAR HISTORY
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

              toast.success("History cleared");
              
              loadOrders();
              toast.dismiss(t.id);

            } catch (err) {
              toast.error("Failed to clear");
            }
          }}
        >
          Yes
        </button>

        <button
          className="noBtn"
          onClick={() => toast.dismiss(t.id)}
        >
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
  const renderItems = (items) => {

    return items.map((i, index) => (

      <div key={index} className="itemRow">

        <span>{i.name}</span>

        <span>
          {i.quantity} × ₹{i.price}
        </span>

      </div>
    ));
  };

  return (

    <div className="adminContainer">

      {/* HEADER */}
      <div className="adminHeaders">
<button className="backBtn" onClick={() => navigate("/home")} > ⬅ Back </button>
        <h1>🍽 Balaji Inn Orders</h1>

       <button className="enableSoundBtn" onClick={enableSound} > 🔊 Enable Sound </button>

      </div>

      {/* TABS */}
      <div className="tabs">

        <button
          className={tab === "NEW" ? "activeTab" : ""}
          onClick={() => setTab("NEW")}
        >
          🆕 New Orders ({newOrders.length})
        </button>

        <button
          className={tab === "ACCEPTED" ? "activeTab" : ""}
          onClick={() => setTab("ACCEPTED")}
        >
          🍳 Accepted ({acceptedOrders.length})
        </button>

        <button
          className={tab === "HISTORY" ? "activeTab" : ""}
          onClick={() => setTab("HISTORY")}
        >
          📜 History ({historyOrders.length})
        </button>
         

      </div>

      {/* NEW */}
      {tab === "NEW" && (

        <div className="ordersGrid">

          {newOrders.length === 0 && (
            <p className="emptyText">
              No New Orders
            </p>
          )}

          {newOrders.map(order => (

            <div
              key={order.id}
              className="orderCard"
            >

              <div className="orderTop">

                <h3>
                  🪑 Table {order.tableNo}
                </h3>

                <span className="status new">
                  NEW
                </span>

              </div>

              <div className="itemsBox">
                {renderItems(order.items)}
              </div>

              <h2 className="total">
                ₹{order.total}
              </h2>

              <button
                className="acceptBtn"
                onClick={() =>
                  acceptOrder(order.id)
                }
              >
                ✅ Accept Order
              </button>

            </div>
          ))}
        </div>
      )}

      {/* ACCEPTED */}
      {tab === "ACCEPTED" && (

        <div className="ordersGrid">

          {acceptedOrders.length === 0 && (
            <p className="emptyText">
              No Accepted Orders
            </p>
          )}

          {acceptedOrders.map(order => (

            <div
              key={order.id}
              className="orderCard acceptedCard"
            >

              <div className="orderTop">

                <h3>
                  🪑 Table {order.tableNo}
                </h3>

                <span className="status accepted">
                  ACCEPTED
                </span>

              </div>

              <div className="itemsBox">
                {renderItems(order.items)}
              </div>

              <h2 className="total">
                ₹{order.total}
              </h2>

              <button
                className="completeBtn"
                onClick={() =>
                  completeOrder(order.id)
                }
              >
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

            <button
              className="clearHistoryBtn"
              onClick={clearHistory}
            >
              🗑 Clear History
            </button>

          </div>

          <div className="ordersGrid">

            {historyOrders.length === 0 && (
              <p className="emptyText">
                No Completed Orders
              </p>
            )}

            {historyOrders.map(order => (

              <div
                key={order.id}
                className="orderCard historyCard"
              >

                <div className="orderTop">

                  <h3>
                    🪑 Table {order.tableNo}
                  </h3>

                  <span className="status completed">
                    COMPLETED
                  </span>

                </div>

                <div className="itemsBox">
                  {renderItems(order.items)}
                </div>

                <h2 className="total">
                  ₹{order.total}
                </h2>

                <button
                  className="deleteBtn"
                  onClick={() =>
                    deleteOrder(order.id)
                  }
                >
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
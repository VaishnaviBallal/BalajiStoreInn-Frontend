import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import "../../styles/AdminOrderPage.css";
import notificationSound from "../../assets/alert.mp3";

function AdminOrderPage() {

  const clientRef = useRef(null);
  const audioRef = useRef(null);

  const [newOrders, setNewOrders] = useState([]);
  const [acceptedOrders, setAcceptedOrders] = useState([]);
  const [historyOrders, setHistoryOrders] = useState([]);

  const [tab, setTab] = useState("NEW");

  // =====================================
  // AUDIO INIT
  // =====================================
  useEffect(() => {

    audioRef.current = new Audio(notificationSound);

  }, []);

  // =====================================
  // LOAD INITIAL ORDERS
  // =====================================
  const loadOrders = async () => {

    try {

      console.log("📥 Loading Orders...");

      const res = await axios.get(
        "http://192.168.0.4:8080/orders/all"
      );

      const all = res.data;

      console.log("✅ Orders:", all);

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
        new SockJS("http://192.168.0.4:8080/ws"),

      reconnectDelay: 3000,

      onConnect: () => {

        console.log("🟢 ADMIN CONNECTED");

        client.subscribe("/topic/orders", (msg) => {

          const order = JSON.parse(msg.body);

          console.log("📦 ORDER UPDATE:", order);

          // 🔔 SOUND FOR NEW ORDER
          if (order.status === "NEW") {

            if (audioRef.current) {

              audioRef.current.currentTime = 0;

              audioRef.current.play().catch(err => {

                console.log("🔇 AUDIO BLOCKED:", err);

              });
            }

            // BROWSER NOTIFICATION
            if (Notification.permission === "granted") {

              new Notification("🍽 New Order", {
                body: `Table ${order.tableNo} placed an order`
              });
            }

            // ADD NEW ORDER INSTANTLY
            setNewOrders(prev => {

              const exists = prev.some(
                o => o.id === order.id
              );

              if (exists) return prev;

              return [order, ...prev];
            });
          }
        });
      },

      onDisconnect: () => {

        console.log("🔴 DISCONNECTED");
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

        await audioRef.current.play();

        audioRef.current.pause();

        audioRef.current.currentTime = 0;
      }

      alert("✅ Sound Enabled");

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

      const res = await axios.put(
        `http://192.168.0.4:8080/orders/${id}/accept`
      );

      const updatedOrder = res.data;

      // REMOVE FROM NEW
      setNewOrders(prev =>
        prev.filter(o => o.id !== id)
      );

      // ADD TO ACCEPTED
      setAcceptedOrders(prev => [
        updatedOrder,
        ...prev
      ]);

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

      const res = await axios.put(
        `http://192.168.0.4:8080/orders/${id}/complete`
      );

      const updatedOrder = res.data;

      // REMOVE FROM ACCEPTED
      setAcceptedOrders(prev =>
        prev.filter(o => o.id !== id)
      );

      // ADD TO HISTORY
      setHistoryOrders(prev => [
        updatedOrder,
        ...prev
      ]);

    } catch (err) {

      console.error("❌ COMPLETE ERROR:", err);
    }
  };

  // =====================================
  // DELETE ORDER
  // =====================================
  const deleteOrder = async (id) => {

    const ok = window.confirm(
      "Delete this order?"
    );

    if (!ok) return;

    try {

      await axios.delete(
        `http://192.168.0.4:8080/orders/${id}`
      );

      setHistoryOrders(prev =>
        prev.filter(o => o.id !== id)
      );

    } catch (err) {

      console.error("❌ DELETE ERROR:", err);
    }
  };

  // =====================================
  // CLEAR HISTORY
  // =====================================
  const clearHistory = async () => {

    const ok = window.confirm(
      "Clear all completed orders?"
    );

    if (!ok) return;

    try {

      await axios.delete(
        "http://192.168.0.4:8080/orders/history/clear"
      );

      setHistoryOrders([]);

    } catch (err) {

      console.error("❌ CLEAR ERROR:", err);
    }
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
      <div className="adminHeader">

        <h1>🍽 Balaji Inn Admin</h1>

       

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
         <button
          className="enableSoundBtn"
          onClick={enableSound}
        >
          🔊 Enable Sound
        </button>

      </div>

      {/* NEW ORDERS */}
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
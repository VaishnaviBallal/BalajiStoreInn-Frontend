import { useState, useRef, useEffect } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import "../../styles/CustomerMenu.css";

function CustomerMenu() {

  const clientRef = useRef(null);
  const sectionRefs = useRef({});

  const [connected, setConnected] = useState(false);
  const [cart, setCart] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

 const menuItems = [

    // MOCKTAILS
    { id: 1, name: "Balaji Camel (Blue Lagoon)", price: 160, category: "Mocktails" },
    { id: 2, name: "Virgin Mojito", price: 160, category: "Mocktails" },
    { id: 3, name: "Lemon Iced Tea", price: 160, category: "Mocktails" },
    { id: 4, name: "Litchi Lagoon", price: 160, category: "Mocktails" },
    { id: 5, name: "Purple Passion", price: 160, category: "Mocktails" },
    { id: 6, name: "Ginger Lime Spritzer", price: 160, category: "Mocktails" },
    { id: 7, name: "Orange Blossom", price: 180, category: "Mocktails" },
    { id: 8, name: "Aam Panna", price: 180, category: "Mocktails" },
    { id: 9, name: "Grandberry Smash", price: 180, category: "Mocktails" },
    { id: 10, name: "Blue Moon", price: 180, category: "Mocktails" },
    { id: 11, name: "Kiwi Delight", price: 180, category: "Mocktails" },
    { id: 12, name: "Virgin Pina Colada", price: 190, category: "Mocktails" },
    { id: 13, name: "Cookie Cutter", price: 200, category: "Mocktails" },
    { id: 14, name: "Cho Comogo", price: 200, category: "Mocktails" },
    { id: 15, name: "Balaji Special Fruit Punch", price: 200, category: "Mocktails" },

    // VEG SOUPS
    { id: 16, name: "Veg Clear Soup", price: 90, category: "Veg Soup" },
    { id: 17, name: "Veg Manchow / Hot & Sour Soup", price: 100, category: "Veg Soup" },
    { id: 18, name: "Cream of Palak Soup", price: 110, category: "Veg Soup" },
    { id: 19, name: "Cream of Veg Soup", price: 120, category: "Veg Soup" },
    { id: 20, name: "Lemon Coriander Soup", price: 120, category: "Veg Soup" },
    { id: 21, name: "Burnt Garlic Veg Soup", price: 120, category: "Veg Soup" },
    { id: 22, name: "Sweet Corn Veg Soup", price: 120, category: "Veg Soup" },
    { id: 23, name: "Cream of Tomato Soup", price: 120, category: "Veg Soup" },
    { id: 24, name: "Cream of Mushroom Soup", price: 130, category: "Veg Soup" },
    { id: 25, name: "Veg Noodle Soup", price: 130, category: "Veg Soup" },
    { id: 26, name: "Veg Wonton Soup", price: 130, category: "Veg Soup" },
    { id: 27, name: "Tom Yum Soup", price: 150, category: "Veg Soup" },

    // NON VEG SOUPS
    { id: 28, name: "Chicken Clear Soup", price: 110, category: "Non Veg Soup" },
    { id: 29, name: "Chicken Manchow Soup", price: 120, category: "Non Veg Soup" },
    { id: 30, name: "Chicken Shorba Soup", price: 130, category: "Non Veg Soup" },
    { id: 31, name: "Cream of Chicken Soup", price: 140, category: "Non Veg Soup" },
    { id: 32, name: "Sweet Corn Chicken Soup", price: 140, category: "Non Veg Soup" },
    { id: 33, name: "Lemon Coriander Chicken Soup", price: 140, category: "Non Veg Soup" },
    { id: 34, name: "Burnt Garlic Chicken Soup", price: 140, category: "Non Veg Soup" },
    { id: 35, name: "Lung Fung Chicken Soup", price: 150, category: "Non Veg Soup" },
    { id: 36, name: "Tom Yum Chicken Soup", price: 170, category: "Non Veg Soup" },

    // VEG STARTERS
    { id: 37, name: "Mix Veg Pakoda", price: 130, category: "Veg Starter" },
    { id: 38, name: "Onion Pakoda / Bhajia", price: 130, category: "Veg Starter" },
    { id: 39, name: "Veg Boiled", price: 150, category: "Veg Starter" },
    { id: 40, name: "Green Peas Dry", price: 160, category: "Veg Starter" },
    { id: 41, name: "Garlic Fry", price: 160, category: "Veg Starter" },
    { id: 42, name: "Corn Pepper Dry", price: 180, category: "Veg Starter" },
    { id: 43, name: "Hara Bhara Kebab", price: 190, category: "Veg Starter" },
    { id: 44, name: "Corn Tikki", price: 210, category: "Veg Starter" },
    { id: 45, name: "Paneer Pakoda", price: 220, category: "Veg Starter" },
    { id: 46, name: "Cheese Pakoda", price: 240, category: "Veg Starter" },

    // CHICKEN STARTERS
    { id: 47, name: "Chicken Lollypop", price: 250, category: "Chicken Starter" },
    { id: 48, name: "Chicken Chilli", price: 250, category: "Chicken Starter" },
    { id: 49, name: "Chicken Crispy", price: 270, category: "Chicken Starter" },
    { id: 50, name: "Chicken 65", price: 270, category: "Chicken Starter" },
    { id: 51, name: "Chicken Schezwan", price: 270, category: "Chicken Starter" },
    { id: 52, name: "Chicken Seekh Kebab", price: 290, category: "Chicken Starter" },
    { id: 53, name: "Chicken Reshmi Kebab", price: 300, category: "Chicken Starter" },
    { id: 54, name: "Chicken Sonali Tikka", price: 350, category: "Chicken Starter" },
    { id: 55, name: "Chicken Tandoori", price: 480, category: "Chicken Starter" },

    // MAIN COURSE
    { id: 56, name: "Butter Chicken", price: 480, category: "Main Course" },
    { id: 57, name: "Chicken Hyderabadi", price: 260, category: "Main Course" },
    { id: 58, name: "Chicken Kolhapuri", price: 260, category: "Main Course" },
    { id: 59, name: "Chicken Tikka Masala", price: 280, category: "Main Course" },
    { id: 60, name: "Chicken Chettinad", price: 280, category: "Main Course" },
    { id: 61, name: "Chicken Handi", price: 400, category: "Main Course" },
    { id: 62, name: "Chicken Patiala", price: 360, category: "Main Course" },
    { id: 63, name: "Mutton Rogan Josh", price: 480, category: "Main Course" },
    { id: 64, name: "Mutton Handi", price: 480, category: "Main Course" },

    // RICE
    { id: 65, name: "Chicken Fried Rice", price: 200, category: "Rice" },
    { id: 66, name: "Chicken Schezwan Fried Rice", price: 220, category: "Rice" },
    { id: 67, name: "Chicken Singapore Fried Rice", price: 240, category: "Rice" },
    { id: 68, name: "Chicken Hong Kong Fried Rice", price: 240, category: "Rice" },
    { id: 69, name: "Chicken Burnt Garlic Fried Rice", price: 250, category: "Rice" },
    { id: 70, name: "Chicken Manchurian Fried Rice", price: 280, category: "Rice" },
    { id: 71, name: "Egg Fried Rice", price: 170, category: "Rice" },

    // NOODLES
    { id: 72, name: "Veg Hakka Noodles", price: 180, category: "Noodles" },
    { id: 73, name: "Veg Schezwan Noodles", price: 190, category: "Noodles" },
    { id: 74, name: "Chicken Hakka Noodles", price: 200, category: "Noodles" },
    { id: 75, name: "Chicken Schezwan Noodles", price: 220, category: "Noodles" },
    { id: 76, name: "Chicken Singapore Noodles", price: 240, category: "Noodles" },

    // APPETIZERS
    { id: 77, name: "Masala Papad", price: 50, category: "Snacks" },
    { id: 78, name: "French Fries", price: 130, category: "Snacks" },
    { id: 79, name: "French Cheese Fries", price: 150, category: "Snacks" },

    // RAITA
    { id: 80, name: "Mix Veg Raita", price: 110, category: "Raita" },
    { id: 81, name: "Boondi Raita", price: 110, category: "Raita" },
    { id: 82, name: "Pineapple Raita", price: 130, category: "Raita" },

    //
// SEA FOOD
//

{ id: 83, name: "Pomfret Fry", price: "APS", category: "Sea Food" },
{ id: 84, name: "Kingfish (Anjal) Fry", price: "APS", category: "Sea Food" },
{ id: 85, name: "Bangda Fry", price: "APS", category: "Sea Food" },
{ id: 86, name: "Silver Fish Fry", price: "APS", category: "Sea Food" },
{ id: 87, name: "Bombil Fry", price: "APS", category: "Sea Food" },
{ id: 88, name: "Prawns Fry", price: "APS", category: "Sea Food" },
{ id: 89, name: "Boothai Fry", price: "APS", category: "Sea Food" },
{ id: 90, name: "Muru Fry", price: "APS", category: "Sea Food" },
{ id: 91, name: "Kane Clayfish Fry", price: "APS", category: "Sea Food" },

//
// SOUTH INDIAN MAIN COURSE
//

{ id: 92, name: "Kori Rotti", price: 200, category: "South Indian" },
{ id: 93, name: "Chicken Curry Neer Dosa", price: 180, category: "South Indian" },
{ id: 94, name: "Chicken Kundapura", price: 180, category: "South Indian" },
{ id: 95, name: "Chicken Mangalorean Curry", price: 160, category: "South Indian" },
{ id: 96, name: "Chicken Pulimunchi", price: 180, category: "South Indian" },
{ id: 97, name: "Chicken Gassi", price: 180, category: "South Indian" },
{ id: 98, name: "Chicken Malabar Curry", price: 200, category: "South Indian" },
{ id: 99, name: "Fish Gassi / Curry", price: "APS", category: "South Indian" },
{ id: 100, name: "Fish Pulimunchi", price: "APS", category: "South Indian" },
{ id: 101, name: "Veg Malabar Curry", price: 160, category: "South Indian" },
{ id: 102, name: "Neer Dosa (3 pcs)", price: 60, category: "South Indian" },
{ id: 103, name: "Rice Roti", price: 60, category: "South Indian" },

//
// NORTH INDIAN VEG MAIN COURSE
//

{ id: 104, name: "Dal Fry", price: 150, category: "North Indian Veg" },
{ id: 105, name: "Dal Tadka", price: 160, category: "North Indian Veg" },
{ id: 106, name: "Dal Kolhapuri", price: 160, category: "North Indian Veg" },
{ id: 107, name: "Dal Palak", price: 160, category: "North Indian Veg" },
{ id: 108, name: "Aloo Jeera", price: 150, category: "North Indian Veg" },
{ id: 109, name: "Aloo Palak", price: 180, category: "North Indian Veg" },
{ id: 110, name: "Tomato Masala", price: 160, category: "North Indian Veg" },
{ id: 111, name: "Green Peas Masala Fry", price: 180, category: "North Indian Veg" },
{ id: 112, name: "Mushroom Masala", price: 200, category: "North Indian Veg" },
{ id: 113, name: "Mushroom Handi / Kadai", price: 220, category: "North Indian Veg" },
{ id: 114, name: "Veg Chatpata", price: 180, category: "North Indian Veg" },
{ id: 115, name: "Veg Kadai / Handi", price: 180, category: "North Indian Veg" },
{ id: 116, name: "Veg Jaipuri", price: 200, category: "North Indian Veg" },

//
// EXTRA CHINESE ITEMS MISSED
//

{ id: 117, name: "Chicken Combination Fried Rice", price: 220, category: "Rice" },
{ id: 118, name: "Chicken Chopper Rice", price: 260, category: "Rice" },
{ id: 119, name: "Chicken Triple Schezwan Fried Rice", price: 280, category: "Rice" },
{ id: 120, name: "Non Veg Mixed Fried Rice", price: 300, category: "Rice" },
{ id: 121, name: "Chicken American Chop Suey", price: 280, category: "Rice" },
{ id: 122, name: "Mutton Fried Rice", price: 280, category: "Rice" },
{ id: 123, name: "Prawns Fried Rice", price: 280, category: "Rice" },

//
// EXTRA NOODLES MISSED
//

{ id: 124, name: "Mixed Veg Hakka Noodles", price: 190, category: "Noodles" },
{ id: 125, name: "Veg Singapore Noodles", price: 190, category: "Noodles" },
{ id: 126, name: "Veg Hong Kong Noodles", price: 190, category: "Noodles" },
{ id: 127, name: "Veg Manchurian Noodles", price: 220, category: "Noodles" },
{ id: 128, name: "Chicken Hong Kong Noodles", price: 240, category: "Noodles" },
{ id: 129, name: "Chicken Manchurian Noodles", price: 260, category: "Noodles" },
{ id: 130, name: "Non Veg Mixed Hakka Noodles", price: 280, category: "Noodles" },
{ id: 131, name: "Mutton Hakka Noodles", price: 280, category: "Noodles" },
{ id: 132, name: "Prawns Hakka Noodles", price: 280, category: "Noodles" },
{ id: 133, name: "Egg Hakka Noodles", price: 190, category: "Noodles" }

  ];

  const categories = [...new Set(menuItems.map(i => i.category))];

  // CONNECT WEBSOCKET
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS("http://192.168.0.4:8080/ws"),
      reconnectDelay: 3000,

      onConnect: () => {
        console.log("✅ Connected");
        setConnected(true);
      },

      onDisconnect: () => setConnected(false),
    });

    client.activate();
    clientRef.current = client;

    return () => client.deactivate();
  }, []);

  // ADD TO CART
  const addToCart = (item) => {
    const exist = cart.find(c => c.id === item.id);

    if (exist) {
      setCart(cart.map(c =>
        c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const getTotal = () =>
    cart.reduce((t, i) => t + i.price * i.quantity, 0);

  // PLACE ORDER
  const placeOrder = () => {
    if (!clientRef.current?.connected) {
      alert("Server not connected");
      return;
    }

    const order = {
      tableNo: 1,
      items: cart,
      total: getTotal(),
      status: "NEW"
    };

    clientRef.current.publish({
      destination: "/app/order",
      body: JSON.stringify(order)
    });

    setCart([]);
    alert("Order placed!");
  };

  // NEXT CATEGORY
  const scrollToNext = () => {
    if (currentIndex < categories.length - 1) {
      const next = currentIndex + 1;

      sectionRefs.current[categories[next]]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      setCurrentIndex(next);
    }
  };

  // PREV CATEGORY
  const scrollToPrev = () => {
    if (currentIndex > 0) {
      const prev = currentIndex - 1;

      sectionRefs.current[categories[prev]]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      setCurrentIndex(prev);
    }
  };

  // AUTO DETECT SCROLL POSITION
  useEffect(() => {
    const handleScroll = () => {
      let activeIndex = 0;

      categories.forEach((cat, index) => {
        const el = sectionRefs.current[cat];

        if (el) {
          const rect = el.getBoundingClientRect();

          if (rect.top <= window.innerHeight / 3) {
            activeIndex = index;
          }
        }
      });

      setCurrentIndex(activeIndex);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [categories]);

  return (
    <div className="customerMenu">

      {/* TOP BAR */}
      <div className="topBar">
        <h1>🍽 Balaji Inn</h1>
      </div>

      {/* CATEGORY BAR */}
      <div className="categoryBar">
        {categories.map(cat => (
          <a key={cat} href={`#${cat}`} className="categoryTab">
            {cat}
          </a>
        ))}
      </div>

      <div className="menuContainer">

        {/* MENU */}
        <div className="menuSection">

          {categories.map((category) => (
            <div
              key={category}
              id={category}
              ref={(el) => (sectionRefs.current[category] = el)}
              className="categoryBlock"
            >
              <h2 className="categoryTitle">{category}</h2>

              <div className="foodGrid">
                {menuItems
                  .filter(i => i.category === category)
                  .map(item => (
                    <div key={item.id} className="foodCard">
                      <h3>{item.name}</h3>
                      <p>₹{item.price}</p>
                      <button onClick={() => addToCart(item)}>
                        ADD
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          ))}

        </div>

        {/* CART */}
        <div className="cartBox">
          <h2>🛒 Cart</h2>

          {cart.map(c => (
            <div key={c.id}>
              {c.name} × {c.quantity}
            </div>
          ))}

          <h3>Total: ₹{getTotal()}</h3>

          <button className="placeOrderBtn" onClick={placeOrder}>
            Place Order
          </button>
        </div>

      </div>

      {/* ARROWS */}
      <div className="arrowContainer">

        {currentIndex > 0 && (
          <button className="upArrow" onClick={scrollToPrev}>
            ↑
          </button>
        )}

        {currentIndex < categories.length - 1 && (
          <button className="downArrow" onClick={scrollToNext}>
            ↓
          </button>
        )}

      </div>

    </div>
  );
}

export default CustomerMenu;
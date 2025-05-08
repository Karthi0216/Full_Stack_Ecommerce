import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../../Context/ShopContext";
import { backend_url, currency } from "../../App";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, CreditCard, Truck, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import OrderHistory from "./OrderHistory";
import "./Checkout.css";

const Checkout = () => {
  const { products, cartItems, getTotalCartAmount, clearCart } = useContext(ShopContext);
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const navigate = useNavigate();

  const handlePlaceOrder = () => {
    const newOrderedItems = products
      .filter((item) => cartItems[item.id] > 0)
      .map((item) => ({
        id: item.id,
        name: item.name,
        image: item.image,
        price: item.new_price,
        quantity: cartItems[item.id],
        total: item.new_price * cartItems[item.id],
      }));

    if (newOrderedItems.length === 0) {
      alert("Your cart is empty. Add items before placing an order.");
      return;
    }

    // Create Order Object
    const newOrder = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      paymentMethod,
      totalAmount: getTotalCartAmount(),
      items: newOrderedItems,
    };

    // Save to localStorage
    const existingOrders = JSON.parse(localStorage.getItem("orderHistory")) || [];
    const updatedOrders = [...existingOrders, newOrder];
    localStorage.setItem("orderHistory", JSON.stringify(updatedOrders));

    // Clear cart after order placement
    if (typeof clearCart === "function") {
      clearCart();
    } else {
      console.error("clearCart is not defined or not a function");
    }

    setShowOrderHistory(true);
    alert(`Order placed successfully! Payment: ${paymentMethod}`);
    navigate("/order-history");
  };

  return (
    <motion.div 
      className="checkout"
      initial={{ opacity: 0, y: -20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
    >
      <h2><ShoppingCart size={28} /> Review Your Order</h2>

      <div className="checkout-items">
        {products.map((item) =>
          cartItems[item.id] > 0 ? (
            <motion.div key={item.id} className="checkout-item"
              initial={{ opacity: 0, scale: 0.8 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 0.3 }}
            >
              <img src={backend_url + item.image} alt={item.name} />
              <div>
                <h3>{item.name}</h3>
                <p>Price: {currency}{item.new_price}</p>
                <p>Quantity: {cartItems[item.id]}</p>
                <p>Total: {currency}{item.new_price * cartItems[item.id]}</p>
              </div>
            </motion.div>
          ) : null
        )}
      </div>

      <div className="payment-method">
        <h3><CreditCard size={24} /> Select Payment Method</h3>
        {["Cash on Delivery", "Credit Card", "PayPal"].map((method) => (
          <motion.div key={method} className={`payment-option ${paymentMethod === method ? "selected" : ""}`}
            onClick={() => setPaymentMethod(method)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <input
              type="radio"
              value={method}
              checked={paymentMethod === method}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            {method}
          </motion.div>
        ))}
      </div>

      <div className="checkout-total">
        <h3><Truck size={24} /> Total Amount: {currency}{getTotalCartAmount()}</h3>
        <motion.button onClick={handlePlaceOrder} 
          whileHover={{ scale: 1.1 }} 
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <CheckCircle size={20} /> PLACE ORDER
        </motion.button>
      </div>

      {showOrderHistory && <OrderHistory />}
    </motion.div>
  );
};

export default Checkout;

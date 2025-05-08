import React, { useEffect, useState } from "react";
import { Clock, DollarSign, Package, Trash2, Home } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./OrderHistory.css";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("orderHistory")) || [];
    setOrders(storedOrders);
  }, []);

  // Function to delete a single order
  const deleteOrder = (orderId) => {
    const updatedOrders = orders.filter(order => order.id !== orderId);
    setOrders(updatedOrders);
    localStorage.setItem("orderHistory", JSON.stringify(updatedOrders));
  };

  return (
    <motion.div 
      className="order-history"
      initial={{ opacity: 0, y: -20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
    >
      <h2><Package size={28} /> Order History</h2>

      {orders.length === 0 ? (
        <p className="no-orders">No orders placed yet.</p>
      ) : (
        <>
          <motion.button 
            className="back-to-home-btn"
            onClick={() => navigate("/")}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Home size={20} /> Back to Home
          </motion.button>

          {orders.map((order) => (
            <motion.div key={order.id} className="order-card">
              <div className="order-header">
                <h3><Clock size={20} /> {order.date}</h3>
                <p><DollarSign size={20} /> Total: <strong>${order.totalAmount}</strong></p>
                <p>Payment: {order.paymentMethod}</p>
              </div>

              <div className="order-items">
                {order.items.map((item) => (
                  <div key={item.id} className="order-item">
                    <img src={item.image} alt={item.name} />
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p>Price: <strong>${item.price}</strong></p>
                      <p>Quantity: <strong>{item.quantity}</strong></p>
                      <p>Total: <strong>${item.total}</strong></p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delete Order Button */}
              <motion.button 
                className="delete-order-btn"
                onClick={() => deleteOrder(order.id)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Trash2 size={20} /> Delete Order
              </motion.button>
            </motion.div>
          ))}
        </>
      )}
    </motion.div>
  );
};

export default OrderHistory;

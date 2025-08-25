// context/NotificationContext.js
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import {
    FaBell,
    FaShoppingCart,
    FaEnvelope,
    FaExclamationTriangle,
    FaStar,
    FaCheckCircle,
    FaArchive,
    FaTrash,
    FaEye,
    FaTimes
  } from 'react-icons/fa';
  
export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/notifications");
    
        const notificationsArray = Array.isArray(res.data) ? res.data : [];

        const formatted = notificationsArray.map((notif) => {
          let type = "default";
          let title = "";
          let description = "";
          let icon = <FaBell />;
        
          const data = notif.data || {};
        
          switch (notif.type) {
            case "App\\Notifications\\OrderNotification":
              type = "order";
              const order = data.order_id ? data : data.message || {};
              title = `New Order #${order.order_id || order.id}`;
              description = order.items
                ? order.items.map(item => `Product: ${item.product}, Qty: ${item.quantity}, Total: $${item.total}`).join(" | ")
                : `Total: $${order.total || order.total_price || 0}, Status: ${order.status || "N/A"}`;
              icon = <FaShoppingCart />;
              break;
        
            case "App\\Notifications\\ReviewNotification":
              type = "review";
              const review = data.product_name ? data : data.message || {};
              title = `New Review on ${review.product_name || "product"}`;
              description = `Rating: ${review.rating || 0}, Review: ${review.review || "N/A"}`;
              icon = <FaStar />;
              break;
        
            case "App\\Notifications\\MessageNotification":
              type = "message";
              title = `New Message`;
              description = data.message || data.text || JSON.stringify(data);
              icon = <FaEnvelope />;
              break;
        
            case "App\\Notifications\\LowStockNotification":
              type = "low_stock";
              const lowStock = data.product_name ? data : data.message || {};
              title = `Low Stock Alert`;
              description = `${lowStock.product_name || "Unknown"} only has ${lowStock.stock ?? "N/A"} left`;
              icon = <FaExclamationTriangle />;
              break;
        
              
            default:
              description = JSON.stringify(data);
              icon = <FaBell />;
          }
        
          return {
            ...notif,
            type,
            title,
            description,
            icon,
            isRead: !!notif.read_at,
            date: notif.created_at,
          };
        });
        

    setNotifications(formatted);
  } catch (error) {
    console.error("Failed to load notifications", error);
  }
};
    
    fetchNotifications();
  }, []);
  

  // Mark single as read
  const markAsRead = async (id) => {
    try {
      await axios.post(`http://localhost:8000/api/notifications/read/${id}`);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, isRead: true } : notif
        )
      );
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await axios.post("http://localhost:8000/api/notifications/read-all");
      setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })));
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, setNotifications, markAsRead, markAllAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// context/SNotificationContext.js
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
export const SNotificationContext = createContext({
  notifications: [],
  setNotifications: () => {},
  markAsRead: () => {},
  markAllAsRead: () => {},
  loading: true,
  user: null,
});

export const SNotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // ✅ fetch logged-in seller first
  useEffect(() => {
    axios
      .get("http://localhost:8000/check-login", { withCredentials: true })
      .then((res) => {
        if (res.data.role === "S") {
          setUser(res.data.user); // seller info
        } else {
          setUser(null);
        }
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // ✅ fetch notifications only when user is loaded
  useEffect(() => {
    if (!user) return; // wait until user exists

    const fetchNotifications = async () => {
      try {
        const res = await axios.get("http://localhost:8000/notifications1");
        const formatted = res.data.map((notif) => {
            let type = "default";
            let title = "";
            let description = "";
            let icon = <FaBell />;
          console.log(user.admin_id);
            switch (notif.type) {
              case "App\\Notifications\\OrderNotification":
                type = "order";
                const sellerItem = notif.data.items?.find(
                  (item) => item.created_by === user.admin_id
                );
                if (!sellerItem) return null;
                title = `New Order #${notif.data.order_id}`;
                description = `Product: ${sellerItem.product}, Qty: ${sellerItem.quantity}, Total: $${sellerItem.total}`;
                icon = <FaShoppingCart />;
                break;
          
              case "App\\Notifications\\ReviewNotification":
                type = "review";
                if (notif.data.created_by !== user.admin_id) return null;
                title = `New Review on ${notif.data.product_name}`;
                description = `Rating: ${notif.data.rating}, Review: ${notif.data.review}`;
                icon = <FaStar />;
                break;
          
                case "App\\Notifications\\LowStockNotification":
                    type = "low_stock";
                    const lowStock = notif.data.message; // <-- use message here
                    if (lowStock.created_by !== user.admin_id) return null; // filter by creator
                    title = `Low Stock Alert`;
                    description = `${lowStock.product_name || "Unknown"} only has ${lowStock.stock ?? "N/A"} left`;
                    icon = <FaExclamationTriangle />;
                    break;
                    
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
          }).filter(Boolean);
          

        setNotifications(formatted);
      } catch (error) {
        console.error("Failed to load notifications", error);
      }
    };

    fetchNotifications();
  }, [user]);

  // ✅ mark single as read
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

  // ✅ mark all as read
  const markAllAsRead = async () => {
    try {
      await axios.post("http://localhost:8000/api/notifications/read-all");
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true }))
      );
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  };

  return (
    <SNotificationContext.Provider
      value={{
        notifications,
        setNotifications,
        markAsRead,
        markAllAsRead,
        loading,
        user,
      }}
    >
      {children}
    </SNotificationContext.Provider>
  );
};

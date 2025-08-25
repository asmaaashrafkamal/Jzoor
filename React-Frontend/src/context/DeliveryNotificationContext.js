import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { FaBell, FaEnvelope } from 'react-icons/fa';

export const DNotificationContext = createContext();

export const DNotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/notifications");

        const formatted = res.data
          .filter(notif => notif.type === "App\\Notifications\\MessageNotification") // only delivery/user messages
          .map((notif) => {
            return {
              ...notif,
              type: "message",
              title: `New Message`,
              description: notif.data.message.text || JSON.stringify(notif.data.message),
              icon: <FaEnvelope />,
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

  const markAsRead = async (id) => {
    try {
      await axios.post(`http://localhost:8000/api/notifications/read/${id}`);
      setNotifications(prev =>
        prev.map(notif => notif.id === id ? { ...notif, isRead: true } : notif)
      );
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.post("http://localhost:8000/api/notifications/read-all");
      setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  };

  return (
    <DNotificationContext.Provider
      value={{ notifications, setNotifications, markAsRead, markAllAsRead }}
    >
      {children}
    </DNotificationContext.Provider>
  );
};

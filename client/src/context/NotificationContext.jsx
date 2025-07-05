import { createContext, useState, useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';
import api from '../services/api';

// ✅ EXPORT this so other files can import it
export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    const fetchNotifications = async () => {
      try {
        const res = await api.get('/notifications');
        setNotifications(res.data);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      }
    };

    fetchNotifications();

    socket.on('notificationReceived', (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    socket.on('notificationRead', (id) => {
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    });

    return () => {
      socket.off('notificationReceived');
      socket.off('notificationRead');
    };
  }, [socket]);

  const markAsRead = async () => {
    try {
      await api.put('/notifications/mark-as-read');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const sendNotification = ({ recipientId, message, type, link }) => {
    if (socket) {
      socket.emit('sendNotification', { recipientId, message, type, link });
    }
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, markAsRead, sendNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

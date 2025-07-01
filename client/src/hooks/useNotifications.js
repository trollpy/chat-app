import { useState, useEffect, useContext, createContext } from 'react';
import { useSocket } from './useSocket';
import api from '../services/api';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    const fetchNotifications = async () => {
      try {
        const response = await api.get('/notifications');
        setNotifications(response.data);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      }
    };

    fetchNotifications();

    socket.on('notificationReceived', (notification) => {
      setNotifications(prev => [notification, ...prev]);
    });

    socket.on('notificationRead', (notificationId) => {
      setNotifications(prev => prev.map(n => 
        n._id === notificationId ? { ...n, read: true } : n
      ));
    });

    return () => {
      socket.off('notificationReceived');
      socket.off('notificationRead');
    };
  }, [socket]);

  const markAsRead = async () => {
    try {
      await api.put('/notifications/mark-as-read');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error('Failed to mark notifications as read:', err);
    }
  };

  const sendNotification = async ({ recipientId, message, type, link }) => {
    socket.emit('sendNotification', { 
      recipientId, 
      message, 
      type, 
      link 
    });
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        markAsRead,
        sendNotification
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  return useContext(NotificationContext);
};
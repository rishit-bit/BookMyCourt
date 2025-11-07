import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

const WebSocketContext = createContext();

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('bookmycourt_token');
    
    if (!token) {
      return;
    }

    // Initialize socket connection
    const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling']
    });

    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('🔌 WebSocket connected');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('🔌 WebSocket disconnected');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      setIsConnected(false);
    });

    // Real-time notification handler
    newSocket.on('new_notification', (notificationData) => {
      console.log('📢 New notification received:', notificationData);
      
      // Add to notifications list
      setNotifications(prev => [notificationData, ...prev]);
      
      // Update unread count
      setUnreadCount(prev => prev + 1);
      
      // Show toast notification
      toast.success(`New notification: ${notificationData.title}`, {
        duration: 5000,
        position: 'top-right'
      });
    });

    // Notification deleted handler - removes notification from all users
    newSocket.on('notification_deleted', (data) => {
      console.log('🗑️ Notification deleted:', data.notificationId);
      
      // Remove notification from user's list
      setNotifications(prev => {
        const filtered = prev.filter(notification => notification.id !== data.notificationId);
        // Update unread count if deleted notification was unread
        const deletedNotification = prev.find(n => n.id === data.notificationId);
        if (deletedNotification && !deletedNotification.isRead) {
          setUnreadCount(count => Math.max(0, count - 1));
        }
        return filtered;
      });
      
      // Show toast to inform user
      toast('Notification has been removed', {
        duration: 3000,
        position: 'top-right',
        icon: '🗑️'
      });
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, []);

  // Function to mark notification as read
  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Function to mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
    setUnreadCount(0);
  };

  // Function to clear notifications
  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const value = {
    socket,
    isConnected,
    notifications,
    unreadCount,
    markNotificationAsRead,
    markAllAsRead,
    clearNotifications
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

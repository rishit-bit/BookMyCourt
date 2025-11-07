import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useWebSocket } from '../contexts/WebSocketContext';
import {
  Bell,
  X,
  CheckCircle,
  Clock
} from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const PopupOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  padding-top: 60px;
  overflow-y: auto;
`;

const PopupContainer = styled(motion.div)`
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border: 2px solid rgba(79, 70, 229, 0.3);
  border-radius: 16px;
  padding: 24px;
  max-width: 600px;
  width: 100%;
  max-height: 70vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  margin-top: 20px;
`;

const PopupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(75, 85, 99, 0.3);
`;

const PopupTitle = styled.h2`
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
`;

const CloseButton = styled(motion.button)`
  background: rgba(75, 85, 99, 0.3);
  border: none;
  border-radius: 12px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #9ca3af;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(239, 68, 68, 0.2);
    color: #ef4444;
  }
`;

const NotificationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
`;

const NotificationItem = styled(motion.div)`
  background: rgba(31, 41, 55, 0.4);
  border: 1px solid rgba(75, 85, 99, 0.2);
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    border-color: #4F46E5;
    background: rgba(79, 70, 229, 0.05);
  }
`;

const NotificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const NotificationTitle = styled.h3`
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  flex: 1;
`;


const NotificationMessage = styled.p`
  color: #9ca3af;
  font-size: 0.9rem;
  margin: 0 0 12px 0;
  line-height: 1.5;
`;

const NotificationMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: #6b7280;
`;

const NotificationDate = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const MarkAsReadButton = styled(motion.button)`
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
  border: none;
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(16, 185, 129, 0.3);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #9ca3af;
`;


const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid rgba(75, 85, 99, 0.3);
`;

const ActionButton = styled(motion.button)`
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  
  ${props => {
    switch(props.variant) {
      case 'primary':
        return `
          background: linear-gradient(135deg, #4F46E5, #2563EB);
          color: white;
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(79, 70, 229, 0.3);
          }
        `;
      case 'secondary':
        return `
          background: rgba(75, 85, 99, 0.3);
          color: #9ca3af;
          &:hover {
            background: rgba(75, 85, 99, 0.5);
          }
        `;
      default:
        return `
          background: rgba(75, 85, 99, 0.3);
          color: #9ca3af;
          &:hover {
            background: rgba(75, 85, 99, 0.5);
          }
        `;
    }
  }}
`;

const NotificationPopup = ({ isOpen, onClose, onMarkAsRead }) => {
  const { notifications, unreadCount, markNotificationAsRead, markAllAsRead } = useWebSocket();

  // WebSocket context provides real-time notifications
  // No need to fetch manually

  const handleMarkAsRead = async (notificationId) => {
    if (!notificationId) {
      toast.error('Invalid notification ID');
      return;
    }

    try {
      // Ensure notificationId is a string
      const id = String(notificationId);
      
      const response = await axios.put(`${API_BASE_URL}/notifications/${id}/read`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('bookmycourt_token')}`
        }
      });

      if (response.data.success) {
        // Update WebSocket context
        markNotificationAsRead(id);
        
        if (onMarkAsRead) {
          onMarkAsRead();
        }
        
        toast.success('Notification marked as read');
      }
    } catch (error) {
      console.error('Mark as read error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to mark notification as read';
      toast.error(errorMessage);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await axios.put(`${API_BASE_URL}/notifications/read-all`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('bookmycourt_token')}`
        }
      });

      if (response.data.success) {
        // Update WebSocket context
        markAllAsRead();
        
        if (onMarkAsRead) {
          onMarkAsRead();
        }
        
        toast.success('All notifications marked as read');
      }
    } catch (error) {
      console.error('Mark all as read error:', error);
      toast.error('Failed to mark all notifications as read');
    }
  };


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <PopupOverlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <PopupContainer
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 50 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
        >
          <PopupHeader>
            <PopupTitle>
              <Bell size={24} color="#4F46E5" />
              Notifications
              {unreadCount > 0 && (
                <span style={{
                  background: '#ef4444',
                  color: 'white',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  fontWeight: '600',
                  marginLeft: '8px'
                }}>
                  {unreadCount}
                </span>
              )}
            </PopupTitle>
            <CloseButton
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={20} />
            </CloseButton>
          </PopupHeader>

          {notifications.length === 0 ? (
            <EmptyState>
              <Bell size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
              <div>No new notifications</div>
              <div style={{ fontSize: '0.9rem', marginTop: '8px', opacity: 0.7 }}>
                You're all caught up!
              </div>
            </EmptyState>
          ) : (
            <>
              <NotificationList>
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <NotificationHeader>
                      <NotificationTitle>{notification.title}</NotificationTitle>
                    </NotificationHeader>

                    <NotificationMessage>{notification.message}</NotificationMessage>

                    <NotificationMeta>
                      <NotificationDate>
                        <Clock size={14} />
                        {formatDate(notification.createdAt)}
                      </NotificationDate>
                      <MarkAsReadButton
                        onClick={() => handleMarkAsRead(notification.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <CheckCircle size={14} />
                        Mark as Read
                      </MarkAsReadButton>
                    </NotificationMeta>
                  </NotificationItem>
                ))}
              </NotificationList>

              <ActionButtons>
                <ActionButton
                  variant="secondary"
                  onClick={onClose}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Close
                </ActionButton>
                {notifications.length > 0 && (
                  <ActionButton
                    variant="primary"
                    onClick={handleMarkAllAsRead}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <CheckCircle size={16} />
                    Mark All as Read
                  </ActionButton>
                )}
              </ActionButtons>
            </>
          )}
        </PopupContainer>
      </PopupOverlay>
    </AnimatePresence>
  );
};

export default NotificationPopup;

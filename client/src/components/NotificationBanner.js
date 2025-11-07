import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useWebSocket } from '../contexts/WebSocketContext';
import {
  Bell,
  X,
  CheckCircle
} from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const BannerContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-bottom: 2px solid rgba(79, 70, 229, 0.3);
  z-index: 1000;
  padding: 16px 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
`;

const BannerContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const BannerLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
`;

const NotificationIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #4F46E5, #2563EB);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const NotificationInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const NotificationTitle = styled.h3`
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const NotificationMessage = styled.p`
  color: #9ca3af;
  font-size: 0.9rem;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const NotificationCount = styled.div`
  background: #ef4444;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 600;
  margin-left: 8px;
`;

const BannerRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ViewButton = styled(motion.button)`
  padding: 8px 16px;
  background: linear-gradient(135deg, #4F46E5, #2563EB);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
  }
`;

const CloseButton = styled(motion.button)`
  background: rgba(75, 85, 99, 0.3);
  border: none;
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #9ca3af;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(239, 68, 68, 0.2);
    color: #ef4444;
  }
`;

const NotificationBanner = ({ isOpen, onClose, onViewNotifications }) => {
  const { notifications, unreadCount, markNotificationAsRead } = useWebSocket();

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
        toast.success('Notification marked as read');
      }
    } catch (error) {
      console.error('Mark as read error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to mark notification as read';
      toast.error(errorMessage);
    }
  };

  if (!isOpen || notifications.length === 0) return null;

  const latestNotification = notifications[0];

  return (
    <AnimatePresence>
      <BannerContainer
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -100 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <BannerContent>
          <BannerLeft>
            <NotificationIcon>
              <Bell size={20} color="white" />
            </NotificationIcon>
            <NotificationInfo>
              <NotificationTitle>{latestNotification.title}</NotificationTitle>
              <NotificationMessage>{latestNotification.message}</NotificationMessage>
            </NotificationInfo>
            {unreadCount > 1 && (
              <NotificationCount>
                {unreadCount}
              </NotificationCount>
            )}
          </BannerLeft>

          <BannerRight>
            <ViewButton
              onClick={onViewNotifications}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bell size={16} />
              View All
            </ViewButton>
            
            <ViewButton
              onClick={() => handleMarkAsRead(latestNotification.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}
            >
              <CheckCircle size={16} />
              Mark Read
            </ViewButton>

            <CloseButton
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={18} />
            </CloseButton>
          </BannerRight>
        </BannerContent>
      </BannerContainer>
    </AnimatePresence>
  );
};

export default NotificationBanner;

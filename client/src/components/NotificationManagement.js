import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  Bell,
  Send,
  CheckCircle,
  Trash2,
  Eye,
  EyeOff,
  RefreshCw
} from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  padding: 20px;
  
  @media (max-width: 768px) {
    padding: 15px;
  }
  
  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;
  
  @media (max-width: 768px) {
    margin-bottom: 24px;
    flex-direction: column;
    align-items: flex-start;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 20px;
  }
`;

const HeaderTitle = styled.h1`
  color: #ffffff;
  font-size: 2rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 12px;
  
  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
    gap: 8px;
  }
`;

const ActionButton = styled(motion.button)`
  padding: 12px 24px;
  background: linear-gradient(135deg, #4F46E5, #2563EB);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  white-space: nowrap;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(79, 70, 229, 0.3);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
  
  @media (max-width: 1200px) {
    display: none;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
    margin-bottom: 24px;
  }
  
  @media (max-width: 480px) {
    gap: 12px;
    margin-bottom: 20px;
  }
`;

const StatCard = styled(motion.div)`
  background: rgba(31, 41, 55, 0.6);
  border: 1px solid rgba(75, 85, 99, 0.3);
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #4F46E5;
    background: rgba(79, 70, 229, 0.1);
    transform: translateY(-2px);
  }
  
  @media (max-width: 768px) {
    padding: 20px;
  }
  
  @media (max-width: 480px) {
    padding: 16px;
    border-radius: 12px;
  }
`;

const StatIcon = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #4F46E5, #2563EB);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  color: #9ca3af;
  font-size: 0.9rem;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 32px;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  @media (max-width: 768px) {
    gap: 20px;
  }
  
  @media (max-width: 480px) {
    gap: 16px;
  }
`;

const NotificationsList = styled.div`
  background: rgba(17, 24, 39, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 32px;
  border: 1px solid rgba(79, 70, 229, 0.2);
  box-shadow: 0 25px 50px rgba(0,0,0,0.4);
  
  @media (max-width: 768px) {
    padding: 24px;
    border-radius: 20px;
  }
  
  @media (max-width: 480px) {
    padding: 16px;
    border-radius: 16px;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  
  @media (max-width: 480px) {
    margin-bottom: 16px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 12px;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
    gap: 8px;
  }
`;

const SearchBar = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 8px;
    margin-bottom: 16px;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  background: rgba(31, 41, 55, 0.6);
  border: 1px solid rgba(75, 85, 99, 0.3);
  border-radius: 12px;
  color: #ffffff;
  font-size: 0.9rem;
  
  &::placeholder {
    color: #9ca3af;
  }
  
  &:focus {
    outline: none;
    border-color: #4F46E5;
  }
`;

const FilterSelect = styled.select`
  padding: 12px 16px;
  background: rgba(31, 41, 55, 0.6);
  border: 1px solid rgba(75, 85, 99, 0.3);
  border-radius: 12px;
  color: #ffffff;
  font-size: 0.9rem;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #4F46E5;
  }
`;

const NotificationCard = styled(motion.div)`
  background: rgba(31, 41, 55, 0.4);
  border: 1px solid rgba(75, 85, 99, 0.2);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    border-color: #4F46E5;
    background: rgba(79, 70, 229, 0.05);
  }
  
  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 12px;
  }
  
  @media (max-width: 480px) {
    padding: 12px;
    margin-bottom: 12px;
  }
`;

const NotificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  
  @media (max-width: 480px) {
    margin-bottom: 8px;
  }
`;

const NotificationTitle = styled.h3`
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  flex: 1;
  word-break: break-word;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.95rem;
  }
`;


const NotificationMessage = styled.p`
  color: #9ca3af;
  font-size: 0.9rem;
  margin: 0 0 12px 0;
  line-height: 1.5;
  word-break: break-word;
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
    margin-bottom: 8px;
  }
`;

const NotificationMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: #6b7280;
  flex-wrap: wrap;
  gap: 8px;
  
  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
`;

const NotificationActions = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  
  @media (max-width: 480px) {
    width: 100%;
    gap: 6px;
  }
`;

const ActionBtn = styled.button`
  padding: 6px 12px;
  border: none;
  border-radius: 8px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
  
  @media (max-width: 480px) {
    padding: 6px 10px;
    font-size: 0.75rem;
    flex: 1;
    justify-content: center;
  }
  
  ${props => {
    switch(props.variant) {
      case 'success':
        return `
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
          &:hover { background: rgba(16, 185, 129, 0.3); }
        `;
      case 'danger':
        return `
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
          &:hover { background: rgba(239, 68, 68, 0.3); }
        `;
      case 'warning':
        return `
          background: rgba(245, 158, 11, 0.2);
          color: #f59e0b;
          &:hover { background: rgba(245, 158, 11, 0.3); }
        `;
      default:
        return `
          background: rgba(75, 85, 99, 0.2);
          color: #9ca3af;
          &:hover { background: rgba(75, 85, 99, 0.3); }
        `;
    }
  }}
`;

const SendNotificationForm = styled.div`
  background: rgba(17, 24, 39, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 32px;
  border: 1px solid rgba(79, 70, 229, 0.2);
  box-shadow: 0 25px 50px rgba(0,0,0,0.4);
  height: fit-content;
  position: sticky;
  top: 20px;
  
  @media (max-width: 1200px) {
    position: relative;
    top: 0;
  }
  
  @media (max-width: 768px) {
    padding: 24px;
    border-radius: 20px;
  }
  
  @media (max-width: 480px) {
    padding: 16px;
    border-radius: 16px;
  }
`;

const FormTitle = styled.h3`
  color: #ffffff;
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
    margin-bottom: 20px;
  }
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
    margin-bottom: 16px;
    gap: 8px;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  
  @media (max-width: 480px) {
    margin-bottom: 16px;
  }
`;

const Label = styled.label`
  display: block;
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  background: rgba(31, 41, 55, 0.6);
  border: 1px solid rgba(75, 85, 99, 0.3);
  border-radius: 12px;
  color: #ffffff;
  font-size: 0.9rem;
  
  &::placeholder {
    color: #9ca3af;
  }
  
  &:focus {
    outline: none;
    border-color: #4F46E5;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  background: rgba(31, 41, 55, 0.6);
  border: 1px solid rgba(75, 85, 99, 0.3);
  border-radius: 12px;
  color: #ffffff;
  font-size: 0.9rem;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  
  &::placeholder {
    color: #9ca3af;
  }
  
  &:focus {
    outline: none;
    border-color: #4F46E5;
  }
`;



const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 14px 24px;
  background: linear-gradient(135deg, #4F46E5, #2563EB);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(79, 70, 229, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoadingSpinner = styled(motion.div)`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid #ffffff;
  border-radius: 50%;
`;

const NotificationManagement = () => {
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({
    totalNotifications: 0,
    activeNotifications: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    message: ''
  });

  const fetchNotifications = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.append('status', filterStatus);
      
      const response = await axios.get(`${API_BASE_URL}/notifications?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('bookmycourt_token')}`
        }
      });

      if (response.data.success) {
        setNotifications(response.data.data.notifications);
      }
      return response;
    } catch (error) {
      console.error('Fetch notifications error:', error);
      toast.error('Failed to fetch notifications');
      throw error;
    }
  }, [filterStatus]);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([fetchNotifications(), fetchStats()]).finally(() => {
      setIsLoading(false);
    });
  }, [fetchNotifications]);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/notifications/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('bookmycourt_token')}`
        }
      });

      if (response.data.success) {
        setStats(response.data.data.overview);
      }
    } catch (error) {
      console.error('Fetch stats error:', error);
    }
  };


  const handleSendNotification = async () => {
    if (!formData.title || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate form data
    if (formData.title.trim().length === 0 || formData.message.trim().length === 0) {
      toast.error('Title and message cannot be empty');
      return;
    }

    setIsSending(true);
    try {
      const token = localStorage.getItem('bookmycourt_token');
      
      if (!token) {
        toast.error('Authentication required. Please login again.');
        setIsSending(false);
        return;
      }

      const response = await axios.post(`${API_BASE_URL}/notifications`, {
        title: formData.title.trim(),
        message: formData.message.trim()
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        toast.success('Notification sent to all users successfully!');
        setFormData({
          title: '',
          message: ''
        });
        fetchNotifications();
        fetchStats();
      } else {
        toast.error(response.data.message || 'Failed to send notification');
      }
    } catch (error) {
      console.error('Send notification error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to send notification';
      toast.error(errorMessage);
      
      // Log more details for debugging
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleToggleNotificationStatus = async (notificationId, currentStatus) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/notifications/${notificationId}/status`, {
        isActive: !currentStatus
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('bookmycourt_token')}`
        }
      });

      if (response.data.success) {
        toast.success(`Notification ${!currentStatus ? 'activated' : 'deactivated'}`);
        fetchNotifications();
        fetchStats();
      }
    } catch (error) {
      console.error('Toggle notification status error:', error);
      toast.error('Failed to update notification status');
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) {
      return;
    }

    try {
      const response = await axios.delete(`${API_BASE_URL}/notifications/${notificationId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('bookmycourt_token')}`
        }
      });

      if (response.data.success) {
        toast.success('Notification deleted successfully');
        fetchNotifications();
        fetchStats();
      }
    } catch (error) {
      console.error('Delete notification error:', error);
      toast.error('Failed to delete notification');
    }
  };


  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });


  return (
    <Container>
      <Header>
        <HeaderTitle>
          <Bell size={32} color="#4F46E5" />
          Notification Management
        </HeaderTitle>
        <ActionButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={async () => {
            setIsLoading(true);
            try {
              await Promise.all([fetchNotifications(), fetchStats()]);
            } catch (error) {
              console.error('Refresh error:', error);
            } finally {
              setIsLoading(false);
            }
          }}
          disabled={isLoading}
          style={{ 
            background: 'rgba(75, 85, 99, 0.2)', 
            border: '1px solid rgba(75, 85, 99, 0.3)'
          }}
        >
          <RefreshCw size={20} />
          Refresh
        </ActionButton>
      </Header>

      <StatsGrid>
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <StatIcon>
            <Bell size={24} color="white" />
          </StatIcon>
          <StatValue>{stats.totalNotifications}</StatValue>
          <StatLabel>Total Notifications</StatLabel>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <StatIcon>
            <CheckCircle size={24} color="white" />
          </StatIcon>
          <StatValue>{stats.activeNotifications}</StatValue>
          <StatLabel>Active Notifications</StatLabel>
        </StatCard>

      </StatsGrid>

      <ContentGrid>
        <NotificationsList>
          <SectionHeader>
            <SectionTitle>
              <Bell size={24} color="#4F46E5" />
              Notifications
            </SectionTitle>
          </SectionHeader>

          <SearchBar>
            <SearchInput
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FilterSelect
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
            </FilterSelect>
          </SearchBar>

          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
              <LoadingSpinner
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <div style={{ marginTop: '12px' }}>Loading notifications...</div>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
              <Bell size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
              <div>No notifications found</div>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <NotificationCard
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
                  <div>
                    <strong>Sent to:</strong> All Users
                    <span style={{ margin: '0 8px' }}>•</span>
                    <strong>Sent:</strong> {new Date(notification.createdAt).toLocaleDateString()}
                  </div>
                  <NotificationActions>
                    <ActionBtn
                      variant={notification.isActive ? 'warning' : 'success'}
                      onClick={() => handleToggleNotificationStatus(notification.id, notification.isActive)}
                    >
                      {notification.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                      {notification.isActive ? 'Deactivate' : 'Activate'}
                    </ActionBtn>
                    <ActionBtn
                      variant="danger"
                      onClick={() => handleDeleteNotification(notification.id)}
                    >
                      <Trash2 size={14} />
                      Delete
                    </ActionBtn>
                  </NotificationActions>
                </NotificationMeta>
              </NotificationCard>
            ))
          )}
        </NotificationsList>

        <SendNotificationForm>
          <FormTitle>
            <Send size={24} color="#4F46E5" />
            Send Notification
          </FormTitle>

          <FormGroup>
            <Label>Title *</Label>
            <Input
              type="text"
              placeholder="Enter notification title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />
          </FormGroup>

          <FormGroup>
            <Label>Message *</Label>
            <TextArea
              placeholder="Enter notification message"
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
            />
          </FormGroup>




          <SubmitButton
            onClick={handleSendNotification}
            disabled={isSending}
            whileHover={{ scale: isSending ? 1 : 1.02 }}
            whileTap={{ scale: isSending ? 1 : 0.98 }}
          >
            {isSending ? (
              <>
                <LoadingSpinner
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                Sending...
              </>
            ) : (
              <>
                <Send size={20} />
                Send Notification
              </>
            )}
          </SubmitButton>
        </SendNotificationForm>
      </ContentGrid>
    </Container>
  );
};

export default NotificationManagement;

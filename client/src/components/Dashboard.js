import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Trophy, 
  Calendar, 
  MapPin, 
  Clock, 
  Star, 
  Settings, 
  LogOut,
  Bell,
  Plus,
  Activity,
  Target,
  User,
  BookOpen,
  Shield,
  TrendingUp,
  CheckCircle,
  X,
  RefreshCw
} from 'lucide-react';
import Logo from './Logo';
import NotificationPopup from './NotificationPopup';
import NotificationBanner from './NotificationBanner';
import { useWebSocket } from '../contexts/WebSocketContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Container = styled.div`
  width: 100vw;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  position: relative;
  overflow: hidden;
`;

const Background = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 20%, rgba(79, 70, 229, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(37, 99, 235, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 60%, rgba(99, 102, 241, 0.05) 0%, transparent 50%);
  pointer-events: none;
`;

const FloatingElements = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
`;

const FloatingElement = styled(motion.div)`
  position: absolute;
  background: rgba(79, 70, 229, 0.1);
  border-radius: 50%;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(79, 70, 229, 0.2);
`;

const Header = styled.header`
  position: relative;
  z-index: 10;
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(17, 24, 39, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(79, 70, 229, 0.2);
  
  @media (max-width: 768px) {
    padding: 15px 20px;
    flex-wrap: wrap;
    gap: 15px;
  }
  
  @media (max-width: 480px) {
    padding: 10px 15px;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const WelcomeText = styled.div`
  color: #9ca3af;
  font-size: 0.9rem;
  margin-left: 16px;
`;

const UserName = styled.span`
  color: #ffffff;
  font-weight: 600;
`;

const ProfilePhoto = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba(79, 70, 229, 0.3);
  background: rgba(31, 41, 55, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const DefaultAvatar = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4F46E5, #2563EB);
  color: white;
  font-size: 1.2rem;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const IconButton = styled(motion.button)`
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 12px;
  background: rgba(79, 70, 229, 0.2);
  color: #a5b4fc;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(79, 70, 229, 0.3);
    color: #ffffff;
    transform: translateY(-2px);
  }
`;

const MainContent = styled.main`
  position: relative;
  z-index: 2;
  padding: 40px;
  max-width: 1400px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 20px;
  }
  
  @media (max-width: 480px) {
    padding: 15px;
  }
`;

const WelcomeSection = styled(motion.div)`
  background: rgba(17, 24, 39, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 40px;
  margin-bottom: 40px;
  border: 1px solid rgba(79, 70, 229, 0.2);
  box-shadow: 0 25px 50px rgba(0,0,0,0.4);
`;

const WelcomeTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #ffffff, #a5b4fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
`;

const WelcomeSubtitle = styled.p`
  color: #9ca3af;
  font-size: 1.1rem;
  margin-bottom: 32px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 16px;
    margin-bottom: 30px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
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

const Section = styled(motion.div)`
  background: rgba(17, 24, 39, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 32px;
  margin-bottom: 32px;
  border: 1px solid rgba(79, 70, 229, 0.2);
  box-shadow: 0 25px 50px rgba(0,0,0,0.4);
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 12px;
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
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(79, 70, 229, 0.3);
  }
`;

const SportsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
`;

const SportCard = styled(motion.div)`
  background: rgba(31, 41, 55, 0.6);
  border: 1px solid rgba(75, 85, 99, 0.3);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #4F46E5;
    background: rgba(79, 70, 229, 0.1);
    transform: translateY(-2px);
  }
`;

const SportIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 12px;
`;

const SportName = styled.div`
  color: #ffffff;
  font-weight: 600;
  font-size: 0.9rem;
`;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const QuickActionCard = styled(motion.div)`
  background: rgba(31, 41, 55, 0.6);
  border: 1px solid rgba(75, 85, 99, 0.3);
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #4F46E5;
    background: rgba(79, 70, 229, 0.1);
    transform: translateY(-2px);
  }
`;

const QuickActionIcon = styled.div`
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #4F46E5, #2563EB);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`;

const QuickActionTitle = styled.div`
  color: #ffffff;
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 8px;
`;

const QuickActionDescription = styled.div`
  color: #9ca3af;
  font-size: 0.9rem;
`;

const RecentBookingsSection = styled(motion.div)`
  background: rgba(17, 24, 39, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 32px;
  margin-bottom: 32px;
  border: 1px solid rgba(79, 70, 229, 0.2);
  box-shadow: 0 25px 50px rgba(0,0,0,0.4);
`;

const BookingCard = styled(motion.div)`
  background: rgba(31, 41, 55, 0.6);
  border: 1px solid rgba(75, 85, 99, 0.3);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    border-color: #4F46E5;
    background: rgba(79, 70, 229, 0.1);
    transform: translateY(-2px);
  }
`;

const BookingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const BookingTitle = styled.h4`
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatusBadge = styled.span`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  ${props => {
    switch (props.status) {
      case 'confirmed':
        return `
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.3);
        `;
      case 'pending':
        return `
          background: rgba(245, 158, 11, 0.2);
          color: #f59e0b;
          border: 1px solid rgba(245, 158, 11, 0.3);
        `;
      case 'cancelled':
        return `
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
        `;
      case 'completed':
        return `
          background: rgba(79, 70, 229, 0.2);
          color: #4f46e5;
          border: 1px solid rgba(79, 70, 229, 0.3);
        `;
      default:
        return `
          background: rgba(75, 85, 99, 0.2);
          color: #9ca3af;
          border: 1px solid rgba(75, 85, 99, 0.3);
        `;
    }
  }}
`;

const BookingDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 12px;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #9ca3af;
  font-size: 0.85rem;
`;

const BookingAmount = styled.div`
  color: #10b981;
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 12px;
`;

const BookingActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

const BookingActionButton = styled(motion.button)`
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.3s ease;
  
  ${props => props.$primary ? `
    background: linear-gradient(135deg, #4F46E5, #2563EB);
    color: white;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 15px rgba(79, 70, 229, 0.3);
    }
  ` : props.$danger ? `
    background: rgba(239, 68, 68, 0.2);
    color: #fca5a5;
    border: 1px solid rgba(239, 68, 68, 0.3);
    
    &:hover {
      background: rgba(239, 68, 68, 0.3);
      color: #ffffff;
    }
  ` : `
    background: rgba(75, 85, 99, 0.2);
    color: #9ca3af;
    border: 1px solid rgba(75, 85, 99, 0.3);
    
    &:hover {
      background: rgba(75, 85, 99, 0.3);
      color: #ffffff;
    }
  `}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #9ca3af;
`;

const EmptyIcon = styled.div`
  width: 60px;
  height: 60px;
  background: rgba(79, 70, 229, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
`;

const LoadingSpinner = styled(motion.div)`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid #ffffff;
  border-radius: 50%;
`;

const NotificationBadge = styled.div`
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 600;
`;


const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBookings: 0,
    confirmedBookings: 0,
    cancelledBookings: 0,
    totalSpent: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [showNotificationBanner, setShowNotificationBanner] = useState(false);
  const [hasShownNotifications, setHasShownNotifications] = useState(false);
  
  // WebSocket context
  const { unreadCount, isConnected } = useWebSocket();

  // Fetch user statistics and recent bookings
  useEffect(() => {
    fetchUserStats();
    fetchRecentBookings();
  }, []);

  // Check for real-time notifications and show banner
  useEffect(() => {
    if (unreadCount > 0 && !hasShownNotifications && isConnected) {
      // Small delay to ensure dashboard is fully loaded
      const timer = setTimeout(() => {
        setShowNotificationBanner(true);
        setHasShownNotifications(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [unreadCount, hasShownNotifications, isConnected]);

  const fetchUserStats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/bookings/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('bookmycourt_token')}`
        }
      });

      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const fetchRecentBookings = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/bookings`, {
        params: { page: 1, limit: 3 },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('bookmycourt_token')}`
        }
      });

      if (response.data.success) {
        setRecentBookings(response.data.data.bookings);
        // Count pending bookings for notifications
        // WebSocket handles notification count automatically
      }
    } catch (error) {
      console.error('Error fetching recent bookings:', error);
    } finally {
      setIsLoadingBookings(false);
    }
  };

  const handleNotificationMarkAsRead = () => {
    // WebSocket context handles notification updates automatically
    // No need to manually refresh
  };

  const handleShowNotifications = () => {
    setShowNotificationPopup(true);
  };

  const handleViewNotifications = () => {
    setShowNotificationBanner(false);
    setShowNotificationPopup(true);
  };

  const handleCloseBanner = () => {
    setShowNotificationBanner(false);
  };

  const handleBookingAction = async (bookingId, action) => {
    try {
      const endpoint = action === 'confirm' ? 'confirm' : 'cancel';
      const response = await axios.put(`${API_BASE_URL}/bookings/${bookingId}/${endpoint}`, {
        ...(action === 'confirm' ? { paymentStatus: 'paid' } : { cancellationReason: 'Cancelled by user' })
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('bookmycourt_token')}`
        }
      });

      if (response.data.success) {
        toast.success(`Booking ${action === 'confirm' ? 'confirmed' : 'cancelled'} successfully!`);
        fetchRecentBookings(); // Refresh the list
        fetchUserStats(); // Refresh stats
      }
    } catch (error) {
      console.error(`Error ${action}ing booking:`, error);
      const errorMessage = error.response?.data?.message || `Failed to ${action} booking`;
      toast.error(errorMessage);
    }
  };

  const handleBookCourt = () => {
    window.location.href = '/courts';
  };


  const [sports, setSports] = useState([]);

  // Fetch sports data
  useEffect(() => {
    fetchSports();
  }, []);

  const fetchSports = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/sports`);
      if (response.data.success) {
        setSports(response.data.data.sports);
      }
    } catch (error) {
      console.error('Error fetching sports:', error);
    }
  };

  const quickActions = [
    {
      title: 'Book a Court',
      description: 'Find and book your favorite sports court',
      icon: <Calendar size={24} color="white" />,
      action: handleBookCourt
    },
    {
      title: 'Find Courts',
      description: 'Discover courts near your location',
      icon: <MapPin size={24} color="white" />,
      action: () => window.location.href = '/courts'
    },
    {
      title: 'My Bookings',
      description: 'View and manage your bookings',
      icon: <BookOpen size={24} color="white" />,
      action: () => navigate('/my-bookings')
    },
    {
      title: 'Edit Profile',
      description: 'Update your personal information',
      icon: <Settings size={24} color="white" />,
      action: () => window.location.href = '/profile'
    },
    ...(user?.role === 'admin' ? [{
      title: 'Admin Panel',
      description: 'Manage courts, bookings, and users',
      icon: <Shield size={24} color="white" />,
      action: () => window.location.href = '/admin'
    }] : [])
  ];

  const userSports = user?.preferences?.favoriteSports || [];

  return (
    <Container>
      <Background />
      <FloatingElements>
        <FloatingElement
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            width: 200,
            height: 200,
            top: '10%',
            left: '10%',
          }}
        />
        <FloatingElement
          animate={{
            x: [0, -80, 0],
            y: [0, 80, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            width: 150,
            height: 150,
            top: '60%',
            right: '10%',
          }}
        />
        <FloatingElement
          animate={{
            x: [0, 60, 0],
            y: [0, -60, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            width: 100,
            height: 100,
            top: '30%',
            right: '20%',
          }}
        />
      </FloatingElements>

      <Header>
        <LogoContainer>
          <Logo />
          <ProfilePhoto>
            {user?.profilePhoto ? (
              <ProfileImage 
                src={user.profilePhoto.startsWith('http') ? user.profilePhoto : `http://localhost:5000${user.profilePhoto}`} 
                alt="Profile" 
              />
            ) : (
              <DefaultAvatar>
                <User size={20} />
              </DefaultAvatar>
            )}
          </ProfilePhoto>
          <WelcomeText>
            Welcome back, <UserName>{user?.firstName || 'User'}</UserName>!
          </WelcomeText>
        </LogoContainer>
        
        <HeaderActions>
          <IconButton 
            whileHover={{ scale: 1.1 }} 
            whileTap={{ scale: 0.9 }} 
            style={{ position: 'relative' }}
            onClick={handleShowNotifications}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <NotificationBadge>{unreadCount}</NotificationBadge>
            )}
          </IconButton>
          <IconButton 
            whileHover={{ scale: 1.1 }} 
            whileTap={{ scale: 0.9 }}
            onClick={() => window.location.href = '/profile'}
          >
            <Settings size={20} />
          </IconButton>
          <IconButton 
            whileHover={{ scale: 1.1 }} 
            whileTap={{ scale: 0.9 }}
            onClick={logout}
            style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5' }}
          >
            <LogOut size={20} />
          </IconButton>
        </HeaderActions>
      </Header>

      <MainContent>
        <WelcomeSection
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <WelcomeTitle>Your Sports Dashboard</WelcomeTitle>
          <WelcomeSubtitle>
            Manage your bookings, discover new courts, and stay active with your favorite sports.
          </WelcomeSubtitle>

          <StatsGrid>
            <StatCard
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <StatIcon>
                <Calendar size={24} color="white" />
              </StatIcon>
              <StatValue>
                {isLoadingStats ? (
                  <LoadingSpinner
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  stats.totalBookings
                )}
              </StatValue>
              <StatLabel>Total Bookings</StatLabel>
            </StatCard>

            <StatCard
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <StatIcon>
                <CheckCircle size={24} color="white" />
              </StatIcon>
              <StatValue>
                {isLoadingStats ? (
                  <LoadingSpinner
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  stats.confirmedBookings || 0
                )}
              </StatValue>
              <StatLabel>Confirmed Bookings</StatLabel>
            </StatCard>

            <StatCard
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <StatIcon>
                <X size={24} color="white" />
              </StatIcon>
              <StatValue>
                {isLoadingStats ? (
                  <LoadingSpinner
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  stats.cancelledBookings || 0
                )}
              </StatValue>
              <StatLabel>Cancelled Bookings</StatLabel>
            </StatCard>

            <StatCard
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <StatIcon>
                <Trophy size={24} color="white" />
              </StatIcon>
              <StatValue>
                {isLoadingStats ? (
                  <LoadingSpinner
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  `₹${stats.totalSpent}`
                )}
              </StatValue>
              <StatLabel>Total Spent</StatLabel>
            </StatCard>
          </StatsGrid>
        </WelcomeSection>


        {userSports.length > 0 && (
          <Section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          >
            <SectionHeader>
              <SectionTitle>
                <Target size={24} color="#4F46E5" />
                Your Favorite Sports
              </SectionTitle>
            </SectionHeader>
            
            <SportsGrid>
              {userSports.map(sportId => {
                const sport = sports.find(s => s.id === sportId);
                return sport ? (
                  <SportCard
                    key={sport.id}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <SportIcon>{sport.icon}</SportIcon>
                    <SportName>{sport.name}</SportName>
                  </SportCard>
                ) : null;
              })}
            </SportsGrid>
          </Section>
        )}

        <RecentBookingsSection
          key="recent-bookings-section"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
        >
          <SectionHeader>
            <SectionTitle>
              <BookOpen size={24} color="#4F46E5" />
              Recent Bookings
            </SectionTitle>
            <ActionButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/my-bookings')}
            >
              <RefreshCw size={16} />
              View All
            </ActionButton>
          </SectionHeader>
          
          {isLoadingBookings ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <LoadingSpinner
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <div style={{ marginTop: '16px', color: '#9ca3af' }}>Loading bookings...</div>
            </div>
          ) : recentBookings.length === 0 ? (
            <EmptyState>
              <EmptyIcon>
                <Calendar size={24} color="#4F46E5" />
              </EmptyIcon>
              <h3 style={{ color: '#ffffff', marginBottom: '8px', fontSize: '1.1rem' }}>No Recent Bookings</h3>
              <p style={{ fontSize: '0.9rem' }}>Start by booking your first court!</p>
            </EmptyState>
          ) : (
            recentBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.02 }}
              >
                <BookingHeader>
                  <BookingTitle>
                    <Star size={14} color="#fbbf24" />
                    {booking.courtName}
                  </BookingTitle>
                  <StatusBadge status={booking.status}>
                    {booking.status}
                  </StatusBadge>
                </BookingHeader>

                <BookingDetails>
                  <DetailItem>
                    <Calendar size={12} />
                    {new Date(booking.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </DetailItem>
                  <DetailItem>
                    <Clock size={12} />
                    {booking.time}
                  </DetailItem>
                  <DetailItem>
                    <MapPin size={12} />
                    {booking.location}
                  </DetailItem>
                  <DetailItem>
                    <TrendingUp size={12} />
                    {booking.paymentStatus}
                  </DetailItem>
                </BookingDetails>

                <BookingAmount>₹{booking.totalAmount}</BookingAmount>

                <BookingActions>
                  {booking.status === 'pending' && (
                    <BookingActionButton
                      $primary
                      onClick={() => handleBookingAction(booking.id, 'confirm')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <CheckCircle size={12} />
                      Confirm
                    </BookingActionButton>
                  )}
                  
                  {(booking.status === 'pending' || booking.status === 'confirmed') && (
                    <BookingActionButton
                      $danger
                      onClick={() => handleBookingAction(booking.id, 'cancel')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <X size={12} />
                      Cancel
                    </BookingActionButton>
                  )}
                </BookingActions>
              </BookingCard>
            ))
          )}
        </RecentBookingsSection>

        <Section
          key="quick-actions-section"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
        >
          <SectionHeader>
            <SectionTitle>
              <Activity size={24} color="#4F46E5" />
              Quick Actions
            </SectionTitle>
            <ActionButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBookCourt}
            >
              <Plus size={20} />
              New Booking
            </ActionButton>
          </SectionHeader>
          
          <QuickActions>
            {quickActions.map((action, index) => (
              <QuickActionCard
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={action.action}
              >
                <QuickActionIcon>
                  {action.icon}
                </QuickActionIcon>
                <QuickActionTitle>{action.title}</QuickActionTitle>
                <QuickActionDescription>{action.description}</QuickActionDescription>
              </QuickActionCard>
            ))}
          </QuickActions>
        </Section>
      </MainContent>

      <NotificationBanner
        isOpen={showNotificationBanner}
        onClose={handleCloseBanner}
        onViewNotifications={handleViewNotifications}
      />

      <NotificationPopup
        isOpen={showNotificationPopup}
        onClose={() => setShowNotificationPopup(false)}
        onMarkAsRead={handleNotificationMarkAsRead}
      />
    </Container>
  );
};

export default Dashboard;
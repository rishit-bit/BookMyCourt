import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { 
  Calendar, 
  MapPin, 
  DollarSign, 
  TrendingUp,
  Activity,
  LogOut,
  Menu,
  X,
  BarChart3,
  BookOpen,
  AlertCircle,
  RefreshCw,
  UserPlus,
  Users,
  Crown,
  Star,
  Clock,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import Logo from './Logo';
import CourtManagement from './CourtManagement';
import BookingManagement from './BookingManagement';
import NotificationManagement from './NotificationManagement';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Container = styled.div`
  width: 100vw;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  display: flex;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
  
  @media (max-width: 360px) {
    width: 100%;
    overflow-x: hidden;
  }
`;

const Sidebar = styled(motion.div)`
  width: 280px;
  background: rgba(17, 24, 39, 0.9);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(79, 70, 229, 0.2);
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 10;
  
  @media (max-width: 768px) {
    position: fixed;
    left: ${props => props.$isOpen ? '0' : '-280px'};
    height: 100vh;
    transition: left 0.3s ease;
    z-index: 1000;
    width: 280px;
  }
  
  @media (max-width: 360px) {
    width: 100%;
    left: ${props => props.$isOpen ? '0' : '-100%'};
  }
`;

const SidebarHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid rgba(79, 70, 229, 0.2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  @media (max-width: 360px) {
    padding: 16px;
  }
`;

const SidebarTitle = styled.h2`
  color: #ffffff;
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  
  @media (max-width: 360px) {
    font-size: 1rem;
    gap: 8px;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const SidebarNav = styled.nav`
  flex: 1;
  padding: 24px 0;
  
  @media (max-width: 360px) {
    padding: 16px 0;
  }
`;

const NavItem = styled(motion.button)`
  width: 100%;
  padding: 16px 24px;
  background: ${props => props.$active ? 'rgba(79, 70, 229, 0.2)' : 'transparent'};
  border: none;
  color: ${props => props.$active ? '#ffffff' : '#9ca3af'};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
  text-align: left;
  
  &:hover {
    background: rgba(79, 70, 229, 0.1);
    color: #ffffff;
  }
  
  @media (max-width: 360px) {
    padding: 12px 16px;
    font-size: 0.9rem;
    gap: 10px;
  }
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 2;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Header = styled.div`
  background: rgba(17, 24, 39, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(79, 70, 229, 0.2);
  padding: 20px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 5;
  
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
  
  @media (max-width: 360px) {
    padding: 8px 12px;
    gap: 8px;
  }
`;

const HeaderTitle = styled.h1`
  color: #ffffff;
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
  
  @media (max-width: 360px) {
    font-size: 1.2rem;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  
  @media (max-width: 360px) {
    gap: 8px;
    width: 100%;
    justify-content: flex-start;
  }
`;

const RefreshButton = styled(motion.button)`
  padding: 10px 16px;
  background: linear-gradient(135deg, #4F46E5, #2563EB);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(79, 70, 229, 0.4);
  }
  
  @media (max-width: 360px) {
    padding: 8px 12px;
    font-size: 0.8rem;
    gap: 6px;
    flex: 1;
    justify-content: center;
  }
`;

const LogoutButton = styled(motion.button)`
  padding: 10px 16px;
  background: rgba(239, 68, 68, 0.2);
  color: #fca5a5;
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(239, 68, 68, 0.3);
    color: #ffffff;
  }
  
  @media (max-width: 360px) {
    padding: 8px 12px;
    font-size: 0.8rem;
    gap: 6px;
    flex: 1;
    justify-content: center;
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 32px;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    padding: 20px;
  }
  
  @media (max-width: 480px) {
    padding: 16px;
  }
  
  @media (max-width: 360px) {
    padding: 12px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 12px;
    margin-bottom: 20px;
  }
  
  @media (max-width: 360px) {
    gap: 10px;
    margin-bottom: 16px;
  }
`;

const StatCard = styled(motion.div)`
  background: rgba(31, 41, 55, 0.6);
  border: 1px solid rgba(75, 85, 99, 0.3);
  border-radius: 16px;
  padding: 24px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.color || 'linear-gradient(135deg, #4F46E5, #2563EB)'};
  }
  
  @media (max-width: 360px) {
    padding: 16px;
    border-radius: 12px;
  }
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const StatTitle = styled.h3`
  color: #9ca3af;
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  @media (max-width: 360px) {
    font-size: 0.8rem;
  }
`;

const StatIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${props => props.color || 'rgba(79, 70, 229, 0.2)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.color || '#4F46E5'};
`;

const StatValue = styled.div`
  color: #ffffff;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 8px;
  
  @media (max-width: 360px) {
    font-size: 1.5rem;
    margin-bottom: 6px;
  }
`;

const StatChange = styled.div`
  color: ${props => props.$positive ? '#10b981' : '#ef4444'};
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ChartsSection = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
  
  @media (max-width: 360px) {
    gap: 16px;
    margin-bottom: 20px;
  }
`;

const ChartCard = styled.div`
  background: rgba(31, 41, 55, 0.6);
  border: 1px solid rgba(75, 85, 99, 0.3);
  border-radius: 16px;
  padding: 24px;
  
  @media (max-width: 360px) {
    padding: 16px;
    border-radius: 12px;
  }
`;

const ChartTitle = styled.h3`
  color: #ffffff;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 20px 0;
  
  @media (max-width: 360px) {
    font-size: 1rem;
    margin-bottom: 16px;
  }
`;

const BookingItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid rgba(75, 85, 99, 0.2);
  flex-wrap: wrap;
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 360px) {
    padding: 12px 0;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
`;

const BookingDetails = styled.div`
  color: #9ca3af;
  font-size: 0.9rem;
  
  @media (max-width: 360px) {
    font-size: 0.85rem;
    width: 100%;
  }
`;

const BookingStatus = styled.span`
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  
  ${props => {
    switch (props.$status) {
      case 'confirmed':
        return `
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
        `;
      case 'pending':
        return `
          background: rgba(245, 158, 11, 0.2);
          color: #f59e0b;
        `;
      case 'cancelled':
        return `
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
        `;
      default:
        return `
          background: rgba(75, 85, 99, 0.2);
          color: #9ca3af;
        `;
    }
  }}
`;

const LoadingSpinner = styled(motion.div)`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid #ffffff;
  border-radius: 50%;
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  text-align: center;
  justify-content: center;
  padding: 20px;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4F46E5, #7C3AED);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  margin-right: 12px;
  flex-shrink: 0;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(135deg, #4F46E5, #7C3AED);
    border-radius: 50%;
    z-index: -1;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

const UserName = styled.div`
  color: #ffffff;
  font-weight: 600;
  margin-bottom: 4px;
  font-size: 0.95rem;
`;

const UserEmail = styled.div`
  color: #9ca3af;
  font-size: 0.8rem;
  margin-bottom: 2px;
`;


const StatusIcon = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 12px;
  
  ${props => {
    switch (props.$status) {
      case 'confirmed':
        return `
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
        `;
      case 'pending':
        return `
          background: rgba(245, 158, 11, 0.2);
          color: #f59e0b;
        `;
      case 'cancelled':
        return `
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
        `;
      default:
        return `
          background: rgba(75, 85, 99, 0.2);
          color: #9ca3af;
        `;
    }
  }}
`;


const QuickStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
  
  @media (max-width: 360px) {
    grid-template-columns: 1fr;
    gap: 12px;
    margin-bottom: 16px;
  }
`;

const QuickStatCard = styled(motion.div)`
  background: rgba(31, 41, 55, 0.4);
  border: 1px solid rgba(75, 85, 99, 0.2);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  
  @media (max-width: 360px) {
    padding: 12px;
    gap: 10px;
    border-radius: 10px;
  }
`;


const QuickStatContent = styled.div`
  flex: 1;
`;

const QuickStatLabel = styled.div`
  color: #9ca3af;
  font-size: 0.8rem;
  font-weight: 500;
  margin-bottom: 4px;
`;

const QuickStatValue = styled.div`
  color: #ffffff;
  font-size: 1.2rem;
  font-weight: 700;
  
  @media (max-width: 360px) {
    font-size: 1rem;
  }
`;

const MobileOverlay = styled.div`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  
  @media (max-width: 768px) {
    display: ${props => props.$isOpen ? 'block' : 'none'};
  }
`;

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchDashboardData();
    }
  }, [activeTab]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.get(`${API_BASE_URL}/admin/dashboard`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('bookmycourt_token')}`
        }
      });

      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (error) {
      console.error('Dashboard data error:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  const handleLogout = () => {
    logout();
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'courts', label: 'Court Management', icon: MapPin },
    { id: 'bookings', label: 'Booking Management', icon: BookOpen },
    { id: 'notifications', label: 'Notifications', icon: AlertCircle }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'courts':
        return <CourtManagement />;
      case 'bookings':
        return <BookingManagement />;
      case 'notifications':
        return <NotificationManagement />;
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => {
    if (isLoading) {
      return (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <LoadingSpinner
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <div style={{ marginTop: '20px', color: '#9ca3af' }}>Loading dashboard...</div>
        </div>
      );
    }

    if (error) {
      return (
        <ErrorMessage>
          <AlertCircle size={16} />
          {error}
        </ErrorMessage>
      );
    }

    if (!dashboardData) {
      return (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9ca3af' }}>
          <h2>No data available</h2>
          <p>Unable to load dashboard data</p>
        </div>
      );
    }

    return (
      <>
        <QuickStats>
          <QuickStatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <QuickStatContent>
              <QuickStatLabel>New Users Today</QuickStatLabel>
              <QuickStatValue>{dashboardData?.todayStats?.newUsersToday || 0}</QuickStatValue>
            </QuickStatContent>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: '40px', 
              height: '40px', 
              background: 'rgba(79, 70, 229, 0.3)', 
              borderRadius: '50%',
              marginLeft: 'auto'
            }}>
              <UserPlus size={20} color="#4F46E5" />
            </div>
          </QuickStatCard>

          <QuickStatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <QuickStatContent>
              <QuickStatLabel>Bookings Today</QuickStatLabel>
              <QuickStatValue>{dashboardData?.todayStats?.bookingsToday || 0}</QuickStatValue>
            </QuickStatContent>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: '40px', 
              height: '40px', 
              background: 'rgba(16, 185, 129, 0.3)', 
              borderRadius: '50%',
              marginLeft: 'auto'
            }}>
              <Calendar size={20} color="#10b981" />
            </div>
          </QuickStatCard>

          <QuickStatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <QuickStatContent>
              <QuickStatLabel>Avg Rating</QuickStatLabel>
              <QuickStatValue>
                {dashboardData?.ratings?.averageRating 
                  ? dashboardData.ratings.averageRating.toFixed(1)
                  : '0.0'
                }
              </QuickStatValue>
              {dashboardData?.ratings?.totalRatings > 0 && (
                <div style={{ 
                  fontSize: '0.8rem', 
                  color: '#9ca3af',
                  marginTop: '4px'
                }}>
                  ({dashboardData.ratings.totalRatings} ratings)
                </div>
              )}
            </QuickStatContent>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: '40px', 
              height: '40px', 
              background: 'rgba(245, 158, 11, 0.3)', 
              borderRadius: '50%',
              marginLeft: 'auto'
            }}>
              <Star size={20} color="#f59e0b" />
            </div>
          </QuickStatCard>

          <QuickStatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <QuickStatContent>
              <QuickStatLabel>Active Sessions</QuickStatLabel>
              <QuickStatValue>{dashboardData?.todayStats?.activeSessions || 0}</QuickStatValue>
            </QuickStatContent>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: '40px', 
              height: '40px', 
              background: 'rgba(139, 92, 246, 0.3)', 
              borderRadius: '50%',
              marginLeft: 'auto'
            }}>
              <Activity size={20} color="#8b5cf6" />
            </div>
          </QuickStatCard>
        </QuickStats>

        <StatsGrid>
          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            color="linear-gradient(135deg, #4F46E5, #2563EB)"
          >
            <StatHeader>
              <StatTitle>Total Users</StatTitle>
            </StatHeader>
            <StatValue>{dashboardData.users.totalUsers}</StatValue>
            <StatChange $positive>
              <TrendingUp size={14} />
              {dashboardData.users.activeUsers} active
            </StatChange>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: '60px', 
              height: '60px', 
              background: 'rgba(79, 70, 229, 0.3)', 
              borderRadius: '50%',
              marginLeft: 'auto',
              marginTop: '10px'
            }}>
              <Users size={32} color="#4F46E5" />
            </div>
          </StatCard>

          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            color="linear-gradient(135deg, #10b981, #059669)"
          >
            <StatHeader>
              <StatTitle>Total Courts</StatTitle>
            </StatHeader>
            <StatValue>{dashboardData.courts.totalCourts}</StatValue>
            <StatChange $positive>
              <TrendingUp size={14} />
              {dashboardData.courts.activeCourts} active
            </StatChange>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: '60px', 
              height: '60px', 
              background: 'rgba(16, 185, 129, 0.3)', 
              borderRadius: '50%',
              marginLeft: 'auto',
              marginTop: '10px'
            }}>
              <MapPin size={32} color="#10b981" />
            </div>
          </StatCard>

          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            color="linear-gradient(135deg, #f59e0b, #d97706)"
          >
            <StatHeader>
              <StatTitle>Total Bookings</StatTitle>
            </StatHeader>
            <StatValue>{dashboardData.bookings.totalBookings}</StatValue>
            <StatChange $positive>
              <TrendingUp size={14} />
              {dashboardData.bookings.confirmedBookings} confirmed
            </StatChange>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: '60px', 
              height: '60px', 
              background: 'rgba(245, 158, 11, 0.3)', 
              borderRadius: '50%',
              marginLeft: 'auto',
              marginTop: '10px'
            }}>
              <Calendar size={32} color="#f59e0b" />
            </div>
          </StatCard>

          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            color="linear-gradient(135deg, #8b5cf6, #7c3aed)"
          >
            <StatHeader>
              <StatTitle>Total Revenue</StatTitle>
            </StatHeader>
            <StatValue>₹{dashboardData.bookings.totalRevenue.toLocaleString()}</StatValue>
            <StatChange $positive>
              <TrendingUp size={14} />
              This month
            </StatChange>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: '60px', 
              height: '60px', 
              background: 'rgba(139, 92, 246, 0.3)', 
              borderRadius: '50%',
              marginLeft: 'auto',
              marginTop: '10px'
            }}>
              <DollarSign size={32} color="#8b5cf6" />
            </div>
          </StatCard>
        </StatsGrid>

        {/* Rating Statistics Section */}
        {dashboardData?.ratings?.totalRatings > 0 && (
          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            color="linear-gradient(135deg, #f59e0b, #f97316)"
            style={{ marginBottom: '32px' }}
          >
            <StatHeader>
              <StatTitle>Rating Statistics</StatTitle>
              <StatIcon color="#f59e0b">
                <Star size={20} color="#ffffff" />
              </StatIcon>
            </StatHeader>
            <StatValue>
              {dashboardData.ratings.averageRating.toFixed(1)}/5.0
            </StatValue>
            <StatChange $positive>
              <Star size={14} color="#10b981" />
              {dashboardData.ratings.totalRatings} total ratings
            </StatChange>
            
            {/* Rating Distribution */}
            <div style={{ marginTop: '20px' }}>
              <div style={{ 
                color: '#9ca3af', 
                fontSize: '0.9rem', 
                marginBottom: '12px',
                fontWeight: '600'
              }}>
                Rating Distribution:
              </div>
              {[5, 4, 3, 2, 1].map((star) => {
                const count = dashboardData.ratings.ratingDistribution.filter(r => r === star).length;
                const percentage = dashboardData.ratings.totalRatings > 0 
                  ? (count / dashboardData.ratings.totalRatings) * 100 
                  : 0;
                
                return (
                  <div key={star} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    marginBottom: '8px',
                    gap: '8px'
                  }}>
                    <span style={{ 
                      color: '#ffffff', 
                      fontSize: '0.9rem', 
                      minWidth: '20px',
                      fontWeight: '600'
                    }}>
                      {star}
                    </span>
                    <Star size={14} color="#f59e0b" />
                    <div style={{ 
                      flex: 1, 
                      height: '8px', 
                      background: 'rgba(75, 85, 99, 0.3)', 
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{ 
                        height: '100%', 
                        background: 'linear-gradient(90deg, #f59e0b, #f97316)',
                        width: `${percentage}%`,
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                    <span style={{ 
                      color: '#9ca3af', 
                      fontSize: '0.8rem',
                      minWidth: '40px',
                      textAlign: 'right'
                    }}>
                      {count} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </StatCard>
        )}

        <ChartsSection>
          <ChartCard>
            <ChartTitle>Recent Bookings</ChartTitle>
            {dashboardData.recentBookings.length > 0 ? (
              dashboardData.recentBookings.map((booking, index) => (
                <BookingItem key={index}>
                  <UserInfo>
                    <UserAvatar>
                      {booking.user.firstName?.charAt(0)}{booking.user.lastName?.charAt(0)}
                    </UserAvatar>
                    <div>
                      <UserName>{booking.user.firstName} {booking.user.lastName}</UserName>
                      <UserEmail>{booking.user.email}</UserEmail>
                      <BookingDetails>
                        {booking.court} • {booking.date} • {booking.time}
                      </BookingDetails>
                    </div>
                  </UserInfo>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <BookingStatus $status={booking.status}>
                      {booking.status}
                    </BookingStatus>
                    <StatusIcon $status={booking.status}>
                      {booking.status === 'confirmed' && <CheckCircle2 size={12} />}
                      {booking.status === 'pending' && <Clock size={12} />}
                      {booking.status === 'cancelled' && <XCircle size={12} />}
                    </StatusIcon>
                  </div>
                </BookingItem>
              ))
            ) : (
              <div style={{ 
                color: '#9ca3af', 
                textAlign: 'center', 
                padding: '40px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px'
              }}>
                <Calendar size={48} color="#6b7280" />
                <div>No recent bookings</div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                  Bookings will appear here once users start making reservations
                </div>
              </div>
            )}
          </ChartCard>

          <ChartCard>
            <ChartTitle>Court Statistics</ChartTitle>
            {dashboardData.courtStatsBySport.map((sport, index) => {
              
              return (
                <div key={index} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: '1px solid rgba(75, 85, 99, 0.2)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: '#ffffff', textTransform: 'capitalize', fontWeight: '500' }}>
                      {sport._id.replace('-', ' ')}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
                      {sport.count} court{sport.count !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              );
            })}
          </ChartCard>
        </ChartsSection>
      </>
    );
  };

  return (
    <Container>
      <MobileOverlay 
        $isOpen={isSidebarOpen} 
        onClick={() => setIsSidebarOpen(false)} 
      />
      
      <Sidebar
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
        $isOpen={isSidebarOpen}
      >
        <SidebarHeader>
          <SidebarTitle>
            <Logo />
            Admin Panel
          </SidebarTitle>
          <MobileMenuButton onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </MobileMenuButton>
        </SidebarHeader>

        <SidebarNav>
          {navItems.map((item) => (
            <NavItem
              key={item.id}
              $active={activeTab === item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsSidebarOpen(false);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <item.icon size={20} />
              {item.label}
            </NavItem>
          ))}
        </SidebarNav>
      </Sidebar>

      <MainContent>
        <Header>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <MobileMenuButton onClick={() => setIsSidebarOpen(true)}>
              <Menu size={20} />
            </MobileMenuButton>
            <HeaderTitle>
              {navItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
            </HeaderTitle>
          </div>
          
          <HeaderActions>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '16px',
              marginRight: '16px'
            }}>
              <UserAvatar style={{ 
                width: '36px', 
                height: '36px', 
                marginRight: '0',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)'
              }}>
                <Crown size={16} />
              </UserAvatar>
              <div>
                <div style={{ 
                  color: '#ffffff', 
                  fontWeight: '600', 
                  fontSize: '0.9rem' 
                }}>
                  {user?.firstName} {user?.lastName}
                </div>
                <div style={{ 
                  color: '#9ca3af', 
                  fontSize: '0.8rem' 
                }}>
                  Administrator
                </div>
              </div>
            </div>

            {activeTab === 'dashboard' && (
              <RefreshButton
                onClick={fetchDashboardData}
                disabled={isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw size={16} />
                Refresh
              </RefreshButton>
            )}
            
            <LogoutButton
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogOut size={16} />
              Logout
            </LogoutButton>
          </HeaderActions>
        </Header>

        <Content>
          {renderContent()}
        </Content>
      </MainContent>
    </Container>
  );
};

export default AdminDashboard;

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Star, 
  CreditCard, 
  CheckCircle,
  X,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
  ThumbsUp
} from 'lucide-react';
import Logo from './Logo';
import RatingModal from './RatingModal';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Container = styled.div`
  width: 100vw;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 20px;
  
  @media (max-width: 480px) {
    padding: 15px;
  }
  
  @media (max-width: 360px) {
    padding: 10px;
    align-items: flex-start;
  }
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

const Card = styled(motion.div)`
  background: rgba(17, 24, 39, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 40px;
  width: 100%;
  max-width: 1200px;
  box-shadow: 
    0 25px 50px rgba(0,0,0,0.4),
    0 0 0 1px rgba(79, 70, 229, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(79, 70, 229, 0.2);
  position: relative;
  z-index: 2;
  
  @media (max-width: 768px) {
    padding: 30px;
    border-radius: 20px;
  }
  
  @media (max-width: 480px) {
    padding: 20px;
    border-radius: 16px;
  }
  
  @media (max-width: 360px) {
    padding: 15px;
    border-radius: 12px;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #ffffff, #a5b4fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 10px;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
  
  @media (max-width: 360px) {
    font-size: 1.5rem;
    margin-bottom: 8px;
  }
`;

const Subtitle = styled.p`
  color: #9ca3af;
  font-size: 1.1rem;
  text-align: center;
  margin-bottom: 0;
  
  @media (max-width: 480px) {
    font-size: 1rem;
  }
  
  @media (max-width: 360px) {
    font-size: 0.9rem;
  }
`;

const Controls = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 480px) {
    gap: 12px;
    margin-bottom: 24px;
  }
  
  @media (max-width: 360px) {
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
  }
`;

const FilterSelect = styled.select`
  padding: 12px 16px;
  border: 2px solid rgba(75, 85, 99, 0.3);
  border-radius: 12px;
  background: rgba(17, 24, 39, 0.6);
  color: #ffffff;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #4F46E5;
    background: rgba(17, 24, 39, 0.8);
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }
  
  option {
    background: #1f2937;
    color: #ffffff;
  }
  
  @media (max-width: 480px) {
    padding: 10px 14px;
    font-size: 0.85rem;
  }
  
  @media (max-width: 360px) {
    width: 100%;
    padding: 10px 12px;
    font-size: 0.8rem;
  }
`;

const SearchInput = styled.input`
  padding: 12px 16px;
  border: 2px solid rgba(75, 85, 99, 0.3);
  border-radius: 12px;
  background: rgba(17, 24, 39, 0.6);
  color: #ffffff;
  font-size: 0.9rem;
  min-width: 200px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #4F46E5;
    background: rgba(17, 24, 39, 0.8);
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }
  
  &::placeholder {
    color: #6b7280;
  }
  
  @media (max-width: 480px) {
    min-width: 150px;
    padding: 10px 14px;
    font-size: 0.85rem;
  }
  
  @media (max-width: 360px) {
    width: 100%;
    min-width: 100%;
    padding: 10px 12px;
    font-size: 0.8rem;
  }
`;

const RefreshButton = styled(motion.button)`
  padding: 12px 16px;
  background: linear-gradient(135deg, #4F46E5, #2563EB);
  color: white;
  border: none;
  border-radius: 12px;
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
  
  @media (max-width: 480px) {
    padding: 10px 14px;
    font-size: 0.85rem;
    gap: 6px;
  }
  
  @media (max-width: 360px) {
    width: 100%;
    justify-content: center;
    padding: 10px 12px;
    font-size: 0.8rem;
  }
`;

const BookingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin-bottom: 24px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 16px;
    margin-bottom: 20px;
  }
  
  @media (max-width: 360px) {
    gap: 12px;
    margin-bottom: 16px;
  }
`;

const BookingCard = styled(motion.div)`
  background: rgba(31, 41, 55, 0.6);
  border: 1px solid rgba(75, 85, 99, 0.3);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    border-color: #4F46E5;
    background: rgba(79, 70, 229, 0.1);
    transform: translateY(-2px);
  }
  
  @media (max-width: 480px) {
    padding: 20px;
    border-radius: 12px;
  }
  
  @media (max-width: 360px) {
    padding: 16px;
    border-radius: 10px;
  }
`;

const BookingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const BookingTitle = styled.h3`
  color: #ffffff;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
    gap: 6px;
  }
  
  @media (max-width: 360px) {
    font-size: 1rem;
    gap: 4px;
  }
`;

const StatusBadge = styled.span`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  @media (max-width: 480px) {
    padding: 5px 10px;
    font-size: 0.75rem;
  }
  
  @media (max-width: 360px) {
    padding: 4px 8px;
    font-size: 0.7rem;
    letter-spacing: 0.3px;
  }
  
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
  gap: 16px;
  margin-bottom: 16px;
  
  @media (max-width: 480px) {
    gap: 12px;
    margin-bottom: 12px;
  }
  
  @media (max-width: 360px) {
    grid-template-columns: 1fr;
    gap: 10px;
    margin-bottom: 10px;
  }
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #9ca3af;
  font-size: 0.9rem;
  
  @media (max-width: 480px) {
    font-size: 0.85rem;
    gap: 6px;
  }
  
  @media (max-width: 360px) {
    font-size: 0.8rem;
    gap: 4px;
  }
`;

const BookingAmount = styled.div`
  color: #10b981;
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 16px;
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
    margin-bottom: 12px;
  }
  
  @media (max-width: 360px) {
    font-size: 1rem;
    margin-bottom: 10px;
  }
`;

const BookingActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  
  @media (max-width: 480px) {
    gap: 10px;
    flex-wrap: wrap;
  }
  
  @media (max-width: 360px) {
    gap: 8px;
    flex-direction: column;
    width: 100%;
  }
`;

const ActionButton = styled(motion.button)`
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
  
  @media (max-width: 480px) {
    padding: 8px 14px;
    font-size: 0.75rem;
    gap: 4px;
  }
  
  @media (max-width: 360px) {
    width: 100%;
    justify-content: center;
    padding: 10px 12px;
    font-size: 0.8rem;
    gap: 6px;
  }
  
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
  ` : props.$success ? `
    background: rgba(16, 185, 129, 0.2);
    color: #10b981;
    border: 1px solid rgba(16, 185, 129, 0.3);
    
    &:hover {
      background: rgba(16, 185, 129, 0.3);
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
  padding: 60px 20px;
  color: #9ca3af;
`;

const EmptyIcon = styled.div`
  width: 80px;
  height: 80px;
  background: rgba(79, 70, 229, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
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
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 32px;
  
  @media (max-width: 480px) {
    gap: 12px;
    margin-top: 24px;
    flex-wrap: wrap;
  }
  
  @media (max-width: 360px) {
    gap: 8px;
    margin-top: 20px;
  }
`;

const PageButton = styled.button`
  padding: 8px 16px;
  border: 2px solid rgba(75, 85, 99, 0.3);
  border-radius: 8px;
  background: rgba(17, 24, 39, 0.6);
  color: #9ca3af;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    border-color: #4F46E5;
    background: rgba(79, 70, 229, 0.1);
    color: #ffffff;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  @media (max-width: 480px) {
    padding: 8px 12px;
    font-size: 0.85rem;
  }
  
  @media (max-width: 360px) {
    padding: 6px 10px;
    font-size: 0.8rem;
  }
`;

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const params = {
        page: currentPage,
        limit: 6
      };
      
      if (statusFilter) {
        params.status = statusFilter;
      }

      const response = await axios.get(`${API_BASE_URL}/bookings`, {
        params,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('bookmycourt_token')}`
        }
      });

      if (response.data.success) {
        setBookings(response.data.data.bookings);
        setTotalPages(response.data.data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Fetch bookings error:', error);
      setError('Failed to load bookings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, statusFilter]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      const response = await axios.put(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {
        cancellationReason: 'Cancelled by user'
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('bookmycourt_token')}`
        }
      });

      if (response.data.success) {
        toast.success('Booking cancelled successfully');
        fetchBookings(); // Refresh the list
      }
    } catch (error) {
      console.error('Cancel booking error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to cancel booking';
      toast.error(errorMessage);
    }
  };

  const handleConfirmBooking = async (bookingId) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/bookings/${bookingId}/confirm`, {
        paymentStatus: 'paid'
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('bookmycourt_token')}`
        }
      });

      if (response.data.success) {
        toast.success('Booking confirmed successfully!');
        fetchBookings(); // Refresh the list
      }
    } catch (error) {
      console.error('Confirm booking error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to confirm booking';
      toast.error(errorMessage);
    }
  };

  const handleRateBooking = (booking) => {
    setSelectedBooking(booking);
    setShowRatingModal(true);
  };

  const handleRatingSubmitted = (updatedBooking) => {
    // Update the booking in the list
    setBookings(prevBookings => 
      prevBookings.map(booking => 
        booking.id === updatedBooking.id ? updatedBooking : booking
      )
    );
    setShowRatingModal(false);
    setSelectedBooking(null);
  };

  const handleCloseRatingModal = () => {
    setShowRatingModal(false);
    setSelectedBooking(null);
  };

  const filteredBookings = bookings.filter(booking =>
    booking.courtName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };


  return (
    <Container>
      <Background />
      
      <Card
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Header>
          <LogoContainer>
            <Logo />
          </LogoContainer>
          
          <Title>My Bookings</Title>
          <Subtitle>Manage your court bookings and reservations</Subtitle>
        </Header>

        <Controls>
          <FilterSelect
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Bookings</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </FilterSelect>

          <SearchInput
            type="text"
            placeholder="Search by court name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <RefreshButton
            onClick={fetchBookings}
            disabled={isLoading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw size={16} />
            Refresh
          </RefreshButton>
        </Controls>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <LoadingSpinner
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <div style={{ marginTop: '20px', color: '#9ca3af' }}>Loading bookings...</div>
          </div>
        ) : error ? (
          <ErrorMessage>
            <AlertCircle size={16} />
            {error}
          </ErrorMessage>
        ) : filteredBookings.length === 0 ? (
          <EmptyState>
            <EmptyIcon>
              <Calendar size={32} color="#4F46E5" />
            </EmptyIcon>
            <h3 style={{ color: '#ffffff', marginBottom: '12px' }}>No Bookings Found</h3>
            <p>You haven't made any bookings yet. Start by booking a court!</p>
          </EmptyState>
        ) : (
          <>
            <BookingsGrid>
              {filteredBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <BookingHeader>
                    <BookingTitle>
                      <Star size={16} color="#fbbf24" />
                      {booking.courtName}
                    </BookingTitle>
                    <StatusBadge status={booking.status}>
                      {booking.statusDisplay || booking.status}
                    </StatusBadge>
                  </BookingHeader>

                  <BookingDetails>
                    <DetailItem>
                      <Calendar size={16} />
                      {formatDate(booking.date)}
                    </DetailItem>
                    <DetailItem>
                      <Clock size={16} />
                      {booking.time}
                    </DetailItem>
                    <DetailItem>
                      <MapPin size={16} />
                      {booking.location}
                    </DetailItem>
                    <DetailItem>
                      <CreditCard size={16} />
                      {booking.paymentStatus}
                    </DetailItem>
                  </BookingDetails>

                  <BookingAmount>₹{booking.totalAmount}</BookingAmount>

                  <BookingActions>
                    {booking.status === 'pending' && (
                      <ActionButton
                        $primary
                        onClick={() => handleConfirmBooking(booking.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <CheckCircle size={14} />
                        Confirm
                      </ActionButton>
                    )}
                    
                    {(booking.status === 'pending' || booking.status === 'confirmed') && (
                      <ActionButton
                        $danger
                        onClick={() => handleCancelBooking(booking.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <X size={14} />
                        Cancel
                      </ActionButton>
                    )}
                    
                    {booking.status === 'completed' && !booking.rating && (
                      <ActionButton
                        $success
                        onClick={() => handleRateBooking(booking)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ThumbsUp size={14} />
                        Rate
                      </ActionButton>
                    )}
                    
                    {booking.status === 'completed' && booking.rating && (
                      <ActionButton
                        style={{ 
                          background: 'rgba(251, 191, 36, 0.2)', 
                          color: '#fbbf24', 
                          border: '1px solid rgba(251, 191, 36, 0.3)',
                          cursor: 'default',
                          opacity: 0.8
                        }}
                        title="Rating submitted - cannot be changed"
                      >
                        <Star size={14} />
                        {booking.rating}/5
                      </ActionButton>
                    )}
                  </BookingActions>
                </BookingCard>
              ))}
            </BookingsGrid>

            {totalPages > 1 && (
              <Pagination>
                <PageButton
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </PageButton>
                
                <span style={{ color: '#9ca3af' }}>
                  Page {currentPage} of {totalPages}
                </span>
                
                <PageButton
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </PageButton>
              </Pagination>
            )}
          </>
        )}

        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <ActionButton
            onClick={() => navigate('/dashboard')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </ActionButton>
        </div>
      </Card>

      <RatingModal
        booking={selectedBooking}
        isOpen={showRatingModal}
        onClose={handleCloseRatingModal}
        onRatingSubmitted={handleRatingSubmitted}
      />
    </Container>
  );
};

export default MyBookings;

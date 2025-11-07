import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Calendar, 
  Clock, 
  CheckCircle,
  X,
  RefreshCw,
  Eye,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock3
} from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Container = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 16px;

  @media (max-width: 768px) {
    padding: 0 12px;
  }

  @media (max-width: 480px) {
    padding: 0 8px;
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
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    margin-bottom: 24px;
  }

  @media (max-width: 480px) {
    margin-bottom: 20px;
    gap: 10px;
  }
`;

const Title = styled.h2`
  color: #ffffff;
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    text-align: center;
  }

  @media (max-width: 480px) {
    font-size: 1.3rem;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    justify-content: center;
    gap: 12px;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const SearchInput = styled.input`
  padding: 12px 16px;
  border: 2px solid rgba(75, 85, 99, 0.3);
  border-radius: 12px;
  background: rgba(17, 24, 39, 0.6);
  color: #ffffff;
  font-size: 0.9rem;
  min-width: 250px;
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

  @media (max-width: 768px) {
    min-width: 200px;
    width: 100%;
    max-width: 300px;
  }

  @media (max-width: 480px) {
    padding: 10px 12px;
    font-size: 0.8rem;
    min-width: 150px;
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

  @media (max-width: 768px) {
    width: 100%;
    max-width: 200px;
  }

  @media (max-width: 480px) {
    padding: 10px 12px;
    font-size: 0.8rem;
  }
`;

const Button = styled(motion.button)`
  padding: 12px 20px;
  border: none;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  
  ${props => props.$primary ? `
    background: linear-gradient(135deg, #4F46E5, #2563EB);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(79, 70, 229, 0.4);
    }
  ` : props.$success ? `
    background: rgba(16, 185, 129, 0.2);
    color: #10b981;
    border: 1px solid rgba(16, 185, 129, 0.3);
    
    &:hover {
      background: rgba(16, 185, 129, 0.3);
      color: #ffffff;
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

  @media (max-width: 768px) {
    padding: 10px 16px;
    font-size: 0.8rem;
  }

  @media (max-width: 480px) {
    padding: 8px 12px;
    font-size: 0.75rem;
    gap: 6px;
  }
`;

const BookingsTable = styled.div`
  background: rgba(31, 41, 55, 0.6);
  border: 1px solid rgba(75, 85, 99, 0.3);
  border-radius: 16px;
  overflow: hidden;

  @media (max-width: 768px) {
    border-radius: 12px;
  }

  @media (max-width: 480px) {
    border-radius: 8px;
  }
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr 1fr;
  gap: 16px;
  padding: 20px;
  background: rgba(17, 24, 39, 0.8);
  border-bottom: 1px solid rgba(75, 85, 99, 0.3);
  font-weight: 600;
  color: #ffffff;
  
  .payment-header {
    @media (max-width: 900px) {
      display: none;
    }
  }
  
  .actions-header {
    @media (max-width: 900px) {
      display: none;
    }
  }
  
  @media (max-width: 1200px) {
    display: none;
  }
`;

const TableRow = styled(motion.div)`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr 1fr;
  gap: 16px;
  padding: 20px;
  border-bottom: 1px solid rgba(75, 85, 99, 0.2);
  align-items: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(79, 70, 229, 0.1);
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  .payment-cell {
    @media (max-width: 900px) {
      display: none;
    }
  }
  
  .actions-cell {
    @media (max-width: 900px) {
      display: none;
    }
  }
  
  @media (max-width: 1200px) {
    display: none;
  }
`;

const MobileCard = styled(motion.div)`
  background: rgba(31, 41, 55, 0.6);
  border: 1px solid rgba(75, 85, 99, 0.3);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  display: none;
  
  @media (max-width: 1200px) {
    display: block;
  }

  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 12px;
  }

  @media (max-width: 480px) {
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 12px;
  }
`;

const Cell = styled.div`
  color: #e5e7eb;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
  
  @media (max-width: 1200px) {
    margin-bottom: 8px;
  }

  @media (max-width: 768px) {
    font-size: 0.8rem;
    gap: 6px;
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
    gap: 4px;
  }
`;

const StatusBadge = styled.span`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  
  ${props => {
    switch (props.status) {
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
      case 'completed':
        return `
          background: rgba(79, 70, 229, 0.2);
          color: #4f46e5;
        `;
      case 'no-show':
        return `
          background: rgba(75, 85, 99, 0.2);
          color: #9ca3af;
        `;
      default:
        return `
          background: rgba(75, 85, 99, 0.2);
          color: #9ca3af;
        `;
    }
  }}
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  
  @media (max-width: 1200px) {
    justify-content: flex-start;
    margin-top: 12px;
  }
`;

const LoadingSpinner = styled(motion.div)`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid #ffffff;
  border-radius: 50%;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 32px;
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
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #9ca3af;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const Modal = styled(motion.div)`
  background: rgba(17, 24, 39, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 32px;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  border: 1px solid rgba(79, 70, 229, 0.2);
  box-shadow: 0 25px 50px rgba(0,0,0,0.5);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(75, 85, 99, 0.3);
`;

const ModalTitle = styled.h3`
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(75, 85, 99, 0.3);
    color: #ffffff;
  }
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(75, 85, 99, 0.2);
  
  &:last-child {
    border-bottom: none;
  }
`;

const DetailLabel = styled.span`
  color: #9ca3af;
  font-weight: 500;
`;

const DetailValue = styled.span`
  color: #ffffff;
  font-weight: 600;
`;






const StatusIcon = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  
  ${props => {
    switch (props.status) {
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
      case 'completed':
        return `
          background: rgba(79, 70, 229, 0.2);
          color: #4f46e5;
        `;
      case 'no-show':
        return `
          background: rgba(75, 85, 99, 0.2);
          color: #9ca3af;
        `;
      default:
        return `
          background: rgba(75, 85, 99, 0.2);
          color: #9ca3af;
        `;
    }
  }}
`;

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('bookmycourt_token');
      if (!token) {
        toast.error('No authentication token found. Please login again.');
        return;
      }

      const params = {
        page: currentPage,
        limit: 20,
        search: searchTerm,
        status: statusFilter,
        dateFrom: dateFrom,
        dateTo: dateTo
      };

      console.log('Fetching bookings with params:', params);
      console.log('API URL:', `${API_BASE_URL}/admin/bookings`);

      const response = await axios.get(`${API_BASE_URL}/admin/bookings`, {
        params,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Bookings response:', response.data);

      if (response.data.success) {
        // Check for duplicate IDs and filter them out
        const bookingIds = response.data.data.bookings.map(b => b.id);
        const uniqueIds = [...new Set(bookingIds)];
        
        if (bookingIds.length !== uniqueIds.length) {
          console.warn('Duplicate booking IDs detected and filtered out');
          // Remove duplicates by keeping only the first occurrence of each ID
          const uniqueBookings = response.data.data.bookings.filter((booking, index, self) => 
            index === self.findIndex(b => b.id === booking.id)
          );
          setBookings(uniqueBookings);
        } else {
          setBookings(response.data.data.bookings);
        }
        setTotalPages(response.data.data.pagination.totalPages);
        toast.success(`Loaded ${response.data.data.bookings.length} bookings`);
      } else {
        toast.error(response.data.message || 'Failed to fetch bookings');
      }
    } catch (error) {
      console.error('Fetch bookings error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      if (error.response?.status === 401) {
        toast.error('Authentication failed. Please login again.');
      } else if (error.response?.status === 403) {
        toast.error('Access denied. Admin privileges required.');
      } else if (error.response?.status === 404) {
        toast.error('Bookings endpoint not found.');
      } else {
        toast.error(error.response?.data?.message || 'Failed to fetch bookings');
      }
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter, dateFrom, dateTo]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleStatusChange = async (bookingId, newStatus) => {
    setIsUpdating(true);
    try {
      const response = await axios.put(`${API_BASE_URL}/admin/bookings/${bookingId}/status`, {
        status: newStatus
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('bookmycourt_token')}`
        }
      });

      if (response.data.success) {
        toast.success('Booking status updated successfully');
        fetchBookings();
      }
    } catch (error) {
      console.error('Update status error:', error);
      toast.error(error.response?.data?.message || 'Failed to update booking status');
    } finally {
      setIsUpdating(false);
    }
  };



  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedBooking(null);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle2 size={12} />;
      case 'pending':
        return <Clock3 size={12} />;
      case 'cancelled':
        return <XCircle size={12} />;
      case 'completed':
        return <CheckCircle size={12} />;
      case 'no-show':
        return <AlertTriangle size={12} />;
      default:
        return <Clock3 size={12} />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };



  const statuses = [
    'pending', 'confirmed', 'cancelled', 'completed', 'no-show'
  ];

  return (
    <Container>
      <Header>
        <Title>Booking Management</Title>
        <HeaderActions>
          <SearchInput
            type="text"
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FilterSelect
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            {statuses.map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
              </option>
            ))}
          </FilterSelect>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            style={{
              padding: '12px 16px',
              border: '2px solid rgba(75, 85, 99, 0.3)',
              borderRadius: '12px',
              background: 'rgba(17, 24, 39, 0.6)',
              color: '#ffffff',
              fontSize: '0.9rem'
            }}
            placeholder="From Date"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            style={{
              padding: '12px 16px',
              border: '2px solid rgba(75, 85, 99, 0.3)',
              borderRadius: '12px',
              background: 'rgba(17, 24, 39, 0.6)',
              color: '#ffffff',
              fontSize: '0.9rem'
            }}
            placeholder="To Date"
          />
          <Button
            onClick={fetchBookings}
            disabled={isLoading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw size={16} />
            Refresh
          </Button>
        </HeaderActions>
      </Header>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <LoadingSpinner
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <div style={{ marginTop: '20px', color: '#9ca3af' }}>Loading bookings...</div>
        </div>
      ) : bookings.length === 0 ? (
        <EmptyState>
          <Calendar size={48} color="#9ca3af" />
          <h3 style={{ marginTop: '20px', color: '#ffffff' }}>No Bookings Found</h3>
          <p>No bookings match your current filters</p>
        </EmptyState>
      ) : (
        <>
          <BookingsTable>
            <TableHeader>
              <div>User & Court</div>
              <div>Date</div>
              <div>Time</div>
              <div>Amount</div>
              <div>Status</div>
              <div className="payment-header">Payment</div>
              <div className="actions-header">Actions</div>
            </TableHeader>

            {bookings.map((booking) => (
              <React.Fragment key={booking.id}>
                <TableRow
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Cell>
                    <div>
                      <div style={{ fontWeight: '600', color: '#ffffff' }}>
                        {booking.user?.firstName} {booking.user?.lastName}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                        {booking.courtName}
                      </div>
                    </div>
                  </Cell>
                  <Cell>
                    <Calendar size={16} />
                    {formatDate(booking.date)}
                  </Cell>
                  <Cell>
                    <Clock size={16} />
                    {booking.time}
                  </Cell>
                  <Cell>
                    ₹{booking.totalAmount}
                  </Cell>
                  <Cell>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <StatusIcon status={booking.status}>
                        {getStatusIcon(booking.status)}
                      </StatusIcon>
                      <StatusBadge status={booking.status}>
                        {booking.status}
                      </StatusBadge>
                    </div>
                  </Cell>
                  <Cell className="payment-cell">
                    <span style={{ 
                      color: booking.paymentStatus === 'paid' ? '#10b981' : '#f59e0b',
                      fontWeight: '600'
                    }}>
                      {booking.paymentStatus}
                    </span>
                  </Cell>
                  <Cell className="actions-cell">
                    <Actions>
                      <Button
                        onClick={() => handleViewDetails(booking)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{ marginRight: '8px' }}
                      >
                        <Eye size={14} />
                        View
                      </Button>
                      {booking.status === 'pending' && (
                        <Button
                          $success
                          onClick={() => handleStatusChange(booking.id, 'confirmed')}
                          disabled={isUpdating}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <CheckCircle size={14} />
                          Confirm
                        </Button>
                      )}
                      {booking.status === 'confirmed' && (
                        <Button
                          $danger
                          onClick={() => handleStatusChange(booking.id, 'cancelled')}
                          disabled={isUpdating}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <X size={14} />
                          Cancel
                        </Button>
                      )}
                      {booking.status === 'confirmed' && (
                        <Button
                          success
                          onClick={() => handleStatusChange(booking.id, 'completed')}
                          disabled={isUpdating}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <CheckCircle size={14} />
                          Complete
                        </Button>
                      )}
                    </Actions>
                  </Cell>
                </TableRow>

                {/* Mobile Card */}
                <MobileCard
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontWeight: '600', color: '#ffffff', marginBottom: '4px' }}>
                      {booking.user?.firstName} {booking.user?.lastName}
                    </div>
                    <div style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
                      {booking.courtName}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                    <Cell>
                      <Calendar size={16} />
                      {formatDate(booking.date)}
                    </Cell>
                    <Cell>
                      <Clock size={16} />
                      {booking.time}
                    </Cell>
                    <Cell>
                      ₹{booking.totalAmount}
                    </Cell>
                    <Cell>
                      <StatusBadge status={booking.status}>
                        {booking.status}
                      </StatusBadge>
                    </Cell>
                  </div>

                  {/* Payment Information */}
                  <div style={{ marginBottom: '16px', padding: '12px', background: 'rgba(75, 85, 99, 0.2)', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Payment Status:</span>
                      <span style={{ 
                        color: booking.paymentStatus === 'paid' ? '#10b981' : '#f59e0b',
                        fontWeight: '600',
                        fontSize: '0.9rem'
                      }}>
                        {booking.paymentStatus}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Payment Method:</span>
                      <span style={{ color: '#ffffff', fontWeight: '600', fontSize: '0.9rem' }}>
                        {booking.paymentMethod || 'Card'}
                      </span>
                    </div>
                  </div>

                  <Actions>
                    <Button
                      onClick={() => handleViewDetails(booking)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{ marginRight: '8px' }}
                    >
                      <Eye size={14} />
                      View
                    </Button>
                    {booking.status === 'pending' && (
                      <Button
                        $success
                        onClick={() => handleStatusChange(booking.id, 'confirmed')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <CheckCircle size={14} />
                        Confirm
                      </Button>
                    )}
                    {booking.status === 'confirmed' && (
                      <>
                        <Button
                          $danger
                          onClick={() => handleStatusChange(booking.id, 'cancelled')}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <X size={14} />
                          Cancel
                        </Button>
                        <Button
                          $success
                          onClick={() => handleStatusChange(booking.id, 'completed')}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <CheckCircle size={14} />
                          Complete
                        </Button>
                      </>
                    )}
                  </Actions>
                </MobileCard>
              </React.Fragment>
            ))}
          </BookingsTable>

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

      {/* Booking Details Modal */}
      {showDetailsModal && selectedBooking && (
        <ModalOverlay onClick={handleCloseModal}>
          <Modal
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader>
              <ModalTitle>Booking Details</ModalTitle>
              <CloseButton onClick={handleCloseModal}>
                <X size={20} />
              </CloseButton>
            </ModalHeader>

            <ModalContent>
              <DetailRow>
                <DetailLabel>Booking ID:</DetailLabel>
                <DetailValue>{selectedBooking.id}</DetailValue>
              </DetailRow>

              <DetailRow>
                <DetailLabel>User:</DetailLabel>
                <DetailValue>
                  {selectedBooking.user?.firstName} {selectedBooking.user?.lastName}
                </DetailValue>
              </DetailRow>

              <DetailRow>
                <DetailLabel>Email:</DetailLabel>
                <DetailValue>{selectedBooking.user?.email}</DetailValue>
              </DetailRow>

              <DetailRow>
                <DetailLabel>Phone:</DetailLabel>
                <DetailValue>{selectedBooking.user?.phone || 'Not provided'}</DetailValue>
              </DetailRow>

              <DetailRow>
                <DetailLabel>Court:</DetailLabel>
                <DetailValue>{selectedBooking.courtName}</DetailValue>
              </DetailRow>

              <DetailRow>
                <DetailLabel>Location:</DetailLabel>
                <DetailValue>{selectedBooking.location}</DetailValue>
              </DetailRow>

              <DetailRow>
                <DetailLabel>Sport:</DetailLabel>
                <DetailValue style={{ textTransform: 'capitalize' }}>
                  {selectedBooking.sport}
                </DetailValue>
              </DetailRow>

              <DetailRow>
                <DetailLabel>Date:</DetailLabel>
                <DetailValue>{formatDate(selectedBooking.date)}</DetailValue>
              </DetailRow>

              <DetailRow>
                <DetailLabel>Time:</DetailLabel>
                <DetailValue>{selectedBooking.time}</DetailValue>
              </DetailRow>

              <DetailRow>
                <DetailLabel>Duration:</DetailLabel>
                <DetailValue>{selectedBooking.duration} hour{selectedBooking.duration > 1 ? 's' : ''}</DetailValue>
              </DetailRow>

              <DetailRow>
                <DetailLabel>Total Amount:</DetailLabel>
                <DetailValue>₹{selectedBooking.totalAmount}</DetailValue>
              </DetailRow>

              <DetailRow>
                <DetailLabel>Status:</DetailLabel>
                <DetailValue>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <StatusIcon status={selectedBooking.status}>
                      {getStatusIcon(selectedBooking.status)}
                    </StatusIcon>
                    <StatusBadge status={selectedBooking.status}>
                      {selectedBooking.status}
                    </StatusBadge>
                  </div>
                </DetailValue>
              </DetailRow>

              <DetailRow>
                <DetailLabel>Payment Status:</DetailLabel>
                <DetailValue style={{ 
                  color: selectedBooking.paymentStatus === 'paid' ? '#10b981' : '#f59e0b',
                  fontWeight: '600'
                }}>
                  {selectedBooking.paymentStatus}
                </DetailValue>
              </DetailRow>

              <DetailRow>
                <DetailLabel>Payment Method:</DetailLabel>
                <DetailValue style={{ textTransform: 'capitalize' }}>
                  {selectedBooking.paymentMethod || 'Not specified'}
                </DetailValue>
              </DetailRow>


              <div style={{ 
                display: 'flex', 
                gap: '12px', 
                marginTop: '24px',
                justifyContent: 'flex-end'
              }}>
                <Button
                  onClick={handleCloseModal}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Close
                </Button>
                
                {selectedBooking.status === 'pending' && (
                    <Button
                      $success
                      onClick={() => {
                        handleStatusChange(selectedBooking.id, 'confirmed');
                        handleCloseModal();
                      }}
                    disabled={isUpdating}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <CheckCircle size={14} />
                    Confirm Booking
                  </Button>
                )}
                
                {selectedBooking.status === 'confirmed' && (
                  <>
                    <Button
                      $danger
                      onClick={() => {
                        handleStatusChange(selectedBooking.id, 'cancelled');
                        handleCloseModal();
                      }}
                      disabled={isUpdating}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <X size={14} />
                      Cancel Booking
                    </Button>
                    <Button
                      $success
                      onClick={() => {
                        handleStatusChange(selectedBooking.id, 'completed');
                        handleCloseModal();
                      }}
                      disabled={isUpdating}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <CheckCircle2 size={14} />
                      Mark Complete
                    </Button>
                  </>
                )}
              </div>
            </ModalContent>
          </Modal>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default BookingManagement;

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Plus, 
  Edit, 
  Trash2, 
  MapPin, 
  Star, 
  Users, 
  DollarSign,
  Save,
  X,
  RefreshCw
} from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Container = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;
`;

const Title = styled.h2`
  color: #ffffff;
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
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

const CourtsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const CourtCard = styled(motion.div)`
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
`;

const CourtHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const CourtName = styled.h3`
  color: #ffffff;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
  flex: 1;
`;

const StatusBadge = styled.span`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  
  ${props => {
    switch (props.$status) {
      case 'active':
        return `
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
        `;
      case 'inactive':
        return `
          background: rgba(75, 85, 99, 0.2);
          color: #9ca3af;
        `;
      case 'maintenance':
        return `
          background: rgba(245, 158, 11, 0.2);
          color: #f59e0b;
        `;
      case 'closed':
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

const CourtDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #9ca3af;
  font-size: 0.9rem;
`;

const CourtDescription = styled.p`
  color: #9ca3af;
  font-size: 0.9rem;
  margin: 16px 0;
  line-height: 1.5;
`;

const CourtFacilities = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
`;

const FacilityTag = styled.span`
  background: rgba(79, 70, 229, 0.2);
  color: #a5b4fc;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 0.8rem;
  border: 1px solid rgba(79, 70, 229, 0.3);
`;

const CourtActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

const Modal = styled(motion.div)`
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

const ModalContent = styled(motion.div)`
  background: rgba(17, 24, 39, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 32px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid rgba(79, 70, 229, 0.2);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
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

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  color: #e5e7eb;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 8px;
  display: block;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid rgba(75, 85, 99, 0.3);
  border-radius: 12px;
  background: rgba(17, 24, 39, 0.6);
  color: #ffffff;
  font-size: 1rem;
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
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid rgba(75, 85, 99, 0.3);
  border-radius: 12px;
  background: rgba(17, 24, 39, 0.6);
  color: #ffffff;
  font-size: 1rem;
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
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid rgba(75, 85, 99, 0.3);
  border-radius: 12px;
  background: rgba(17, 24, 39, 0.6);
  color: #ffffff;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
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

const CourtManagement = () => {
  const [courts, setCourts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourt, setEditingCourt] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    sport: '',
    location: {
      address: '',
      city: '',
      state: '',
      pincode: ''
    },
    capacity: '',
    pricePerHour: '',
    facilities: [],
    description: '',
    operatingHours: {
      open: '',
      close: ''
    },
    status: 'active'
  });
  const [facilityInput, setFacilityInput] = useState('');

  const fetchCourts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 12,
        search: searchTerm,
        status: statusFilter
      };

      const response = await axios.get(`${API_BASE_URL}/admin/courts`, {
        params,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('bookmycourt_token')}`
        }
      });

      if (response.data.success) {
        setCourts(response.data.data.courts);
        setTotalPages(response.data.data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Fetch courts error:', error);
      toast.error('Failed to load courts');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter]);

  useEffect(() => {
    fetchCourts();
  }, [fetchCourts]);

  const handleAddCourt = () => {
    setEditingCourt(null);
    setFormData({
      name: '',
      sport: '',
      location: {
        address: '',
        city: '',
        state: '',
        pincode: ''
      },
      capacity: '',
      pricePerHour: '',
      facilities: [],
      description: '',
      operatingHours: {
        open: '',
        close: ''
      },
      status: 'active'
    });
    setIsModalOpen(true);
  };

  const handleEditCourt = (court) => {
    setEditingCourt(court);
    setFormData({
      name: court.name,
      sport: court.sport,
      location: {
        address: court.location.address || '',
        city: court.location.city || '',
        state: court.location.state || '',
        pincode: court.location.pincode || ''
      },
      capacity: court.capacity,
      pricePerHour: court.pricePerHour,
      facilities: court.facilities || [],
      description: court.description || '',
      operatingHours: {
        open: court.operatingHours?.open || '',
        close: court.operatingHours?.close || ''
      },
      status: (court.status || 'active').toLowerCase()
    });
    setIsModalOpen(true);
  };

  const handleSaveCourt = async () => {
    try {
      // Validate and format operating hours
      const openTime = formData.operatingHours?.open || '06:00';
      const closeTime = formData.operatingHours?.close || '22:00';
      
      // Ensure time format is HH:MM (e.g., "09:00" not "9:00")
      const formatTime = (time) => {
        if (!time) return '06:00';
        // If it's already in HH:MM format, return as is
        if (/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
          return time;
        }
        // If it's in H:MM format, pad the hour
        const parts = time.split(':');
        if (parts.length === 2) {
          const hours = parts[0].padStart(2, '0');
          const minutes = parts[1];
          return `${hours}:${minutes}`;
        }
        return time;
      };
      
      // Prepare data with proper types - only include fields that can be updated
      const courtData = {
        name: formData.name?.trim() || '',
        sport: formData.sport || '',
        location: {
          address: formData.location?.address?.trim() || '',
          city: formData.location?.city?.trim() || '',
          state: formData.location?.state?.trim() || '',
          pincode: formData.location?.pincode?.trim() || ''
        },
        capacity: parseInt(formData.capacity) || 0,
        pricePerHour: parseFloat(formData.pricePerHour) || 0,
        facilities: Array.isArray(formData.facilities) ? formData.facilities : [],
        description: formData.description?.trim() || '',
        // Ensure operatingHours is properly structured with correct format
        operatingHours: {
          open: formatTime(openTime),
          close: formatTime(closeTime)
        },
        status: (formData.status || 'active').toLowerCase()
      };
      
      // Remove any undefined or null values
      Object.keys(courtData).forEach(key => {
        if (courtData[key] === undefined || courtData[key] === null) {
          delete courtData[key];
        }
      });
      
      // Log data being sent for debugging
      console.log('Saving court data:', courtData);
      
      const response = editingCourt
        ? await axios.put(`${API_BASE_URL}/admin/courts/${editingCourt.id}`, courtData, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('bookmycourt_token')}`
            }
          })
        : await axios.post(`${API_BASE_URL}/admin/courts`, courtData, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('bookmycourt_token')}`
            }
          });

      if (response.data.success) {
        toast.success(editingCourt ? 'Court updated successfully' : 'Court created successfully');
        setIsModalOpen(false);
        fetchCourts();
      }
    } catch (error) {
      console.error('Save court error:', error);
      console.error('Error response:', error.response?.data);
      
      // Better error handling - check for validation errors in different formats
      const errorData = error.response?.data;
      let errorMessage = 'Failed to save court';
      
      if (errorData) {
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        }
      }
      
      // Show detailed error to user
      toast.error(errorMessage, { duration: 5000 });
      console.error('Full error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
    }
  };

  const handleDeleteCourt = async (courtId) => {
    if (!window.confirm('Are you sure you want to delete this court?')) {
      return;
    }

    try {
      const response = await axios.delete(`${API_BASE_URL}/admin/courts/${courtId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('bookmycourt_token')}`
        }
      });

      if (response.data.success) {
        toast.success('Court deleted successfully');
        fetchCourts();
      }
    } catch (error) {
      console.error('Delete court error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete court');
    }
  };

  const addFacility = () => {
    if (facilityInput.trim()) {
      setFormData(prev => ({
        ...prev,
        facilities: [...prev.facilities, facilityInput.trim()]
      }));
      setFacilityInput('');
    }
  };

  const removeFacility = (index) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.filter((_, i) => i !== index)
    }));
  };

  const sports = [
    'cricket', 'football', 'basketball', 'tennis', 'badminton', 
    'volleyball', 'hockey', 'table-tennis', 'squash'
  ];


  return (
    <Container>
      <Header>
        <Title>Court Management</Title>
        <HeaderActions>
          <SearchInput
            type="text"
            placeholder="Search courts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FilterSelect
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="maintenance">Maintenance</option>
            <option value="closed">Closed</option>
          </FilterSelect>
          <Button
            onClick={fetchCourts}
            disabled={isLoading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw size={16} />
            Refresh
          </Button>
          <Button
            $primary
            onClick={handleAddCourt}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={16} />
            Add Court
          </Button>
        </HeaderActions>
      </Header>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <LoadingSpinner
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <div style={{ marginTop: '20px', color: '#9ca3af' }}>Loading courts...</div>
        </div>
      ) : (
        <>
          <CourtsGrid>
            {courts.map((court) => (
              <CourtCard
                key={court.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.02 }}
              >
                <CourtHeader>
                  <CourtName>{court.name}</CourtName>
                  <StatusBadge $status={court.status || (court.statusDisplay ? court.statusDisplay.toLowerCase() : 'active')}>
                    {court.statusDisplay || court.status}
                  </StatusBadge>
                </CourtHeader>

                <CourtDetails>
                  <DetailItem>
                    <MapPin size={16} />
                    {court.fullAddress || (typeof court.location === 'string' ? court.location : `${court.location?.address || ''}, ${court.location?.city || ''}`)}
                  </DetailItem>
                  <DetailItem>
                    <Users size={16} />
                    {court.capacity} people
                  </DetailItem>
                  <DetailItem>
                    <DollarSign size={16} />
                    ₹{court.pricePerHour}/hour
                  </DetailItem>
                  <DetailItem>
                    <Star size={16} />
                    {court.rating}
                  </DetailItem>
                </CourtDetails>

                {court.description && (
                  <CourtDescription>{court.description}</CourtDescription>
                )}

                <CourtFacilities>
                  {court.facilities.map((facility, index) => (
                    <FacilityTag key={index}>{facility}</FacilityTag>
                  ))}
                </CourtFacilities>

                <CourtActions>
                  <Button
                    onClick={() => handleEditCourt(court)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Edit size={16} />
                    Edit
                  </Button>
                  <Button
                    $danger
                    onClick={() => handleDeleteCourt(court.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Trash2 size={16} />
                    Delete
                  </Button>
                </CourtActions>
              </CourtCard>
            ))}
          </CourtsGrid>

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

      {isModalOpen && (
        <Modal
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}
        >
          <ModalContent
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <ModalHeader>
              <ModalTitle>
                {editingCourt ? 'Edit Court' : 'Add New Court'}
              </ModalTitle>
              <CloseButton onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </CloseButton>
            </ModalHeader>

            <FormGrid>
              <FormGroup>
                <Label>Court Name</Label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter court name"
                />
              </FormGroup>

              <FormGroup>
                <Label>Sport</Label>
                <Select
                  value={formData.sport}
                  onChange={(e) => setFormData(prev => ({ ...prev, sport: e.target.value }))}
                >
                  <option value="">Select Sport</option>
                  {sports.map(sport => (
                    <option key={sport} value={sport}>
                      {sport.charAt(0).toUpperCase() + sport.slice(1).replace('-', ' ')}
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Address</Label>
                <Input
                  type="text"
                  value={formData.location.address}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    location: { ...prev.location, address: e.target.value }
                  }))}
                  placeholder="Enter address"
                />
              </FormGroup>

              <FormGroup>
                <Label>City</Label>
                <Input
                  type="text"
                  value={formData.location.city}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    location: { ...prev.location, city: e.target.value }
                  }))}
                  placeholder="Enter city"
                />
              </FormGroup>

              <FormGroup>
                <Label>State</Label>
                <Input
                  type="text"
                  value={formData.location.state}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    location: { ...prev.location, state: e.target.value }
                  }))}
                  placeholder="Enter state"
                />
              </FormGroup>

              <FormGroup>
                <Label>Pincode</Label>
                <Input
                  type="text"
                  value={formData.location.pincode}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    location: { ...prev.location, pincode: e.target.value }
                  }))}
                  placeholder="Enter pincode"
                />
              </FormGroup>

              <FormGroup>
                <Label>Capacity</Label>
                <Input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
                  placeholder="Enter capacity"
                />
              </FormGroup>

              <FormGroup>
                <Label>Price per Hour (₹)</Label>
                <Input
                  type="number"
                  value={formData.pricePerHour}
                  onChange={(e) => setFormData(prev => ({ ...prev, pricePerHour: e.target.value }))}
                  placeholder="Enter price per hour"
                />
              </FormGroup>

              <FormGroup>
                <Label>Opening Time</Label>
                <Input
                  type="time"
                  value={formData.operatingHours.open}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    operatingHours: { ...prev.operatingHours, open: e.target.value }
                  }))}
                />
              </FormGroup>

              <FormGroup>
                <Label>Closing Time</Label>
                <Input
                  type="time"
                  value={formData.operatingHours.close}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    operatingHours: { ...prev.operatingHours, close: e.target.value }
                  }))}
                />
              </FormGroup>

              <FormGroup>
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="closed">Closed</option>
                </Select>
              </FormGroup>
            </FormGrid>

            <FormGroup>
              <Label>Description</Label>
              <TextArea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter court description"
              />
            </FormGroup>

            <FormGroup>
              <Label>Facilities</Label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <Input
                  type="text"
                  value={facilityInput}
                  onChange={(e) => setFacilityInput(e.target.value)}
                  placeholder="Add facility"
                  onKeyPress={(e) => e.key === 'Enter' && addFacility()}
                />
                <Button onClick={addFacility}>
                  <Plus size={16} />
                </Button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {formData.facilities.map((facility, index) => (
                  <FacilityTag key={index}>
                    {facility}
                    <button
                      onClick={() => removeFacility(index)}
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: '#a5b4fc', 
                        marginLeft: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <X size={12} />
                    </button>
                  </FacilityTag>
                ))}
              </div>
            </FormGroup>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <Button onClick={() => setIsModalOpen(false)}>
                <X size={16} />
                Cancel
              </Button>
              <Button $primary onClick={handleSaveCourt}>
                <Save size={16} />
                {editingCourt ? 'Update Court' : 'Create Court'}
              </Button>
            </div>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default CourtManagement;

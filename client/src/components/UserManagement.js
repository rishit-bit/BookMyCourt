import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Search, 
  Filter, 
  User, 
  Mail, 
  Phone, 
  Calendar,
  Shield,
  UserCheck,
  UserX,
  RefreshCw,
  Eye,
  Edit
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
  
  ${props => props.primary ? `
    background: linear-gradient(135deg, #4F46E5, #2563EB);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(79, 70, 229, 0.4);
    }
  ` : props.success ? `
    background: rgba(16, 185, 129, 0.2);
    color: #10b981;
    border: 1px solid rgba(16, 185, 129, 0.3);
    
    &:hover {
      background: rgba(16, 185, 129, 0.3);
      color: #ffffff;
    }
  ` : props.danger ? `
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

const UsersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`;

const UserCard = styled(motion.div)`
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

const UserHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h3`
  color: #ffffff;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 4px 0;
`;

const UserEmail = styled.p`
  color: #9ca3af;
  font-size: 0.9rem;
  margin: 0;
`;

const RoleBadge = styled.span`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  
  ${props => {
    switch (props.role) {
      case 'super_admin':
        return `
          background: rgba(139, 92, 246, 0.2);
          color: #8b5cf6;
        `;
      case 'admin':
        return `
          background: rgba(79, 70, 229, 0.2);
          color: #4f46e5;
        `;
      case 'user':
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

const UserDetails = styled.div`
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

const StatusBadge = styled.span`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  
  ${props => props.active ? `
    background: rgba(16, 185, 129, 0.2);
    color: #10b981;
  ` : `
    background: rgba(239, 68, 68, 0.2);
    color: #ef4444;
  `}
`;

const UserActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 16px;
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

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, roleFilter, statusFilter, currentPage]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 12,
        search: searchTerm,
        role: roleFilter,
        status: statusFilter
      };

      const response = await axios.get(`${API_BASE_URL}/admin/users`, {
        params,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('bookmycourt_token')}`
        }
      });

      if (response.data.success) {
        setUsers(response.data.data.users);
        setTotalPages(response.data.data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Fetch users error:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    const newStatus = !currentStatus;
    
    try {
      const response = await axios.put(`${API_BASE_URL}/admin/users/${userId}/status`, {
        isActive: newStatus
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('bookmycourt_token')}`
        }
      });

      if (response.data.success) {
        toast.success(`User ${newStatus ? 'activated' : 'deactivated'} successfully`);
        fetchUsers();
      }
    } catch (error) {
      console.error('Toggle status error:', error);
      toast.error(error.response?.data?.message || 'Failed to update user status');
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

  const roles = [
    { value: 'user', label: 'User' },
    { value: 'admin', label: 'Admin' },
    { value: 'super_admin', label: 'Super Admin' }
  ];

  return (
    <Container>
      <Header>
        <Title>User Management</Title>
        <HeaderActions>
          <SearchInput
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FilterSelect
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            {roles.map(role => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </FilterSelect>
          <FilterSelect
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </FilterSelect>
          <Button
            onClick={fetchUsers}
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
          <div style={{ marginTop: '20px', color: '#9ca3af' }}>Loading users...</div>
        </div>
      ) : users.length === 0 ? (
        <EmptyState>
          <User size={48} color="#9ca3af" />
          <h3 style={{ marginTop: '20px', color: '#ffffff' }}>No Users Found</h3>
          <p>No users match your current filters</p>
        </EmptyState>
      ) : (
        <>
          <UsersGrid>
            {users.map((user) => (
              <UserCard
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.02 }}
              >
                <UserHeader>
                  <UserInfo>
                    <UserName>{user.firstName} {user.lastName}</UserName>
                    <UserEmail>{user.email}</UserEmail>
                  </UserInfo>
                  <RoleBadge role={user.role}>
                    {user.role.replace('_', ' ')}
                  </RoleBadge>
                </UserHeader>

                <UserDetails>
                  <DetailItem>
                    <Phone size={16} />
                    {user.phone || 'Not provided'}
                  </DetailItem>
                  <DetailItem>
                    <Calendar size={16} />
                    Joined {formatDate(user.createdAt)}
                  </DetailItem>
                  <DetailItem>
                    <Shield size={16} />
                    <StatusBadge active={user.isActive}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </StatusBadge>
                  </DetailItem>
                  <DetailItem>
                    <Mail size={16} />
                    {user.isEmailVerified ? 'Verified' : 'Unverified'}
                  </DetailItem>
                </UserDetails>

                {user.lastLogin && (
                  <div style={{ marginBottom: '16px' }}>
                    <DetailItem>
                      <Calendar size={16} />
                      Last login: {formatDate(user.lastLogin)}
                    </DetailItem>
                  </div>
                )}

                <UserActions>
                  <Button
                    onClick={() => handleStatusToggle(user.id, user.isActive)}
                    disabled={user.role === 'super_admin'}
                    success={user.isActive}
                    danger={!user.isActive}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {user.isActive ? (
                      <>
                        <UserX size={16} />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <UserCheck size={16} />
                        Activate
                      </>
                    )}
                  </Button>
                </UserActions>
              </UserCard>
            ))}
          </UsersGrid>

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
    </Container>
  );
};

export default UserManagement;

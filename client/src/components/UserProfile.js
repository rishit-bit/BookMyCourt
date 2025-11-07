import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  User, 
  Mail, 
  Lock, 
  Save, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Camera,
  Upload,
  X
} from 'lucide-react';
import Logo from './Logo';

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

const Card = styled(motion.div)`
  background: rgba(17, 24, 39, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 40px;
  width: 100%;
  max-width: 600px;
  box-shadow: 
    0 25px 50px rgba(0,0,0,0.4),
    0 0 0 1px rgba(79, 70, 229, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(79, 70, 229, 0.2);
  position: relative;
  z-index: 2;
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

const IconContainer = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #4F46E5, #2563EB);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  box-shadow: 0 10px 30px rgba(79, 70, 229, 0.3);
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
`;

const Subtitle = styled.p`
  color: #9ca3af;
  font-size: 1.1rem;
  text-align: center;
  margin-bottom: 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  color: #e5e7eb;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Input = styled.input`
  padding: 16px 20px;
  border: 2px solid rgba(75, 85, 99, 0.3);
  border-radius: 12px;
  background: rgba(31, 41, 55, 0.6);
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #4F46E5;
    background: rgba(31, 41, 55, 0.8);
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }
  
  &::placeholder {
    color: #6b7280;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PasswordContainer = styled.div`
  position: relative;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease;
  
  &:hover {
    color: #ffffff;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 32px;
`;

const Button = styled(motion.button)`
  padding: 16px 32px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 140px;
  justify-content: center;
  
  ${props => props.primary ? `
    background: linear-gradient(135deg, #4F46E5, #2563EB);
    color: white;
    box-shadow: 0 10px 25px rgba(79, 70, 229, 0.3);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 15px 35px rgba(79, 70, 229, 0.4);
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
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
`;

const SuccessMessage = styled.div`
  color: #10b981;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
`;

const ProfilePhotoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-bottom: 32px;
  padding: 24px;
  background: rgba(31, 41, 55, 0.6);
  border: 1px solid rgba(75, 85, 99, 0.3);
  border-radius: 16px;
`;

const PhotoContainer = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid rgba(79, 70, 229, 0.3);
  background: rgba(31, 41, 55, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProfilePhoto = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const DefaultPhoto = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4F46E5, #2563EB);
  color: white;
  font-size: 2rem;
`;

const PhotoOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  cursor: pointer;
  
  ${PhotoContainer}:hover & {
    opacity: 1;
  }
`;

const PhotoActions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const PhotoButton = styled(motion.button)`
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
  
  ${props => props.primary ? `
    background: linear-gradient(135deg, #4F46E5, #2563EB);
    color: white;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 5px 15px rgba(79, 70, 229, 0.3);
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
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const PhotoInfo = styled.div`
  text-align: center;
  color: #9ca3af;
  font-size: 0.9rem;
`;

const UserProfile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [needsEmailVerification, setNeedsEmailVerification] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(user?.profilePhoto || null);
  const [selectedFile, setSelectedFile] = useState(null);

  // Debug: Log current photo preview
  console.log('Current photoPreview:', photoPreview);
  console.log('Current user profilePhoto:', user?.profilePhoto);

  // Update photo preview when user changes
  useEffect(() => {
    if (user?.profilePhoto) {
      setPhotoPreview(user.profilePhoto);
    }
  }, [user?.profilePhoto]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleOTPChange = (index, value) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOTPKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Only validate password fields if any password field is filled
    if (formData.currentPassword || formData.newPassword || formData.confirmPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Current password is required to change password';
      }

      if (!formData.newPassword) {
        newErrors.newPassword = 'New password is required';
      } else if (formData.newPassword.length < 6) {
        newErrors.newPassword = 'Password must be at least 6 characters';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your new password';
      } else if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setSuccess('');

    try {
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email
      };

      // Only include password data if password is being changed
      if (formData.currentPassword && formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const response = await axios.put(`${API_BASE_URL}/users/profile`, updateData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('bookmycourt_token')}`
        }
      });

      if (response.data.success) {
        // Update user context
        updateUser(response.data.data.user);
        localStorage.setItem('bookmycourt_user', JSON.stringify(response.data.data.user));
        
        setSuccess(response.data.message);
        toast.success(response.data.message);
        
        // Check if email verification is needed
        if (response.data.needsEmailVerification) {
          setNeedsEmailVerification(true);
        }
        
        // Clear password fields
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      toast.error(errorMessage);
      
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP code');
      return;
    }

    setIsVerifyingEmail(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/users/verify-new-email`, {
        otp: otpCode
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('bookmycourt_token')}`
        }
      });

      if (response.data.success) {
        // Update user context
        updateUser(response.data.data.user);
        localStorage.setItem('bookmycourt_user', JSON.stringify(response.data.data.user));
        
        setSuccess(response.data.message);
        toast.success(response.data.message);
        setNeedsEmailVerification(false);
        setOtp(['', '', '', '', '', '']);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to verify email';
      toast.error(errorMessage);
    } finally {
      setIsVerifyingEmail(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    // Store file and create preview
    setSelectedFile(file);
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setPhotoPreview(previewUrl);
  };

  const handleUploadPhoto = async () => {
    if (!selectedFile) {
      toast.error('Please select a photo first');
      return;
    }

    setIsUploadingPhoto(true);

    try {
      const formData = new FormData();
      formData.append('profilePhoto', selectedFile);

      const response = await axios.post(`${API_BASE_URL}/users/upload-photo`, formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('bookmycourt_token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        // Update user context
        updateUser(response.data.data.user);
        localStorage.setItem('bookmycourt_user', JSON.stringify(response.data.data.user));
        
        // Update preview to use the server URL
        const photoUrl = response.data.data.user.profilePhoto;
        console.log('Photo URL from server:', photoUrl);
        setPhotoPreview(photoUrl);
        setSelectedFile(null);
        
        toast.success(response.data.message);
        setSuccess(response.data.message);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to upload photo';
      toast.error(errorMessage);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = async () => {
    setIsUploadingPhoto(true);

    try {
      const response = await axios.delete(`${API_BASE_URL}/users/photo`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('bookmycourt_token')}`
        }
      });

      if (response.data.success) {
        // Update user context
        updateUser(response.data.data.user);
        localStorage.setItem('bookmycourt_user', JSON.stringify(response.data.data.user));
        
        setPhotoPreview(null);
        setSelectedFile(null);
        toast.success(response.data.message);
        setSuccess(response.data.message);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to remove photo';
      toast.error(errorMessage);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleBack = () => {
    window.history.back();
  };

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

      <Card
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Header>
          <LogoContainer>
            <Logo />
          </LogoContainer>
          
          <IconContainer>
            <User size={40} color="white" />
          </IconContainer>
          
          <Title>Edit Profile</Title>
          <Subtitle>Update your personal information and security settings</Subtitle>
        </Header>

        <Form onSubmit={handleSubmit}>
          <ProfilePhotoSection>
            <PhotoContainer onClick={() => document.getElementById('photo-upload').click()}>
              {photoPreview ? (
                <ProfilePhoto 
                  src={photoPreview.startsWith('http') ? photoPreview : `http://localhost:5000${photoPreview}`} 
                  alt="Profile"
                  onError={(e) => {
                    console.error('Image load error:', e);
                    console.log('Failed to load image:', photoPreview);
                  }}
                />
              ) : (
                <DefaultPhoto>
                  <User size={48} />
                </DefaultPhoto>
              )}
              <PhotoOverlay>
                <Camera size={24} color="white" />
              </PhotoOverlay>
            </PhotoContainer>
            
            <PhotoInfo>
              Click on the photo to upload a new one
              <br />
              Supported formats: JPEG, PNG, GIF, WebP (max 5MB)
              <br />
              {photoPreview && (
                <div style={{ marginTop: '10px', fontSize: '0.8rem', color: '#6b7280' }}>
                  Current URL: {photoPreview}
                </div>
              )}
            </PhotoInfo>
            
            <PhotoActions>
              <HiddenFileInput
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
              />
              
              <PhotoButton
                primary
                onClick={handleUploadPhoto}
                disabled={!selectedFile || isUploadingPhoto}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isUploadingPhoto ? (
                  <LoadingSpinner
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  <>
                    <Upload size={16} />
                    Upload Photo
                  </>
                )}
              </PhotoButton>
              
              {photoPreview && (
                <PhotoButton
                  danger
                  onClick={handleRemovePhoto}
                  disabled={isUploadingPhoto}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X size={16} />
                  Remove
                </PhotoButton>
              )}
            </PhotoActions>
          </ProfilePhotoSection>

          <InputGroup>
            <Label>
              <User size={16} />
              First Name
            </Label>
            <Input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="Enter your first name"
              required
            />
            {errors.firstName && (
              <ErrorMessage>
                <AlertCircle size={16} />
                {errors.firstName}
              </ErrorMessage>
            )}
          </InputGroup>

          <InputGroup>
            <Label>
              <User size={16} />
              Last Name
            </Label>
            <Input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Enter your last name"
              required
            />
            {errors.lastName && (
              <ErrorMessage>
                <AlertCircle size={16} />
                {errors.lastName}
              </ErrorMessage>
            )}
          </InputGroup>

          <InputGroup>
            <Label>
              <Mail size={16} />
              Email Address
            </Label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email address"
              required
            />
            {errors.email && (
              <ErrorMessage>
                <AlertCircle size={16} />
                {errors.email}
              </ErrorMessage>
            )}
          </InputGroup>

          <InputGroup>
            <Label>
              <Lock size={16} />
              Current Password (required to change password)
            </Label>
            <PasswordContainer>
              <Input
                type={showPasswords.current ? "text" : "password"}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                placeholder="Enter your current password"
              />
              <PasswordToggle
                type="button"
                onClick={() => togglePasswordVisibility('current')}
              >
                {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
              </PasswordToggle>
            </PasswordContainer>
            {errors.currentPassword && (
              <ErrorMessage>
                <AlertCircle size={16} />
                {errors.currentPassword}
              </ErrorMessage>
            )}
          </InputGroup>

          <InputGroup>
            <Label>
              <Lock size={16} />
              New Password
            </Label>
            <PasswordContainer>
              <Input
                type={showPasswords.new ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder="Enter your new password"
              />
              <PasswordToggle
                type="button"
                onClick={() => togglePasswordVisibility('new')}
              >
                {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
              </PasswordToggle>
            </PasswordContainer>
            {errors.newPassword && (
              <ErrorMessage>
                <AlertCircle size={16} />
                {errors.newPassword}
              </ErrorMessage>
            )}
          </InputGroup>

          <InputGroup>
            <Label>
              <Lock size={16} />
              Confirm New Password
            </Label>
            <PasswordContainer>
              <Input
                type={showPasswords.confirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your new password"
              />
              <PasswordToggle
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
              >
                {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </PasswordToggle>
            </PasswordContainer>
            {errors.confirmPassword && (
              <ErrorMessage>
                <AlertCircle size={16} />
                {errors.confirmPassword}
              </ErrorMessage>
            )}
          </InputGroup>

          {needsEmailVerification && (
            <InputGroup>
              <Label>
                <Mail size={16} />
                Verify New Email Address
              </Label>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '16px' }}>
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOTPChange(index, e.target.value)}
                    onKeyDown={(e) => handleOTPKeyDown(index, e)}
                    maxLength="1"
                    style={{
                      width: '50px',
                      height: '50px',
                      textAlign: 'center',
                      fontSize: '1.2rem',
                      fontWeight: '600'
                    }}
                  />
                ))}
              </div>
              <Button
                type="button"
                primary
                onClick={handleVerifyEmail}
                disabled={isVerifyingEmail || otp.join('').length !== 6}
                style={{ margin: '0 auto' }}
              >
                {isVerifyingEmail ? (
                  <LoadingSpinner
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  'Verify Email'
                )}
              </Button>
            </InputGroup>
          )}

          {success && (
            <SuccessMessage>
              <CheckCircle size={16} />
              {success}
            </SuccessMessage>
          )}

          <ButtonGroup>
            <Button
              type="button"
              onClick={handleBack}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft size={20} />
              Back
            </Button>
            
            <Button
              type="submit"
              primary
              disabled={isLoading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isLoading ? (
                <LoadingSpinner
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                <>
                  <Save size={20} />
                  Save Changes
                </>
              )}
            </Button>
          </ButtonGroup>
        </Form>
      </Card>
    </Container>
  );
};

export default UserProfile;

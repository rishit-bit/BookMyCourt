import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { Mail, ArrowLeft, RefreshCw, CheckCircle } from 'lucide-react';
import Logo from './Logo';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Container = styled.div`
  width: 100vw;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #0B0E23 0%, #1A1B3D 25%, #2D1B69 50%, #1A1B3D 75%, #0B0E23 100%);
  perspective: 1000px;
  -webkit-perspective: 1000px;
  transform-style: preserve-3d;
  -webkit-transform-style: preserve-3d;
  transform: translate3d(0,0,0);
  -webkit-transform: translate3d(0,0,0);
  will-change: transform;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const Background = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1;
  background:
    radial-gradient(circle at 20% 20%, rgba(55, 48, 163, 0.15) 0, transparent 40%),
    radial-gradient(circle at 80% 10%, rgba(79, 70, 229, 0.12) 0, transparent 35%),
    radial-gradient(circle at 10% 80%, rgba(37, 99, 235, 0.1) 0, transparent 35%),
    linear-gradient(135deg, rgba(255,255,255,0.02), rgba(0,0,0,0.01));
  pointer-events: none;
`;

const FloatingElements = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    background: linear-gradient(45deg, rgba(79, 70, 229, 0.1), rgba(37, 99, 235, 0.1));
    animation: float 20s ease-in-out infinite;
    will-change: transform;
  }
  
  &::before {
    width: 300px;
    height: 300px;
    top: 10%;
    left: 5%;
    animation-delay: 0s;
  }
  
  &::after {
    width: 200px;
    height: 200px;
    top: 60%;
    right: 10%;
    animation-delay: -10s;
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
  }
`;

const Card = styled(motion.div)`
  background: rgba(17, 24, 39, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 40px;
  width: 100%;
  max-width: 500px;
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
  font-size: 28px;
  font-weight: 700;
  color: #E5E7EB;
  margin: 0 0 10px 0;
  background: linear-gradient(135deg, #4F46E5, #2563EB);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  color: #A1A1AA;
  font-size: 16px;
  margin: 0;
  line-height: 1.5;
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
  font-weight: 600;
  color: #E5E7EB;
  font-size: 14px;
`;

const Input = styled.input`
  padding: 16px 20px;
  border: 2px solid rgba(79, 70, 229, 0.2);
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: rgba(17, 24, 39, 0.5);
  color: #E5E7EB;
  
  &:focus {
    outline: none;
    border-color: #4F46E5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }
  
  &::placeholder {
    color: #A1A1AA;
  }
`;

const OTPContainer = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin: 20px 0;
`;

const OTPInput = styled.input`
  width: 50px;
  height: 50px;
  border: 2px solid rgba(79, 70, 229, 0.2);
  border-radius: 12px;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  transition: all 0.3s ease;
  background: rgba(17, 24, 39, 0.5);
  color: #E5E7EB;
  
  &:focus {
    outline: none;
    border-color: #4F46E5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }
  
  &.filled {
    border-color: #10B981;
    background: rgba(16, 185, 129, 0.1);
  }
`;

const Button = styled(motion.button)`
  background: linear-gradient(135deg, #4F46E5 0%, #2563EB 100%);
  color: white;
  border: none;
  padding: 16px 24px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(79, 70, 229, 0.4);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(79, 70, 229, 0.6);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const SecondaryButton = styled(motion.button)`
  background: transparent;
  color: #4F46E5;
  border: 2px solid #4F46E5;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    background: #4F46E5;
    color: white;
  }
`;

const ResendContainer = styled.div`
  text-align: center;
  margin-top: 20px;
`;

const ResendText = styled.p`
  color: #A1A1AA;
  font-size: 14px;
  margin: 0 0 10px 0;
`;

const Countdown = styled.span`
  color: #4F46E5;
  font-weight: 600;
`;

const SuccessMessage = styled(motion.div)`
  background: linear-gradient(135deg, #10B981, #059669);
  color: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const OTPVerification = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { user, updateUser } = useAuth();

  useEffect(() => {
    // Get email from location state or user context
    const emailFromState = location.state?.email;
    const emailFromUser = user?.email;
    setEmail(emailFromState || emailFromUser || '');
  }, [location.state, user]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

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

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Email is required');
      return;
    }

    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP code');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/verify-otp`, {
        email,
        otp: otpCode
      });

      if (response.data.success) {
        setIsVerified(true);
        toast.success(response.data.message);
        
        // Update user context with the verified user data
        if (response.data.data) {
          localStorage.setItem('bookmycourt_user', JSON.stringify(response.data.data.user));
          localStorage.setItem('bookmycourt_token', response.data.data.token);
          
          // Update AuthContext with the verified user data
          updateUser(response.data.data.user);
        }
        
        // Redirect based on sport selection after 1 second
        setTimeout(() => {
          const userData = response.data.data?.user || JSON.parse(localStorage.getItem('bookmycourt_user') || '{}');
          
          // Redirect admin users directly to admin panel
          if (userData?.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/dashboard');
          }
        }, 1000);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Verification failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email) {
      toast.error('Email is required');
      return;
    }

    setIsResending(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/resend-otp`, {
        email
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setCountdown(60); // 60 seconds countdown
        setOtp(['', '', '', '', '', '']); // Clear OTP inputs
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to resend OTP. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/auth');
  };

  if (isVerified) {
    return (
      <Container>
        <Background />
        <FloatingElements />
        <Card
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SuccessMessage
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <CheckCircle size={24} />
            Email verified successfully! Redirecting to dashboard...
          </SuccessMessage>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <Background />
      <FloatingElements />
      <Card
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Header>
          <LogoContainer>
            <Logo size="medium" />
          </LogoContainer>
          <IconContainer>
            <Mail size={32} color="white" />
          </IconContainer>
          <Title>Verify Your Email</Title>
          <Subtitle>
            We've sent a 6-digit verification code to<br />
            <strong style={{ color: '#E5E7EB' }}>{email}</strong>
          </Subtitle>
        </Header>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>Email Address</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </InputGroup>

          <InputGroup>
            <Label>Verification Code</Label>
            <OTPContainer>
              {otp.map((digit, index) => (
                <OTPInput
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={digit}
                  onChange={(e) => handleOTPChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={digit ? 'filled' : ''}
                  maxLength={1}
                />
              ))}
            </OTPContainer>
          </InputGroup>

          <Button
            type="submit"
            disabled={isLoading || otp.join('').length !== 6}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <>
                <RefreshCw size={20} className="animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify Email'
            )}
          </Button>

          <SecondaryButton
            type="button"
            onClick={handleBackToLogin}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowLeft size={16} />
            Back to Login
          </SecondaryButton>
        </Form>

        <ResendContainer>
          <ResendText>
            Didn't receive the code?
          </ResendText>
          {countdown > 0 ? (
            <ResendText>
              Resend code in <Countdown>{countdown}s</Countdown>
            </ResendText>
          ) : (
            <SecondaryButton
              onClick={handleResendOTP}
              disabled={isResending}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isResending ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <RefreshCw size={16} />
                  Resend Code
                </>
              )}
            </SecondaryButton>
          )}
        </ResendContainer>
      </Card>
    </Container>
  );
};

export default OTPVerification;

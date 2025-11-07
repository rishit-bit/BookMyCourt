import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Calendar, 
  CreditCard, 
  MapPin, 
  Star, 
  Users, 
  AlertCircle,
  ArrowLeft
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
  
  @media (max-width: 768px) {
    padding: 15px;
    align-items: flex-start;
    padding-top: 50px;
  }
  
  @media (max-width: 480px) {
    padding: 10px;
    padding-top: 40px;
  }
  
  @media (max-width: 400px) {
    padding: 8px;
    padding-top: 30px;
  }
  
  @media (max-width: 300px) {
    padding: 5px;
    padding-top: 20px;
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
  max-width: 900px;
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
    max-width: 100%;
  }
  
  @media (max-width: 480px) {
    padding: 20px;
    border-radius: 16px;
  }
  
  @media (max-width: 400px) {
    padding: 16px;
    border-radius: 12px;
  }
  
  @media (max-width: 300px) {
    padding: 12px;
    border-radius: 8px;
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
  
  @media (max-width: 400px) {
    font-size: 1.5rem;
  }
  
  @media (max-width: 300px) {
    font-size: 1.3rem;
  }
`;

const Subtitle = styled.p`
  color: #9ca3af;
  font-size: 1.1rem;
  text-align: center;
  margin-bottom: 0;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
  
  @media (max-width: 400px) {
    font-size: 0.8rem;
  }
  
  @media (max-width: 300px) {
    font-size: 0.75rem;
  }
`;

const BookingContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`;

const CourtInfo = styled.div`
  background: rgba(31, 41, 55, 0.6);
  border: 1px solid rgba(75, 85, 99, 0.3);
  border-radius: 16px;
  padding: 24px;
  
  @media (max-width: 768px) {
    padding: 20px;
  }
  
  @media (max-width: 480px) {
    padding: 16px;
    border-radius: 12px;
  }
  
  @media (max-width: 400px) {
    padding: 12px;
    border-radius: 8px;
  }
  
  @media (max-width: 300px) {
    padding: 8px;
    border-radius: 6px;
  }
`;

const CourtName = styled.h2`
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.2rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  @media (max-width: 400px) {
    font-size: 1.1rem;
    gap: 6px;
  }
  
  @media (max-width: 300px) {
    font-size: 1rem;
    gap: 4px;
  }
`;

const CourtLocation = styled.p`
  color: #9ca3af;
  font-size: 1rem;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  @media (max-width: 400px) {
    font-size: 0.8rem;
    gap: 3px;
  }
  
  @media (max-width: 300px) {
    font-size: 0.75rem;
    gap: 2px;
  }
`;

const CourtPrice = styled.div`
  color: #10b981;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 16px;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
  
  @media (max-width: 400px) {
    font-size: 1.1rem;
  }
  
  @media (max-width: 300px) {
    font-size: 1rem;
  }
`;

const CourtRating = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fbbf24;
  font-size: 1rem;
  margin-bottom: 16px;
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  @media (max-width: 400px) {
    font-size: 0.8rem;
    gap: 3px;
  }
  
  @media (max-width: 300px) {
    font-size: 0.75rem;
    gap: 2px;
  }
`;

const CourtCapacity = styled.div`
  color: #9ca3af;
  font-size: 0.9rem;
  margin-bottom: 20px;
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  @media (max-width: 400px) {
    font-size: 0.75rem;
    gap: 3px;
  }
  
  @media (max-width: 300px) {
    font-size: 0.7rem;
    gap: 2px;
  }
`;

const CourtFacilities = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  
  @media (max-width: 480px) {
    gap: 6px;
  }
  
  @media (max-width: 400px) {
    gap: 4px;
  }
  
  @media (max-width: 300px) {
    gap: 3px;
  }
`;

const FacilityTag = styled.span`
  background: rgba(79, 70, 229, 0.2);
  color: #a5b4fc;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  border: 1px solid rgba(79, 70, 229, 0.3);
  
  @media (max-width: 480px) {
    padding: 4px 8px;
    font-size: 0.7rem;
    border-radius: 8px;
  }
  
  @media (max-width: 400px) {
    padding: 3px 6px;
    font-size: 0.65rem;
    border-radius: 6px;
  }
  
  @media (max-width: 300px) {
    padding: 2px 4px;
    font-size: 0.6rem;
    border-radius: 4px;
  }
`;

const BookingForm = styled.div`
  background: rgba(31, 41, 55, 0.6);
  border: 1px solid rgba(75, 85, 99, 0.3);
  border-radius: 16px;
  padding: 24px;
  
  @media (max-width: 768px) {
    padding: 20px;
  }
  
  @media (max-width: 480px) {
    padding: 16px;
    border-radius: 12px;
  }
  
  @media (max-width: 400px) {
    padding: 12px;
    border-radius: 8px;
  }
  
  @media (max-width: 300px) {
    padding: 8px;
    border-radius: 6px;
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
  }
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  @media (max-width: 400px) {
    font-size: 1rem;
    gap: 6px;
  }
  
  @media (max-width: 300px) {
    font-size: 0.9rem;
    gap: 4px;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
  
  @media (max-width: 480px) {
    margin-bottom: 20px;
  }
  
  @media (max-width: 400px) {
    margin-bottom: 16px;
  }
  
  @media (max-width: 300px) {
    margin-bottom: 12px;
  }
`;

const Label = styled.label`
  color: #e5e7eb;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 8px;
  display: block;
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
  
  @media (max-width: 400px) {
    font-size: 0.75rem;
  }
  
  @media (max-width: 300px) {
    font-size: 0.7rem;
  }
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
  
  @media (max-width: 480px) {
    padding: 10px 12px;
    font-size: 0.9rem;
    border-radius: 8px;
  }
  
  @media (max-width: 400px) {
    padding: 8px 10px;
    font-size: 0.8rem;
    border-radius: 6px;
  }
  
  @media (max-width: 300px) {
    padding: 6px 8px;
    font-size: 0.75rem;
    border-radius: 4px;
  }
`;

const TimeSlotsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 12px;
  margin-top: 12px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
    gap: 10px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
    gap: 8px;
  }
  
  @media (max-width: 400px) {
    grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
    gap: 6px;
  }
  
  @media (max-width: 300px) {
    grid-template-columns: repeat(auto-fit, minmax(45px, 1fr));
    gap: 4px;
  }
`;

const TimeSlot = styled.button`
  padding: 12px 8px;
  border: 2px solid ${props => props.selected ? '#4F46E5' : 'rgba(75, 85, 99, 0.3)'};
  border-radius: 8px;
  background: ${props => props.selected ? 'rgba(79, 70, 229, 0.2)' : 'rgba(17, 24, 39, 0.6)'};
  color: ${props => props.selected ? '#ffffff' : '#9ca3af'};
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  
  &:hover {
    border-color: #4F46E5;
    background: rgba(79, 70, 229, 0.1);
    color: #ffffff;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  @media (max-width: 768px) {
    padding: 10px 6px;
    font-size: 0.8rem;
  }
  
  @media (max-width: 480px) {
    padding: 8px 4px;
    font-size: 0.75rem;
    border-radius: 6px;
  }
  
  @media (max-width: 400px) {
    padding: 6px 3px;
    font-size: 0.7rem;
    border-radius: 4px;
  }
  
  @media (max-width: 300px) {
    padding: 4px 2px;
    font-size: 0.65rem;
    border-radius: 3px;
  }
`;

const DurationSelector = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 12px;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    gap: 10px;
  }
  
  @media (max-width: 480px) {
    gap: 8px;
  }
  
  @media (max-width: 400px) {
    gap: 6px;
  }
  
  @media (max-width: 300px) {
    gap: 4px;
  }
`;

const DurationButton = styled.button`
  padding: 12px 16px;
  border: 2px solid ${props => props.selected ? '#4F46E5' : 'rgba(75, 85, 99, 0.3)'};
  border-radius: 8px;
  background: ${props => props.selected ? 'rgba(79, 70, 229, 0.2)' : 'rgba(17, 24, 39, 0.6)'};
  color: ${props => props.selected ? '#ffffff' : '#9ca3af'};
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #4F46E5;
    background: rgba(79, 70, 229, 0.1);
    color: #ffffff;
  }
  
  @media (max-width: 768px) {
    padding: 10px 12px;
    font-size: 0.8rem;
  }
  
  @media (max-width: 480px) {
    padding: 8px 10px;
    font-size: 0.75rem;
    border-radius: 6px;
  }
  
  @media (max-width: 400px) {
    padding: 6px 8px;
    font-size: 0.7rem;
    border-radius: 4px;
  }
  
  @media (max-width: 300px) {
    padding: 4px 6px;
    font-size: 0.65rem;
    border-radius: 3px;
  }
`;

const BookingSummary = styled.div`
  background: rgba(79, 70, 229, 0.1);
  border: 1px solid rgba(79, 70, 229, 0.2);
  border-radius: 12px;
  padding: 20px;
  margin-top: 24px;
  
  @media (max-width: 768px) {
    padding: 16px;
    margin-top: 20px;
  }
  
  @media (max-width: 480px) {
    padding: 12px;
    margin-top: 16px;
    border-radius: 8px;
  }
  
  @media (max-width: 400px) {
    padding: 10px;
    margin-top: 12px;
    border-radius: 6px;
  }
  
  @media (max-width: 300px) {
    padding: 8px;
    margin-top: 10px;
    border-radius: 4px;
  }
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  
  &:last-child {
    margin-bottom: 0;
    font-weight: 600;
    font-size: 1.1rem;
    color: #ffffff;
    border-top: 1px solid rgba(79, 70, 229, 0.2);
    padding-top: 12px;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    margin-bottom: 10px;
    
    &:last-child {
      font-size: 1rem;
      padding-top: 10px;
    }
  }
  
  @media (max-width: 400px) {
    margin-bottom: 8px;
    gap: 3px;
    
    &:last-child {
      font-size: 0.9rem;
      padding-top: 8px;
    }
  }
  
  @media (max-width: 300px) {
    margin-bottom: 6px;
    gap: 2px;
    
    &:last-child {
      font-size: 0.8rem;
      padding-top: 6px;
    }
  }
`;

const SummaryLabel = styled.span`
  color: #9ca3af;
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
  
  @media (max-width: 400px) {
    font-size: 0.8rem;
  }
  
  @media (max-width: 300px) {
    font-size: 0.75rem;
  }
`;

const SummaryValue = styled.span`
  color: #ffffff;
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
  
  @media (max-width: 400px) {
    font-size: 0.8rem;
  }
  
  @media (max-width: 300px) {
    font-size: 0.75rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 32px;
  
  @media (max-width: 768px) {
    gap: 12px;
    margin-top: 28px;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 10px;
    margin-top: 24px;
  }
  
  @media (max-width: 400px) {
    gap: 8px;
    margin-top: 20px;
  }
  
  @media (max-width: 300px) {
    gap: 6px;
    margin-top: 16px;
  }
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
  
  ${props => props.$primary ? `
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
  
  @media (max-width: 768px) {
    padding: 14px 24px;
    font-size: 0.9rem;
    min-width: 120px;
  }
  
  @media (max-width: 480px) {
    padding: 12px 20px;
    font-size: 0.85rem;
    min-width: 100%;
    border-radius: 8px;
  }
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
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
`;

const CourtBooking = ({ court, onBack, onBookingSuccess }) => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [selectedDuration, setSelectedDuration] = useState(1);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [courtClosingTime, setCourtClosingTime] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [error, setError] = useState('');

  // Set minimum date to today
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  }, []);

  const checkAvailability = useCallback(async () => {
    if (!selectedDate || !court.id) return;

    setIsCheckingAvailability(true);
    setError('');

    try {
      const response = await axios.get(`${API_BASE_URL}/bookings/availability/${court.id}`, {
        params: { date: selectedDate },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('bookmycourt_token')}`
        }
      });

      if (response.data.success) {
        setAvailableSlots(response.data.data.availableSlots);
        // Store closing time from availability response
        if (response.data.data.closingTime) {
          setCourtClosingTime(response.data.data.closingTime);
        }
      }
    } catch (error) {
      console.error('Availability check error:', error);
      setError('Failed to check availability. Please try again.');
    } finally {
      setIsCheckingAvailability(false);
    }
  }, [selectedDate, court.id]);

  // Check availability when date changes
  useEffect(() => {
    if (selectedDate) {
      checkAvailability();
    }
  }, [selectedDate, court.id, checkAvailability]);

  const handleTimeSlotSelect = (slot) => {
    if (slot.available) {
      setSelectedTimeSlot(slot.startTime);
    }
  };

  const calculateEndTime = (startTime, duration, maxClosingTime = '23:59') => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const [maxHours, maxMinutes] = maxClosingTime.split(':').map(Number);
    
    const startTotalMinutes = hours * 60 + minutes;
    const durationMinutes = duration * 60;
    const calculatedEndTotalMinutes = startTotalMinutes + durationMinutes;
    const maxClosingMinutes = maxHours * 60 + maxMinutes;
    
    // If calculated end time exceeds closing time, cap it at closing time
    const endTotalMinutes = Math.min(calculatedEndTotalMinutes, maxClosingMinutes);
    
    // Calculate hours and minutes from total minutes
    let endHours = Math.floor(endTotalMinutes / 60);
    const endMinutes = endTotalMinutes % 60;
    
    // Handle 24:00 case - if exactly 24:00 (1440 minutes), show as 23:59
    // This prevents showing 00:00 when it should show the closing time
    if (endHours === 24) {
      endHours = 23;
      const cappedMinutes = maxMinutes || 59;
      return `${endHours.toString().padStart(2, '0')}:${cappedMinutes.toString().padStart(2, '0')}`;
    }
    
    // If capped at closing time and closing time has specific minutes (like 23:59)
    if (endTotalMinutes === maxClosingMinutes && maxMinutes !== 0) {
      return `${endHours.toString().padStart(2, '0')}:${maxMinutes.toString().padStart(2, '0')}`;
    }
    
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
  };

  const calculateActualDuration = () => {
    if (!selectedTimeSlot || !selectedDuration) return selectedDuration;
    
    // Get court closing time
    const courtCloseTime = courtClosingTime || court.operatingHours?.close || '22:00';
    const [closeHours, closeMinutes] = courtCloseTime.split(':').map(Number);
    const closeTotalMinutes = closeHours * 60 + closeMinutes;
    
    // Calculate start and requested end time
    const [startHours, startMinutes] = selectedTimeSlot.split(':').map(Number);
    const startTotalMinutes = startHours * 60 + startMinutes;
    const requestedEndTotalMinutes = startTotalMinutes + (selectedDuration * 60);
    
    // If requested end exceeds closing time, calculate actual duration
    if (requestedEndTotalMinutes > closeTotalMinutes) {
      const actualDurationMinutes = closeTotalMinutes - startTotalMinutes;
      // Round to nearest hour (if 59+ minutes, round to 1 hour)
      return Math.max(1, Math.round(actualDurationMinutes / 60));
    }
    
    return selectedDuration;
  };

  const calculateTotalAmount = () => {
    const actualDuration = calculateActualDuration();
    return court.price * actualDuration;
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTimeSlot || !selectedDuration) {
      setError('Please select date, time, and duration');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Get court closing time - prioritize from availability response, then court object, then calculate from slots
      let courtCloseTime = courtClosingTime || court.operatingHours?.close;
      
      // If still not available, try to determine from available slots
      if (!courtCloseTime && availableSlots.length > 0) {
        // Find the latest available end time (last slot's end time)
        const latestSlot = availableSlots.reduce((latest, slot) => {
          const latestEnd = latest?.endTime || '00:00';
          const slotEnd = slot?.endTime || '00:00';
          return slotEnd > latestEnd ? slot : latest;
        }, null);
        
        if (latestSlot?.endTime) {
          courtCloseTime = latestSlot.endTime;
        }
      }
      
      // Default fallback - use 22:00 instead of 21:00 to match common court hours
      courtCloseTime = courtCloseTime || '22:00';
      const [closeHours, closeMinutes] = courtCloseTime.split(':').map(Number);
      const closeTotalMinutes = closeHours * 60 + closeMinutes;
      
      // Calculate end time
      const [startHours, startMinutes] = selectedTimeSlot.split(':').map(Number);
      const startTotalMinutes = startHours * 60 + startMinutes;
      const endTotalMinutes = startTotalMinutes + (selectedDuration * 60);
      
      // Validate that booking doesn't extend past closing time
      // Allow bookings that end at closing time or within 1 minute of it (for rounding)
      if (endTotalMinutes > closeTotalMinutes) {
        const maxDurationMinutes = closeTotalMinutes - startTotalMinutes;
        
        // If the booking can fit within closing time (at least 59 minutes remaining),
        // allow it - this handles cases like 23:00 to 23:59 (59 minutes = effectively 1 hour)
        if (maxDurationMinutes >= 59) {
          // Allow the booking - it will be capped at closing time
          // The end time will be calculated as closing time in calculateEndTime
        } else if (maxDurationMinutes > 0) {
          // Less than 1 hour available - show error with minutes
          const maxMinutes = maxDurationMinutes;
          setError(`Booking duration too long. Court closes at ${courtCloseTime}. Maximum duration from ${selectedTimeSlot} is ${maxMinutes} minute(s).`);
          toast.error(`Court closes at ${courtCloseTime}. Please select a shorter duration.`);
          setIsLoading(false);
          return;
        } else {
          // No time available - booking would extend past closing time
          setError(`Court closes at ${courtCloseTime}. Cannot book starting at ${selectedTimeSlot} as it extends past closing time.`);
          toast.error(`Court closes at ${courtCloseTime}. Please select an earlier time.`);
          setIsLoading(false);
          return;
        }
      }
      
      // Calculate actual duration (may be less than selected if it exceeds closing time)
      const actualDuration = calculateActualDuration();
      
      // Calculate end time using actual duration
      const endTime = calculateEndTime(selectedTimeSlot, actualDuration, courtCloseTime);
      
      // Show info toast if duration was automatically adjusted
      if (actualDuration < selectedDuration) {
        toast(`Duration adjusted to ${actualDuration} hour(s) due to court closing time.`, { 
          duration: 4000,
          icon: 'ℹ️'
        });
      }
      
      // Check availability via API
      const availabilityResponse = await axios.get(`${API_BASE_URL}/bookings/availability/${court.id}`, {
        params: { date: selectedDate },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('bookmycourt_token')}`
        }
      });

      if (availabilityResponse.data.success) {
        const slots = availabilityResponse.data.data.availableSlots;
        const selectedSlot = slots.find(slot => slot.startTime === selectedTimeSlot);
        
        if (!selectedSlot || !selectedSlot.available) {
          setError('The selected time slot is no longer available. Please choose a different time.');
          toast.error('Time slot no longer available');
          setIsLoading(false);
          // Refresh availability
          checkAvailability();
          return;
        }

        // Store booking details temporarily (NOT creating booking yet)
        const bookingData = {
          courtId: court.id,
          courtName: court.name,
          courtLocation: court.location,
          sport: court.sport,
          courtPrice: court.price,
          bookingDate: selectedDate,
          startTime: selectedTimeSlot,
          endTime: endTime,
          duration: actualDuration, // Use actual duration (may be capped at closing time)
          totalAmount: court.price * actualDuration, // Calculate based on actual duration
          user: JSON.parse(localStorage.getItem('bookmycourt_user'))
        };
        
        localStorage.setItem('pendingBooking', JSON.stringify(bookingData));
        
        toast.success('Redirecting to payment...');
        
        // Redirect to payment page (booking will be created only after payment)
        navigate('/payment');
      }
    } catch (error) {
      console.error('Booking error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to proceed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
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
          
          <Title>Book Your Court</Title>
          <Subtitle>Select your preferred date and time to book this court</Subtitle>
        </Header>

        <BookingContainer>
          <CourtInfo>
            <CourtName>
              <Star size={24} color="#fbbf24" />
              {court.name}
            </CourtName>
            
            <CourtLocation>
              <MapPin size={16} />
              {court.location}
            </CourtLocation>
            
            <CourtPrice>₹{court.price}/hour</CourtPrice>
            
            <CourtRating>
              <Star size={16} fill="#fbbf24" color="#fbbf24" />
              {court.rating}
            </CourtRating>
            
            <CourtCapacity>
              <Users size={16} />
              Capacity: {court.capacity} people
            </CourtCapacity>
            
            <CourtFacilities>
              {court.facilities.map((facility, index) => (
                <FacilityTag key={index}>{facility}</FacilityTag>
              ))}
            </CourtFacilities>
          </CourtInfo>

          <BookingForm>
            <FormTitle>
              <Calendar size={20} />
              Booking Details
            </FormTitle>

            <FormGroup>
              <Label>Select Date</Label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </FormGroup>

            <FormGroup>
              <Label>Select Time Slot</Label>
              {isCheckingAvailability ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#9ca3af' }}>
                  <LoadingSpinner
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <div style={{ marginTop: '10px' }}>Checking availability...</div>
                </div>
              ) : (
                <TimeSlotsGrid>
                  {availableSlots.map((slot, index) => (
                    <TimeSlot
                      key={index}
                      selected={selectedTimeSlot === slot.startTime}
                      disabled={!slot.available}
                      onClick={() => handleTimeSlotSelect(slot)}
                    >
                      {slot.startTime}
                    </TimeSlot>
                  ))}
                </TimeSlotsGrid>
              )}
            </FormGroup>

            <FormGroup>
              <Label>Duration (Hours)</Label>
              <DurationSelector>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(duration => (
                  <DurationButton
                    key={duration}
                    selected={selectedDuration === duration}
                    onClick={() => setSelectedDuration(duration)}
                  >
                    {duration}h
                  </DurationButton>
                ))}
              </DurationSelector>
            </FormGroup>

            {error && (
              <ErrorMessage>
                <AlertCircle size={16} />
                {error}
              </ErrorMessage>
            )}

            <BookingSummary>
              <SummaryRow>
                <SummaryLabel>Date:</SummaryLabel>
                <SummaryValue>{selectedDate ? formatDate(selectedDate) : 'Select date'}</SummaryValue>
              </SummaryRow>
              
              <SummaryRow>
                <SummaryLabel>Time:</SummaryLabel>
                <SummaryValue>
                  {selectedTimeSlot ? 
                    `${selectedTimeSlot} - ${calculateEndTime(selectedTimeSlot, selectedDuration, courtClosingTime || court.operatingHours?.close || '22:00')}` : 
                    'Select time'
                  }
                </SummaryValue>
              </SummaryRow>
              
              <SummaryRow>
                <SummaryLabel>Duration:</SummaryLabel>
                <SummaryValue>
                  {selectedTimeSlot && selectedDuration ? (
                    (() => {
                      const actualDuration = calculateActualDuration();
                      if (actualDuration < selectedDuration) {
                        return `${actualDuration} hour${actualDuration > 1 ? 's' : ''} (max available)`;
                      }
                      return `${selectedDuration} hour${selectedDuration > 1 ? 's' : ''}`;
                    })()
                  ) : (
                    'Select time'
                  )}
                </SummaryValue>
              </SummaryRow>
              
              <SummaryRow>
                <SummaryLabel>Rate:</SummaryLabel>
                <SummaryValue>₹{court.price}/hour</SummaryValue>
              </SummaryRow>
              
              <SummaryRow>
                <SummaryLabel>Total Amount:</SummaryLabel>
                <SummaryValue>₹{calculateTotalAmount()}</SummaryValue>
              </SummaryRow>
            </BookingSummary>
          </BookingForm>
        </BookingContainer>

        <ButtonGroup>
          <Button
            onClick={onBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={20} />
            Back
          </Button>
          
          <Button
            $primary
            onClick={handleBooking}
            disabled={isLoading || !selectedDate || !selectedTimeSlot || !selectedDuration}
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
                <CreditCard size={20} />
                Proceed to Payment
              </>
            )}
          </Button>
        </ButtonGroup>
      </Card>
    </Container>
  );
};

export default CourtBooking;

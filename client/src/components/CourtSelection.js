import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Search, 
  MapPin, 
  Star,
  Users, 
  Clock,
  ArrowLeft,
  ArrowRight,
  Calendar,
  Shield,
  Wifi,
  Car,
  Coffee,
  Dumbbell,
  Zap
} from 'lucide-react';
import Logo from './Logo';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Container = styled.div`
  width: 100vw;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  position: relative;
  overflow: hidden;
  padding: 20px;
  
  @media (max-width: 1200px) {
    padding: 18px;
  }
  
  @media (max-width: 900px) {
    padding: 16px;
  }
  
  @media (max-width: 768px) {
    padding: 15px;
  }
  
  @media (max-width: 600px) {
    padding: 12px;
  }
  
  @media (max-width: 480px) {
    padding: 10px;
  }
  
  @media (max-width: 420px) {
    padding: 9px;
  }
  
  @media (max-width: 400px) {
    padding: 8px;
  }
  
  @media (max-width: 360px) {
    padding: 7px;
  }
  
  @media (max-width: 320px) {
    padding: 6px;
  }
  
  @media (max-width: 300px) {
    padding: 5px;
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

const Header = styled.header`
  position: relative;
  z-index: 10;
  padding: 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  
  @media (max-width: 1200px) {
    padding: 18px 0;
    margin-bottom: 28px;
  }
  
  @media (max-width: 900px) {
    flex-direction: column;
    gap: 20px;
    align-items: center;
    margin-bottom: 25px;
  }
  
  @media (max-width: 800px) {
    padding: 17px 0;
    margin-bottom: 22px;
  }
  
  @media (max-width: 700px) {
    padding: 18px 0;
    margin-bottom: 20px;
  }
  
  @media (max-width: 600px) {
    padding: 16px 0;
    margin-bottom: 18px;
  }
  
  @media (max-width: 480px) {
    padding: 15px 0;
    margin-bottom: 15px;
  }
  
  @media (max-width: 420px) {
    padding: 13px 0;
    margin-bottom: 13px;
  }
  
  @media (max-width: 400px) {
    padding: 10px 0;
    margin-bottom: 10px;
  }
  
  @media (max-width: 360px) {
    padding: 9px 0;
    margin-bottom: 9px;
  }
  
  @media (max-width: 320px) {
    padding: 8px 0;
    margin-bottom: 8px;
  }
  
  @media (max-width: 300px) {
    padding: 7px 0;
    margin-bottom: 7px;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const BackButton = styled(motion.button)`
  background: rgba(79, 70, 229, 0.2);
  border: 1px solid rgba(79, 70, 229, 0.3);
  color: #a5b4fc;
  padding: 12px 20px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(79, 70, 229, 0.3);
    color: #ffffff;
    transform: translateY(-2px);
  }
  
  @media (max-width: 768px) {
    padding: 10px 16px;
    font-size: 0.9rem;
    border-radius: 8px;
  }
  
  @media (max-width: 480px) {
    padding: 8px 12px;
    font-size: 0.8rem;
    border-radius: 6px;
  }
  
  @media (max-width: 400px) {
    padding: 6px 10px;
    font-size: 0.75rem;
    border-radius: 4px;
  }
  
  @media (max-width: 300px) {
    padding: 4px 8px;
    font-size: 0.7rem;
    border-radius: 3px;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #ffffff, #a5b4fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
  margin: 0;
  
  @media (max-width: 1200px) {
    font-size: 2.3rem;
  }
  
  @media (max-width: 900px) {
    font-size: 2.1rem;
  }
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
  
  @media (max-width: 600px) {
    font-size: 1.9rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
  
  @media (max-width: 420px) {
    font-size: 1.6rem;
  }
  
  @media (max-width: 400px) {
    font-size: 1.5rem;
  }
  
  @media (max-width: 360px) {
    font-size: 1.4rem;
  }
  
  @media (max-width: 320px) {
    font-size: 1.35rem;
  }
  
  @media (max-width: 300px) {
    font-size: 1.3rem;
  }
`;

const SearchSection = styled.div`
  background: rgba(17, 24, 39, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 30px;
  margin-bottom: 30px;
  border: 1px solid rgba(79, 70, 229, 0.2);
  box-shadow: 0 25px 50px rgba(0,0,0,0.4);
  
  @media (max-width: 1200px) {
    padding: 26px;
    margin-bottom: 26px;
  }
  
  @media (max-width: 900px) {
    padding: 24px;
    margin-bottom: 24px;
    border-radius: 20px;
  }
  
  @media (max-width: 768px) {
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 16px;
  }
  
  @media (max-width: 600px) {
    padding: 18px;
    margin-bottom: 18px;
    border-radius: 14px;
  }
  
  @media (max-width: 480px) {
    padding: 16px;
    margin-bottom: 16px;
    border-radius: 12px;
  }
  
  @media (max-width: 420px) {
    padding: 14px;
    margin-bottom: 14px;
    border-radius: 10px;
  }
  
  @media (max-width: 400px) {
    padding: 12px;
    margin-bottom: 12px;
    border-radius: 8px;
  }
  
  @media (max-width: 360px) {
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 7px;
  }
  
  @media (max-width: 320px) {
    padding: 9px;
    margin-bottom: 9px;
    border-radius: 6px;
  }
  
  @media (max-width: 300px) {
    padding: 8px;
    margin-bottom: 8px;
    border-radius: 5px;
  }
`;

const SearchForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr auto;
    gap: 20px;
    align-items: end;
  }
  
  @media (min-width: 768px) and (max-width: 1200px) {
    grid-template-columns: 1fr 1fr auto;
    gap: 16px;
  }
  
  @media (min-width: 768px) and (max-width: 900px) {
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }
  
  @media (max-width: 480px) {
    gap: 12px;
  }
  
  @media (max-width: 400px) {
    gap: 10px;
  }
  
  @media (max-width: 300px) {
    gap: 8px;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
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

const PriceRangeContainer = styled.div`
  display: flex;
  gap: 8px;
  
  @media (max-width: 768px) {
    gap: 6px;
  }
  
  @media (max-width: 480px) {
    gap: 4px;
  }
  
  @media (max-width: 400px) {
    gap: 3px;
  }
  
  @media (max-width: 300px) {
    gap: 2px;
  }
  
  /* Ensure inputs take equal space */
  & > * {
    flex: 1;
    min-width: 0;
  }
`;

const Label = styled.label`
  color: #e5e7eb;
  font-size: 0.9rem;
  font-weight: 500;
  
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

const Select = styled.select`
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

const SearchButton = styled(motion.button)`
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
  
  @media (max-width: 700px) {
    width: 100%;
    justify-content: center;
  }
  
  @media (max-width: 480px) {
    padding: 10px 20px;
    font-size: 0.9rem;
    border-radius: 8px;
  }
  
  @media (max-width: 400px) {
    padding: 8px 16px;
    font-size: 0.8rem;
    border-radius: 6px;
  }
  
  @media (max-width: 300px) {
    padding: 6px 12px;
    font-size: 0.75rem;
    border-radius: 4px;
  }
`;


const CourtsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
  margin-bottom: 30px;
  
  @media (max-width: 1400px) {
    gap: 22px;
  }
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 20px;
  }
  
  @media (max-width: 1000px) {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 18px;
  }
  
  @media (max-width: 900px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
    margin-bottom: 20px;
  }
  
  @media (max-width: 800px) {
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 15px;
  }
  
  @media (max-width: 700px) {
    grid-template-columns: 1fr;
    gap: 14px;
    margin-bottom: 18px;
  }
  
  @media (max-width: 600px) {
    gap: 13px;
  }
  
  @media (max-width: 480px) {
    gap: 12px;
    margin-bottom: 15px;
  }
  
  @media (max-width: 420px) {
    gap: 11px;
  }
  
  @media (max-width: 400px) {
    gap: 10px;
    margin-bottom: 12px;
  }
  
  @media (max-width: 360px) {
    gap: 9px;
  }
  
  @media (max-width: 320px) {
    gap: 8px;
  }
  
  @media (max-width: 300px) {
    gap: 7px;
    margin-bottom: 10px;
  }
`;

const CourtCard = styled(motion.div)`
  background: rgba(17, 24, 39, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 24px;
  border: 1px solid rgba(79, 70, 229, 0.2);
  box-shadow: 0 25px 50px rgba(0,0,0,0.4);
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
    border-color: #4F46E5;
    box-shadow: 0 35px 70px rgba(0,0,0,0.5);
  }
  
  @media (max-width: 768px) {
    padding: 20px;
    border-radius: 16px;
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

const CourtImage = styled.div`
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, #4F46E5, #2563EB);
  border-radius: 12px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    height: 180px;
    font-size: 2.5rem;
    border-radius: 8px;
    margin-bottom: 12px;
  }
  
  @media (max-width: 480px) {
    height: 160px;
    font-size: 2rem;
    border-radius: 6px;
    margin-bottom: 10px;
  }
  
  @media (max-width: 400px) {
    height: 140px;
    font-size: 1.5rem;
    border-radius: 4px;
    margin-bottom: 8px;
  }
  
  @media (max-width: 300px) {
    height: 120px;
    font-size: 1.2rem;
    border-radius: 3px;
    margin-bottom: 6px;
  }
`;

const CourtImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(79, 70, 229, 0.8), rgba(37, 99, 235, 0.6));
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CourtHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const CourtName = styled.h3`
  color: #ffffff;
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  @media (max-width: 400px) {
    font-size: 1rem;
  }
  
  @media (max-width: 300px) {
    font-size: 0.9rem;
  }
`;

const CourtRating = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #fbbf24;
  font-size: 0.9rem;
  font-weight: 600;
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
  }
  
  @media (max-width: 400px) {
    font-size: 0.75rem;
  }
  
  @media (max-width: 300px) {
    font-size: 0.7rem;
  }
`;

const CourtLocation = styled.div`
  color: #9ca3af;
  font-size: 0.9rem;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 3px;
  }
  
  @media (max-width: 400px) {
    font-size: 0.75rem;
  }
  
  @media (max-width: 300px) {
    font-size: 0.7rem;
  }
`;

const CourtDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 8px;
    margin-bottom: 12px;
  }
  
  @media (max-width: 400px) {
    gap: 6px;
    margin-bottom: 10px;
  }
  
  @media (max-width: 300px) {
    gap: 4px;
    margin-bottom: 8px;
  }
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #9ca3af;
  font-size: 0.85rem;
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 3px;
  }
  
  @media (max-width: 400px) {
    font-size: 0.75rem;
  }
  
  @media (max-width: 300px) {
    font-size: 0.7rem;
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

const CourtFacilities = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
  
  @media (max-width: 480px) {
    gap: 4px;
    margin-bottom: 12px;
  }
  
  @media (max-width: 400px) {
    gap: 3px;
    margin-bottom: 10px;
  }
  
  @media (max-width: 300px) {
    gap: 2px;
    margin-bottom: 8px;
  }
`;

const FacilityTag = styled.span`
  background: rgba(79, 70, 229, 0.2);
  color: #a5b4fc;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 0.75rem;
  border: 1px solid rgba(79, 70, 229, 0.3);
  
  @media (max-width: 480px) {
    padding: 3px 6px;
    font-size: 0.7rem;
    border-radius: 6px;
  }
  
  @media (max-width: 400px) {
    padding: 2px 4px;
    font-size: 0.65rem;
    border-radius: 4px;
  }
  
  @media (max-width: 300px) {
    padding: 1px 3px;
    font-size: 0.6rem;
    border-radius: 3px;
  }
`;

const BookButton = styled(motion.button)`
  width: 100%;
  padding: 12px 20px;
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
  
  @media (max-width: 768px) {
    padding: 10px 16px;
    font-size: 0.9rem;
    border-radius: 8px;
  }
  
  @media (max-width: 480px) {
    padding: 8px 12px;
    font-size: 0.8rem;
    border-radius: 6px;
  }
  
  @media (max-width: 400px) {
    padding: 6px 10px;
    font-size: 0.75rem;
    border-radius: 4px;
  }
  
  @media (max-width: 300px) {
    padding: 4px 8px;
    font-size: 0.7rem;
    border-radius: 3px;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 30px;
  
  @media (max-width: 768px) {
    gap: 10px;
    margin-top: 20px;
  }
  
  @media (max-width: 480px) {
    gap: 8px;
    margin-top: 16px;
  }
  
  @media (max-width: 400px) {
    gap: 6px;
    margin-top: 12px;
  }
  
  @media (max-width: 300px) {
    gap: 4px;
    margin-top: 10px;
  }
`;

const PaginationButton = styled(motion.button)`
  padding: 8px 12px;
  border: 2px solid rgba(75, 85, 99, 0.3);
  border-radius: 8px;
  background: rgba(17, 24, 39, 0.6);
  color: #9ca3af;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
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
    padding: 6px 8px;
    font-size: 0.8rem;
    border-radius: 6px;
  }
  
  @media (max-width: 400px) {
    padding: 4px 6px;
    font-size: 0.75rem;
    border-radius: 4px;
  }
  
  @media (max-width: 300px) {
    padding: 3px 4px;
    font-size: 0.7rem;
    border-radius: 3px;
  }
`;

const PaginationInfo = styled.span`
  color: #9ca3af;
  font-size: 0.9rem;
  
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

const LoadingSpinner = styled(motion.div)`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid #ffffff;
  border-radius: 50%;
  margin: 40px auto;
  
  @media (max-width: 768px) {
    width: 35px;
    height: 35px;
    margin: 30px auto;
  }
  
  @media (max-width: 480px) {
    width: 30px;
    height: 30px;
    margin: 20px auto;
  }
  
  @media (max-width: 400px) {
    width: 25px;
    height: 25px;
    margin: 15px auto;
  }
  
  @media (max-width: 300px) {
    width: 20px;
    height: 20px;
    margin: 10px auto;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #9ca3af;
  
  @media (max-width: 768px) {
    padding: 40px 15px;
  }
  
  @media (max-width: 480px) {
    padding: 30px 10px;
  }
  
  @media (max-width: 400px) {
    padding: 20px 8px;
  }
  
  @media (max-width: 300px) {
    padding: 15px 5px;
  }
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
  
  @media (max-width: 768px) {
    width: 70px;
    height: 70px;
    margin-bottom: 16px;
  }
  
  @media (max-width: 480px) {
    width: 60px;
    height: 60px;
    margin-bottom: 12px;
  }
  
  @media (max-width: 400px) {
    width: 50px;
    height: 50px;
    margin-bottom: 10px;
  }
  
  @media (max-width: 300px) {
    width: 40px;
    height: 40px;
    margin-bottom: 8px;
  }
`;

const EmptyTitle = styled.h3`
  color: #ffffff;
  font-size: 1.5rem;
  margin-bottom: 12px;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
    margin-bottom: 10px;
  }
  
  @media (max-width: 480px) {
    font-size: 1.2rem;
    margin-bottom: 8px;
  }
  
  @media (max-width: 400px) {
    font-size: 1.1rem;
    margin-bottom: 6px;
  }
  
  @media (max-width: 300px) {
    font-size: 1rem;
    margin-bottom: 5px;
  }
`;

const EmptyDescription = styled.p`
  font-size: 1rem;
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
    margin-bottom: 20px;
  }
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
    margin-bottom: 16px;
  }
  
  @media (max-width: 400px) {
    font-size: 0.75rem;
    margin-bottom: 12px;
  }
  
  @media (max-width: 300px) {
    font-size: 0.7rem;
    margin-bottom: 10px;
  }
`;

const RetryButton = styled(motion.button)`
  padding: 12px 24px;
  background: linear-gradient(135deg, #4F46E5, #2563EB);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(79, 70, 229, 0.3);
  }
  
  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: 0.9rem;
    border-radius: 8px;
  }
  
  @media (max-width: 480px) {
    padding: 8px 16px;
    font-size: 0.8rem;
    border-radius: 6px;
  }
  
  @media (max-width: 400px) {
    padding: 6px 12px;
    font-size: 0.75rem;
    border-radius: 4px;
  }
  
  @media (max-width: 300px) {
    padding: 4px 8px;
    font-size: 0.7rem;
    border-radius: 3px;
  }
`;

const CourtSelection = ({ onBack, onSelectCourt }) => {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({
    sport: '',
    location: '',
    minPrice: '',
    maxPrice: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCourts: 0
  });

  const fetchCourts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.currentPage,
        limit: 9,
        ...searchParams
      };

      // Remove empty parameters
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === 'all') {
          delete params[key];
        }
      });

      const response = await axios.get(`${API_BASE_URL}/courts`, {
        params,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('bookmycourt_token')}`
        }
      });

      if (response.data.success) {
        setCourts(response.data.data.courts);
        setPagination(prev => ({
          ...prev,
          totalPages: response.data.data.pagination.totalPages,
          totalCourts: response.data.data.pagination.totalCourts
        }));
      }
    } catch (error) {
      console.error('Error fetching courts:', error);
      toast.error('Failed to fetch courts. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [searchParams, pagination.currentPage]);

  // Fetch courts on component mount
  useEffect(() => {
    fetchCourts();
  }, [fetchCourts]);

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    fetchCourts();
  };


  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  const handleCourtSelect = (court) => {
    // Transform court data to match CourtBooking component expectations
    const courtData = {
      id: court._id,
      name: court.name,
      location: court.fullAddress || (court.location?.address ? `${court.location.address}, ${court.location.city}` : court.location),
      sport: court.sport,
      price: court.pricePerHour,
      rating: court.rating,
      capacity: court.capacity,
      facilities: court.facilities || [],
      operatingHours: court.operatingHours || { open: '06:00', close: '22:00' } // Include operating hours
    };
    
    if (onSelectCourt) {
      onSelectCourt(courtData);
    }
  };

  const getSportIcon = (sport) => {
    const sportIcons = {
      cricket: '🏏',
      football: '⚽',
      basketball: '🏀',
      tennis: '🎾',
      badminton: '🏸',
      volleyball: '🏐',
      hockey: '🏑',
      'table-tennis': '🏓',
      squash: '🥎'
    };
    return sportIcons[sport] || '🏟️';
  };

  const getFacilityIcon = (facility) => {
    const facilityIcons = {
      'Parking': <Car size={12} />,
      'WiFi': <Wifi size={12} />,
      'Cafeteria': <Coffee size={12} />,
      'Gym': <Dumbbell size={12} />,
      'Lighting': <Zap size={12} />,
      'Security': <Shield size={12} />
    };
    return facilityIcons[facility] || null;
  };

  return (
    <Container>
      <Background />
      
      <Header>
        <LogoContainer>
          <Logo />
        </LogoContainer>
        <BackButton
          onClick={onBack}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </BackButton>
      </Header>

      <Title>Find Your Perfect Court</Title>

      <SearchSection>
        <SearchForm>
          <FormGroup>
            <Label>Sport</Label>
            <Select
              value={searchParams.sport}
              onChange={(e) => setSearchParams(prev => ({ ...prev, sport: e.target.value }))}
            >
              <option value="">All Sports</option>
              <option value="cricket">Cricket</option>
              <option value="football">Football</option>
              <option value="basketball">Basketball</option>
              <option value="tennis">Tennis</option>
              <option value="badminton">Badminton</option>
              <option value="volleyball">Volleyball</option>
              <option value="hockey">Hockey</option>
              <option value="table-tennis">Table Tennis</option>
              <option value="squash">Squash</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Location</Label>
            <Input
              type="text"
              placeholder="Enter city or area"
              value={searchParams.location}
              onChange={(e) => setSearchParams(prev => ({ ...prev, location: e.target.value }))}
            />
          </FormGroup>

          <FormGroup>
            <Label>Price Range (₹/hour)</Label>
            <PriceRangeContainer>
              <Input
                type="number"
                placeholder="Min"
                value={searchParams.minPrice}
                onChange={(e) => setSearchParams(prev => ({ ...prev, minPrice: e.target.value }))}
                style={{ flex: 1 }}
              />
              <Input
                type="number"
                placeholder="Max"
                value={searchParams.maxPrice}
                onChange={(e) => setSearchParams(prev => ({ ...prev, maxPrice: e.target.value }))}
                style={{ flex: 1 }}
              />
            </PriceRangeContainer>
          </FormGroup>

          <SearchButton
            onClick={handleSearch}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Search size={20} />
            Search
          </SearchButton>
        </SearchForm>

      </SearchSection>

      {loading ? (
        <LoadingSpinner
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      ) : courts.length === 0 ? (
        <EmptyState>
          <EmptyIcon>
            <Search size={40} color="#4F46E5" />
          </EmptyIcon>
          <EmptyTitle>No Courts Found</EmptyTitle>
          <EmptyDescription>
            Try adjusting your search criteria or filters to find more courts.
          </EmptyDescription>
          <RetryButton
            onClick={fetchCourts}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Try Again
          </RetryButton>
        </EmptyState>
      ) : (
        <>
          <CourtsGrid>
            {courts.map((court) => (
              <CourtCard
                key={court._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => handleCourtSelect(court)}
              >
                <CourtImage>
                  <CourtImageOverlay>
                    <span style={{ fontSize: '4rem' }}>{getSportIcon(court.sport)}</span>
                  </CourtImageOverlay>
                </CourtImage>

                <CourtHeader>
                  <CourtName>
                    {court.name}
                  </CourtName>
                  <CourtRating>
                    <Star size={16} fill="#fbbf24" color="#fbbf24" />
                    <span>{court.rating.toFixed(1)}</span>
                    {court.totalRatings > 0 && (
                      <span style={{ 
                        fontSize: '0.8rem', 
                        color: '#9ca3af',
                        marginLeft: '4px'
                      }}>
                        ({court.totalRatings})
                      </span>
                    )}
                  </CourtRating>
                </CourtHeader>

                <CourtLocation>
                  <MapPin size={14} />
                  {court.fullAddress || `${court.location.address}, ${court.location.city}`}
                </CourtLocation>

                <CourtDetails>
                  <DetailItem>
                    <Users size={14} />
                    {court.capacity} people
                  </DetailItem>
                  <DetailItem>
                    <Clock size={14} />
                    {court.operatingHours.open} - {court.operatingHours.close}
                  </DetailItem>
                </CourtDetails>

                <CourtPrice>₹{court.pricePerHour}/hour</CourtPrice>

                <CourtFacilities>
                  {court.facilities.slice(0, 4).map((facility, index) => (
                    <FacilityTag key={index}>
                      {getFacilityIcon(facility)}
                      {facility}
                    </FacilityTag>
                  ))}
                  {court.facilities.length > 4 && (
                    <FacilityTag>+{court.facilities.length - 4} more</FacilityTag>
                  )}
                </CourtFacilities>

                <BookButton
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Calendar size={16} />
                  Book This Court
                </BookButton>
              </CourtCard>
            ))}
          </CourtsGrid>

          {pagination.totalPages > 1 && (
            <Pagination>
              <PaginationButton
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft size={16} />
                Previous
              </PaginationButton>
              
              <PaginationInfo>
                Page {pagination.currentPage} of {pagination.totalPages}
              </PaginationInfo>
              
              <PaginationButton
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Next
                <ArrowRight size={16} />
              </PaginationButton>
            </Pagination>
          )}
        </>
      )}
    </Container>
  );
};

export default CourtSelection;

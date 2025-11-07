import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Star, 
  X, 
  Send,
  MessageSquare
} from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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
  max-width: 500px;
  width: 100%;
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
  display: flex;
  align-items: center;
  gap: 12px;
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
  gap: 24px;
`;

const BookingInfo = styled.div`
  background: rgba(31, 41, 55, 0.6);
  border: 1px solid rgba(75, 85, 99, 0.3);
  border-radius: 12px;
  padding: 16px;
`;

const BookingTitle = styled.h4`
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 8px 0;
`;

const BookingDetails = styled.div`
  color: #9ca3af;
  font-size: 0.9rem;
  line-height: 1.5;
`;

const RatingSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const RatingLabel = styled.label`
  color: #e5e7eb;
  font-size: 1rem;
  font-weight: 600;
`;

const StarContainer = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
`;

const StarButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const StarIcon = styled(Star)`
  color: ${props => props.filled ? '#fbbf24' : '#4b5563'};
  transition: all 0.2s ease;
  
  ${StarButton}:hover & {
    color: #fbbf24;
  }
`;

const RatingText = styled.div`
  text-align: center;
  color: #9ca3af;
  font-size: 0.9rem;
  margin-top: 8px;
`;

const CommentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CommentLabel = styled.label`
  color: #e5e7eb;
  font-size: 0.9rem;
  font-weight: 500;
`;

const CommentTextarea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid rgba(75, 85, 99, 0.3);
  border-radius: 12px;
  background: rgba(17, 24, 39, 0.6);
  color: #ffffff;
  font-size: 0.9rem;
  min-height: 80px;
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 8px;
`;

const Button = styled(motion.button)`
  padding: 12px 24px;
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
    box-shadow: 0 4px 15px rgba(79, 70, 229, 0.3);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(79, 70, 229, 0.4);
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
  width: 16px;
  height: 16px;
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

const RatingModal = ({ booking, isOpen, onClose, onRatingSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const ratingTexts = {
    1: 'Poor',
    2: 'Fair', 
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent'
  };

  const handleStarClick = (starRating) => {
    setRating(starRating);
    setError('');
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/bookings/${booking.id}/rate`, {
        rating,
        comment: comment.trim()
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('bookmycourt_token')}`
        }
      });

      if (response.data.success) {
        toast.success('Rating submitted successfully!');
        onRatingSubmitted(response.data.data.booking);
        onClose();
      }
    } catch (error) {
      console.error('Rating submission error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to submit rating. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setRating(0);
    setHoveredRating(0);
    setComment('');
    setError('');
    onClose();
  };

  if (!isOpen || !booking) return null;

  // Prevent rating if already rated
  if (booking.rating) {
    return (
      <ModalOverlay onClick={onClose}>
        <Modal
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        >
          <ModalHeader>
            <ModalTitle>
              <Star size={24} color="#fbbf24" />
              Rating Already Submitted
            </ModalTitle>
            <CloseButton onClick={onClose}>
              <X size={20} />
            </CloseButton>
          </ModalHeader>
          <ModalContent>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ 
                background: 'rgba(251, 191, 36, 0.2)', 
                color: '#fbbf24', 
                padding: '16px', 
                borderRadius: '12px',
                marginBottom: '20px'
              }}>
                <Star size={48} style={{ marginBottom: '12px' }} />
                <div style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '8px' }}>
                  You have already rated this booking
                </div>
                <div style={{ fontSize: '2rem', fontWeight: '700' }}>
                  {booking.rating}/5
                </div>
                {booking.ratingComment && (
                  <div style={{ marginTop: '12px', fontSize: '0.9rem', opacity: 0.8 }}>
                    "{booking.ratingComment}"
                  </div>
                )}
              </div>
              <p style={{ color: '#9ca3af', margin: 0 }}>
                Ratings cannot be changed once submitted.
              </p>
            </div>
          </ModalContent>
        </Modal>
      </ModalOverlay>
    );
  }

  return (
    <ModalOverlay onClick={handleClose}>
      <Modal
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        <ModalHeader>
          <ModalTitle>
            <Star size={24} color="#fbbf24" />
            Rate Your Experience
          </ModalTitle>
          <CloseButton onClick={handleClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalContent>
          <BookingInfo>
            <BookingTitle>{booking.courtName}</BookingTitle>
            <BookingDetails>
              {booking.location} • {booking.sport} • {booking.date} • {booking.time}
            </BookingDetails>
          </BookingInfo>

          <RatingSection>
            <RatingLabel>How was your experience?</RatingLabel>
            <StarContainer>
              {[1, 2, 3, 4, 5].map((star) => (
                <StarButton
                  key={star}
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                >
                  <StarIcon
                    size={32}
                    filled={star <= (hoveredRating || rating)}
                  />
                </StarButton>
              ))}
            </StarContainer>
            <RatingText>
              {rating > 0 ? ratingTexts[rating] : 'Select a rating'}
            </RatingText>
          </RatingSection>

          <CommentSection>
            <CommentLabel>
              <MessageSquare size={16} />
              Share your thoughts (optional)
            </CommentLabel>
            <CommentTextarea
              placeholder="Tell us about your experience at this court..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={500}
            />
            <div style={{ 
              fontSize: '0.8rem', 
              color: '#6b7280', 
              textAlign: 'right' 
            }}>
              {comment.length}/500
            </div>
          </CommentSection>

          {error && (
            <ErrorMessage>
              <X size={16} />
              {error}
            </ErrorMessage>
          )}

          <ButtonGroup>
            <Button
              onClick={handleClose}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </Button>
            <Button
              primary
              onClick={handleSubmit}
              disabled={isSubmitting || rating === 0}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSubmitting ? (
                <LoadingSpinner
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                <>
                  <Send size={16} />
                  Submit Rating
                </>
              )}
            </Button>
          </ButtonGroup>
        </ModalContent>
      </Modal>
    </ModalOverlay>
  );
};

export default RatingModal;

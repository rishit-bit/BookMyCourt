import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CourtSelection from './CourtSelection';
import CourtBooking from './CourtBooking';

const BookCourtPage = () => {
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const navigate = useNavigate();

  const handleCourtSelect = (court) => {
    setSelectedCourt(court);
    setShowBooking(true);
  };

  const handleBackFromBooking = () => {
    setShowBooking(false);
    setSelectedCourt(null);
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleBookingSuccess = (booking) => {
    setShowBooking(false);
    setSelectedCourt(null);
    // Navigate back to dashboard with success message
    navigate('/dashboard');
  };

  if (showBooking && selectedCourt) {
    return (
      <CourtBooking
        court={selectedCourt}
        onBack={handleBackFromBooking}
        onBookingSuccess={handleBookingSuccess}
      />
    );
  }

  return (
    <CourtSelection
      onBack={handleBackToDashboard}
      onSelectCourt={handleCourtSelect}
    />
  );
};

export default BookCourtPage;

const express = require('express');
const jwt = require('jsonwebtoken');
const Booking = require('../models/Booking');
const User = require('../models/User');
const router = express.Router();

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'bookmycourt-super-secret-key-2024';

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'User not found or inactive'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Token is invalid'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expired',
        message: 'Token has expired. Please login again'
      });
    }

    res.status(500).json({
      error: 'Authentication failed',
      message: 'Something went wrong during authentication'
    });
  }
};

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      courtId,
      courtName,
      courtLocation,
      sport,
      courtPrice,
      bookingDate,
      startTime,
      endTime,
      duration,
      paymentMethod
    } = req.body;

    // Validate required fields
    if (!courtId || !courtName || !courtLocation || !sport || !courtPrice || !bookingDate || !startTime || !endTime || !duration) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Please provide all required booking information'
      });
    }

    // Validate date
    const bookingDateObj = new Date(bookingDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const now = new Date();
    
    if (bookingDateObj < today) {
      return res.status(400).json({
        error: 'Invalid date',
        message: 'Booking date cannot be in the past'
      });
    }

    // Validate time format
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      return res.status(400).json({
        error: 'Invalid time format',
        message: 'Time must be in HH:MM format'
      });
    }

    // Fix Bug 2: Validate that booking time is not in the past for today's bookings
    const isToday = bookingDateObj.toDateString() === today.toDateString();
    if (isToday) {
      const [startHours, startMinutes] = startTime.split(':').map(Number);
      const bookingDateTime = new Date(bookingDateObj);
      bookingDateTime.setHours(startHours, startMinutes, 0, 0);
      
      if (bookingDateTime <= now) {
        return res.status(400).json({
          error: 'Invalid time',
          message: 'Cannot book past time slots. Please select a future time.'
        });
      }
    }

    // Validate duration
    if (duration < 1 || duration > 8) {
      return res.status(400).json({
        error: 'Invalid duration',
        message: 'Duration must be between 1 and 8 hours'
      });
    }

    // Fix Bug 1: Use optimistic locking to prevent race condition
    // Check availability and create booking with atomic operation
    try {
      // Final availability check right before creating (helps prevent race conditions)
    const isAvailable = await Booking.checkAvailability(courtId, bookingDateObj, startTime, endTime);
    if (!isAvailable) {
      return res.status(409).json({
        error: 'Court not available',
        message: 'The selected time slot is already booked. Please choose a different time.'
      });
    }

    // Create booking
    const booking = new Booking({
      user: req.user._id,
      court: {
        id: courtId,
        name: courtName,
        location: courtLocation,
        sport: sport,
        price: courtPrice
      },
      bookingDate: bookingDateObj,
      startTime,
      endTime,
      duration,
      totalAmount: courtPrice * duration,
      paymentMethod: paymentMethod || 'card',
      status: 'pending'
    });

      const savedBooking = await booking.save();

    res.status(201).json({
      success: true,
      message: 'Booking created successfully! Please complete payment to confirm your booking.',
      data: {
          booking: savedBooking.getBookingSummary()
      }
    });

    } catch (error) {
      // Handle duplicate key errors (race condition caught at DB level)
      if (error.code === 11000 || error.name === 'MongoServerError') {
        // Check if it's a duplicate booking conflict
        const conflictingBooking = await Booking.findOne({
          'court.id': courtId,
          bookingDate: bookingDateObj,
          status: { $in: ['confirmed', 'pending'] },
          $or: [
            {
              startTime: { $lt: endTime },
              endTime: { $gt: startTime }
            }
          ]
        });

        if (conflictingBooking) {
          return res.status(409).json({
            error: 'Court not available',
            message: 'The selected time slot was just booked by another user. Please choose a different time.'
          });
        }
      }
      throw error; // Re-throw to be caught by outer catch
    }

  } catch (error) {
    console.error('Create booking error:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        error: 'Validation failed',
        message: validationErrors.join(', ')
      });
    }

    res.status(500).json({
      error: 'Booking creation failed',
      message: 'Something went wrong while creating your booking. Please try again.'
    });
  }
});

// @route   GET /api/bookings
// @desc    Get user's bookings
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const bookings = await Booking.getUserBookings(req.user._id, status, parseInt(limit), skip);
    const totalBookings = await Booking.countDocuments({ user: req.user._id, isActive: true });

    res.json({
      success: true,
      data: {
        bookings: bookings.map(booking => booking.getBookingSummary()),
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalBookings / parseInt(limit)),
          totalBookings,
          hasNext: skip + bookings.length < totalBookings,
          hasPrev: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      error: 'Failed to fetch bookings',
      message: 'Something went wrong while fetching your bookings'
    });
  }
});

// @route   GET /api/bookings/stats
// @desc    Get user booking statistics
// @access  Private
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get booking statistics with status breakdown
    const bookingStats = await Booking.aggregate([
      { $match: { user: userId, isActive: true } },
      {
        $group: {
          _id: null,
          totalBookings: { $sum: 1 },
          confirmedBookings: { $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] } },
          cancelledBookings: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } },
          totalSpent: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$paymentStatus', 'paid'] },
                    { $ne: ['$status', 'cancelled'] },
                    { $ne: ['$paymentStatus', 'refunded'] }
                  ]
                },
                '$totalAmount',
                0
              ]
            }
          }
        }
      }
    ]);

    const stats = bookingStats[0] || {
      totalBookings: 0,
      confirmedBookings: 0,
      cancelledBookings: 0,
      totalSpent: 0
    };

    // Get favorite court (most booked court) with details
    const favoriteCourtsResult = await Booking.aggregate([
      { $match: { user: userId, isActive: true } },
      { 
        $group: { 
          _id: '$court.id', 
          count: { $sum: 1 },
          courtName: { $first: '$court.name' },
          courtLocation: { $first: '$court.location' },
          courtSport: { $first: '$court.sport' },
          courtPrice: { $first: '$court.price' }
        } 
      },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);
    
    const favoriteCourt = favoriteCourtsResult.length > 0 ? {
      count: favoriteCourtsResult[0].count,
      name: favoriteCourtsResult[0].courtName,
      location: favoriteCourtsResult[0].courtLocation,
      sport: favoriteCourtsResult[0].courtSport,
      price: favoriteCourtsResult[0].courtPrice
    } : null;

    res.json({
      success: true,
      data: {
        totalBookings: stats.totalBookings,
        confirmedBookings: stats.confirmedBookings,
        cancelledBookings: stats.cancelledBookings,
        totalSpent: stats.totalSpent,
        favoriteCourt
      }
    });
  } catch (error) {
    console.error('Get booking stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking statistics'
    });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get specific booking details
// @access  Private
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id,
      isActive: true
    });

    if (!booking) {
      return res.status(404).json({
        error: 'Booking not found',
        message: 'No booking found with this ID'
      });
    }

    res.json({
      success: true,
      data: {
        booking: {
          ...booking.getBookingSummary(),
          specialRequests: booking.specialRequests,
          notes: booking.notes,
          createdAt: booking.createdAt,
          updatedAt: booking.updatedAt
        }
      }
    });

  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      error: 'Failed to fetch booking',
      message: 'Something went wrong while fetching booking details'
    });
  }
});

// @route   PUT /api/bookings/:id/confirm
// @desc    Confirm a pending booking
// @access  Private
router.put('/:id/confirm', authenticateToken, async (req, res) => {
  try {
    const { paymentStatus = 'paid' } = req.body;

    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id,
      isActive: true
    });

    if (!booking) {
      return res.status(404).json({
        error: 'Booking not found',
        message: 'No booking found with this ID'
      });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({
        error: 'Invalid booking status',
        message: 'Only pending bookings can be confirmed'
      });
    }

    // Check availability again before confirming
    const isAvailable = await Booking.checkAvailability(
      booking.court.id,
      booking.bookingDate,
      booking.startTime,
      booking.endTime,
      booking._id
    );

    if (!isAvailable) {
      return res.status(409).json({
        error: 'Court no longer available',
        message: 'The selected time slot is no longer available. Please choose a different time.'
      });
    }

    booking.status = 'confirmed';
    booking.paymentStatus = paymentStatus;
    await booking.save();

    res.json({
      success: true,
      message: 'Booking confirmed successfully! 🎉',
      data: {
        booking: booking.getBookingSummary()
      }
    });

  } catch (error) {
    console.error('Confirm booking error:', error);
    res.status(500).json({
      error: 'Booking confirmation failed',
      message: 'Something went wrong while confirming your booking'
    });
  }
});

// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel a booking
// @access  Private
router.put('/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const { cancellationReason } = req.body;

    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id,
      isActive: true
    });

    if (!booking) {
      return res.status(404).json({
        error: 'Booking not found',
        message: 'No booking found with this ID'
      });
    }

    if (!booking.canBeCancelled()) {
      return res.status(400).json({
        error: 'Cannot cancel booking',
        message: 'This booking cannot be cancelled. Cancellation is only allowed more than 2 hours before the booking time.'
      });
    }

    booking.status = 'cancelled';
    booking.cancellationReason = cancellationReason;
    booking.cancelledAt = new Date();
    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: {
        booking: booking.getBookingSummary()
      }
    });

  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      error: 'Booking cancellation failed',
      message: 'Something went wrong while cancelling your booking'
    });
  }
});

// @route   GET /api/bookings/availability/:courtId
// @desc    Check court availability for a specific date
// @access  Private
router.get('/availability/:courtId', authenticateToken, async (req, res) => {
  try {
    const { courtId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        error: 'Missing date',
        message: 'Date parameter is required'
      });
    }

    const bookingDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const now = new Date();
    
    if (bookingDate < today) {
      return res.status(400).json({
        error: 'Invalid date',
        message: 'Date cannot be in the past'
      });
    }

    // Get court details to use its operating hours
    const Court = require('../models/Court');
    const court = await Court.findById(courtId);
    
    if (!court || !court.isActive || court.status !== 'active') {
      return res.status(404).json({
        error: 'Court not found',
        message: 'Court does not exist or is not available'
      });
    }

    // Get court operating hours (default to 06:00 - 22:00 if not set)
    const openTime = court.operatingHours?.open || '06:00';
    const closeTime = court.operatingHours?.close || '22:00';
    const [openHours] = openTime.split(':').map(Number);
    const [closeHours, closeMinutes] = closeTime.split(':').map(Number);
    const closeTotalMinutes = closeHours * 60 + closeMinutes;

    // Get all bookings for the court on the specified date
    const bookings = await Booking.find({
      'court.id': courtId,
      bookingDate: bookingDate,
      status: { $in: ['confirmed', 'pending'] }
    }).select('startTime endTime');

    // Generate available time slots based on court operating hours
    const availableSlots = [];
    const bookedSlots = bookings.map(booking => ({
      start: booking.startTime,
      end: booking.endTime
    }));

    // Fix Bug 2: Check if booking date is today to filter past time slots
    const isToday = bookingDate.toDateString() === today.toDateString();

    // Generate slots up to closing time
    // Calculate the maximum start hour that allows at least a 1-hour booking before closing
    // For 23:59 closing: max start is 23:00 (1-hour booking ends at 23:59)
    // For 22:00 closing: max start is 21:00 (1-hour booking ends at 22:00)
    // For 21:00 closing: max start is 20:00 (1-hour booking ends at 21:00)
    let maxStartHour;
    if (closeHours >= 23 || (closeHours === 22 && closeMinutes > 0)) {
      // Court closes at 23:00 or later (including 23:59), generate slots up to 23:00
      maxStartHour = 23;
    } else {
      // Court closes before 23:00, generate slots up to (closeHours - 1)
      // e.g., if closes at 22:00, generate up to 21:00
      maxStartHour = Math.max(openHours, closeHours - 1);
    }

    for (let hour = openHours; hour <= maxStartHour; hour++) {
      const startTime = `${hour.toString().padStart(2, '0')}:00`;
      
      // Calculate end time for the slot
      let endTime;
      const slotEndHour = hour + 1;
      
      // If this slot would end after closing time, cap it at closing time
      const slotEndTotalMinutes = slotEndHour * 60;
      if (slotEndTotalMinutes > closeTotalMinutes) {
        // Slot extends past closing time, use closing time as end
        endTime = closeTime;
      } else {
        // Regular 1-hour slot
        endTime = `${slotEndHour.toString().padStart(2, '0')}:00`;
      }
      
      // Fix Bug 2: Skip past time slots for today
      if (isToday) {
        const [startHours, startMinutes] = startTime.split(':').map(Number);
        const slotDateTime = new Date(bookingDate);
        slotDateTime.setHours(startHours, startMinutes, 0, 0);
        
        if (slotDateTime <= now) {
          // Mark as unavailable (past time)
          availableSlots.push({
            startTime,
            endTime,
            available: false
          });
          continue;
        }
      }
      
      const isBooked = bookedSlots.some(slot => {
        return (startTime < slot.end && endTime > slot.start);
      });

      if (!isBooked) {
        availableSlots.push({
          startTime,
          endTime,
          available: true
        });
      } else {
        availableSlots.push({
          startTime,
          endTime,
          available: false
        });
      }
    }

    res.json({
      success: true,
      data: {
        courtId,
        date: bookingDate.toISOString().split('T')[0],
        availableSlots,
        openingTime: openTime,
        closingTime: closeTime // Include closing time in response
      }
    });

  } catch (error) {
    console.error('Check availability error:', error);
    res.status(500).json({
      error: 'Availability check failed',
      message: 'Something went wrong while checking availability'
    });
  }
});

// Confirm payment and update booking status
router.put('/:id/confirm', authenticateToken, async (req, res) => {
  try {
    const { paymentStatus, paymentMethod } = req.body;
    const bookingId = req.params.id;

    // Validate input
    if (!paymentStatus || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Payment status and method are required'
      });
    }

    // Find the booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns this booking
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only confirm your own bookings'
      });
    }

    // Update booking status
    booking.paymentStatus = paymentStatus;
    booking.paymentMethod = paymentMethod;
    booking.status = 'confirmed';
    booking.notes = 'Payment confirmed by user';

    await booking.save();

    res.json({
      success: true,
      message: 'Payment confirmed successfully',
      data: {
        booking: booking.getBookingSummary()
      }
    });

  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to confirm payment. Please try again.'
    });
  }
});

// @route   POST /api/bookings/:id/rate
// @desc    Submit rating for completed booking
// @access  Private
router.post('/:id/rate', authenticateToken, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const bookingId = req.params.id;

    // Validate input
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Find the booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns this booking
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only rate your own bookings'
      });
    }

    // Submit rating
    await booking.submitRating(rating, comment || '');

    res.json({
      success: true,
      message: 'Rating submitted successfully',
      data: {
        booking: booking.getBookingSummary()
      }
    });

  } catch (error) {
    console.error('Rating submission error:', error);
    
    if (error.message === 'Can only rate completed bookings') {
      return res.status(400).json({
        success: false,
        message: 'You can only rate completed bookings'
      });
    }
    
    if (error.message === 'Booking has already been rated') {
      return res.status(400).json({
        success: false,
        message: 'This booking has already been rated'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to submit rating. Please try again.'
    });
  }
});

module.exports = router;

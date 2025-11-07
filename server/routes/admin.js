const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Court = require('../models/Court');
const Booking = require('../models/Booking');
const router = express.Router();

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'bookmycourt-super-secret-key-2024';

// Middleware to verify admin access
const authenticateAdmin = async (req, res, next) => {
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

    if (user.role !== 'admin') {
      return res.status(403).json({
        error: 'Access denied',
        message: 'Admin access required'
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

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Private (Admin)
router.get('/dashboard', authenticateAdmin, async (req, res) => {
  try {
    // Get user statistics
    const userStats = await User.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          activeUsers: { $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] } },
          adminUsers: { $sum: { $cond: [{ $in: ['$role', ['admin', 'super_admin']] }, 1, 0] } }
        }
      }
    ]);

    // Get court statistics
    const courtStats = await Court.getStatistics();

    // Get booking statistics
    const bookingStats = await Booking.aggregate([
      {
        $group: {
          _id: null,
          totalBookings: { $sum: 1 },
          pendingBookings: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          confirmedBookings: { $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] } },
          cancelledBookings: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } },
          // Fix: Exclude cancelled bookings and refunded payments from revenue
          totalRevenue: { 
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

    // Get recent bookings
    const recentBookings = await Booking.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'firstName lastName email')
      .select('court bookingDate startTime endTime status totalAmount createdAt');

    // Get today's date range
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    // Get new users today
    const newUsersToday = await User.countDocuments({
      createdAt: { $gte: startOfToday, $lt: endOfToday },
      isActive: true
    });

    // Get bookings today
    const bookingsToday = await Booking.countDocuments({
      createdAt: { $gte: startOfToday, $lt: endOfToday },
      isActive: true
    });

    // Get active sessions (users who logged in within last 24 hours)
    const activeSessions = await User.countDocuments({
      lastLogin: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      isActive: true
    });

    // Get average rating from user ratings
    const ratingStats = await Booking.aggregate([
      {
        $match: {
          rating: { $exists: true, $ne: null },
          isActive: true
        }
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalRatings: { $sum: 1 },
          ratingDistribution: {
            $push: '$rating'
          }
        }
      }
    ]);

    // Get monthly revenue data (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenue = await Booking.aggregate([
      {
        $match: {
          paymentStatus: 'paid', // Only count paid bookings
          status: { $ne: 'cancelled' }, // Fix: Exclude cancelled bookings from revenue
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$totalAmount' },
          bookings: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      success: true,
      data: {
        users: userStats[0] || { totalUsers: 0, activeUsers: 0, adminUsers: 0 },
        courts: courtStats.overview,
        bookings: bookingStats[0] || { 
          totalBookings: 0, 
          pendingBookings: 0, 
          confirmedBookings: 0, 
          cancelledBookings: 0, 
          totalRevenue: 0 
        },
        ratings: ratingStats[0] || {
          averageRating: 0,
          totalRatings: 0,
          ratingDistribution: []
        },
        todayStats: {
          newUsersToday,
          bookingsToday,
          activeSessions
        },
        recentBookings: recentBookings.map(booking => ({
          id: booking._id,
          user: booking.user,
          court: booking.court.name,
          date: booking.bookingDate,
          time: `${booking.startTime} - ${booking.endTime}`,
          status: booking.status,
          amount: booking.totalAmount,
          createdAt: booking.createdAt
        })),
        monthlyRevenue,
        courtStatsBySport: courtStats.bySport
      }
    });

  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({
      error: 'Failed to fetch dashboard data',
      message: 'Something went wrong while fetching dashboard statistics'
    });
  }
});

// @route   GET /api/admin/courts
// @desc    Get all courts with filtering and pagination
// @access  Private (Admin)
router.get('/courts', authenticateAdmin, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sport, 
      status, 
      city, 
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const query = {};

    // Apply filters
    if (sport) query.sport = sport;
    if (status) query.status = status;
    if (city) query['location.city'] = new RegExp(city, 'i');
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { 'location.address': new RegExp(search, 'i') },
        { 'location.city': new RegExp(search, 'i') }
      ];
    }
    
    // Only show active courts by default (unless specifically filtering for inactive)
    if (!status || status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const courts = await Court.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip)
      .populate('createdBy', 'firstName lastName email')
      .populate('lastModifiedBy', 'firstName lastName email');

    const totalCourts = await Court.countDocuments(query);

    res.json({
      success: true,
      data: {
        courts: courts.map(court => court.getSummary()),
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCourts / parseInt(limit)),
          totalCourts,
          hasNext: skip + courts.length < totalCourts,
          hasPrev: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Get courts error:', error);
    res.status(500).json({
      error: 'Failed to fetch courts',
      message: 'Something went wrong while fetching courts'
    });
  }
});

// @route   POST /api/admin/courts
// @desc    Create a new court
// @access  Private (Admin)
router.post('/courts', authenticateAdmin, async (req, res) => {
  try {
    const courtData = {
      ...req.body,
      createdBy: req.user._id
    };

    const court = new Court(courtData);
    await court.save();

    res.status(201).json({
      success: true,
      message: 'Court created successfully',
      data: {
        court: court.getSummary()
      }
    });

  } catch (error) {
    console.error('Create court error:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        error: 'Validation failed',
        message: validationErrors.join(', ')
      });
    }

    res.status(500).json({
      error: 'Court creation failed',
      message: 'Something went wrong while creating the court'
    });
  }
});

// @route   PUT /api/admin/courts/:id
// @desc    Update a court
// @access  Private (Admin)
router.put('/courts/:id', authenticateAdmin, async (req, res) => {
  try {
    const court = await Court.findById(req.params.id);

    if (!court) {
      return res.status(404).json({
        error: 'Court not found',
        message: 'No court found with this ID'
      });
    }

    // Remove fields that shouldn't be updated
    const { createdBy, _id, __v, createdAt, ...updateFields } = req.body;
    
    // Add lastModifiedBy
    updateFields.lastModifiedBy = req.user._id;
    
    // Remove empty strings from required fields to avoid validation errors
    // Empty strings would fail validation, so we omit them to preserve existing values
    Object.keys(updateFields).forEach(key => {
      if (updateFields[key] === '' || updateFields[key] === null) {
        delete updateFields[key];
      } else if (typeof updateFields[key] === 'object' && updateFields[key] !== null) {
        // Handle nested objects (like location)
        Object.keys(updateFields[key]).forEach(nestedKey => {
          if (updateFields[key][nestedKey] === '' || updateFields[key][nestedKey] === null) {
            delete updateFields[key][nestedKey];
          }
        });
        // If nested object is now empty, remove it
        if (Object.keys(updateFields[key]).length === 0) {
          delete updateFields[key];
        }
      }
    });

    const updatedCourt = await Court.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).populate('createdBy', 'firstName lastName email')
     .populate('lastModifiedBy', 'firstName lastName email');
     
    if (!updatedCourt) {
      return res.status(404).json({
        success: false,
        error: 'Court not found',
        message: 'Court was not found or could not be updated'
      });
    }

    res.json({
      success: true,
      message: 'Court updated successfully',
      data: {
        court: updatedCourt.getSummary()
      }
    });

  } catch (error) {
    console.error('Update court error:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      errors: error.errors
    });
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: validationErrors.join(', ')
      });
    }

    // Handle pre-save validation errors (operating hours check)
    if (error.message && error.message.includes('Opening time must be before closing time')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid operating hours',
        message: 'Opening time must be before closing time'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Court update failed',
      message: error.message || 'Something went wrong while updating the court'
    });
  }
});

// @route   DELETE /api/admin/courts/:id
// @desc    Delete a court (soft delete)
// @access  Private (Admin)
router.delete('/courts/:id', authenticateAdmin, async (req, res) => {
  try {
    const court = await Court.findById(req.params.id);

    if (!court) {
      return res.status(404).json({
        error: 'Court not found',
        message: 'No court found with this ID'
      });
    }

    // Check if court has active bookings
    const activeBookings = await Booking.countDocuments({
      'court.id': court._id.toString(),
      status: { $in: ['pending', 'confirmed'] },
      bookingDate: { $gte: new Date() }
    });

    if (activeBookings > 0) {
      return res.status(400).json({
        error: 'Cannot delete court',
        message: 'Court has active bookings. Please cancel or complete them first.'
      });
    }

    court.isActive = false;
    court.status = 'closed';
    court.lastModifiedBy = req.user._id;
    await court.save();

    res.json({
      success: true,
      message: 'Court deleted successfully'
    });

  } catch (error) {
    console.error('Delete court error:', error);
    res.status(500).json({
      error: 'Court deletion failed',
      message: 'Something went wrong while deleting the court'
    });
  }
});

// @route   GET /api/admin/bookings
// @desc    Get all bookings with filtering and pagination
// @access  Private (Admin)
router.get('/bookings', authenticateAdmin, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      sport, 
      dateFrom, 
      dateTo,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const query = { isActive: true };

    // Apply filters
    if (status) query.status = status;
    if (sport) query['court.sport'] = sport;
    if (dateFrom || dateTo) {
      query.bookingDate = {};
      if (dateFrom) query.bookingDate.$gte = new Date(dateFrom);
      if (dateTo) query.bookingDate.$lte = new Date(dateTo);
    }
    if (search) {
      query.$or = [
        { 'court.name': new RegExp(search, 'i') },
        { 'court.location': new RegExp(search, 'i') }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const bookings = await Booking.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip)
      .populate('user', 'firstName lastName email phone');

    const totalBookings = await Booking.countDocuments(query);

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
      message: 'Something went wrong while fetching bookings'
    });
  }
});

// @route   PUT /api/admin/bookings/:id/status
// @desc    Update booking status
// @access  Private (Admin)
router.put('/bookings/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        error: 'Missing status',
        message: 'Status is required'
      });
    }

    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed', 'no-show'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Invalid status',
        message: 'Status must be one of: ' + validStatuses.join(', ')
      });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        error: 'Booking not found',
        message: 'No booking found with this ID'
      });
    }

    booking.status = status;
    if (status === 'cancelled') booking.cancelledAt = new Date();

    await booking.save();

    res.json({
      success: true,
      message: 'Booking status updated successfully',
      data: {
        booking: booking.getBookingSummary()
      }
    });

  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      error: 'Booking update failed',
      message: 'Something went wrong while updating the booking'
    });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users with filtering and pagination
// @access  Private (Admin)
router.get('/users', authenticateAdmin, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      role, 
      status,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const query = {};

    // Apply filters
    if (role) query.role = role;
    if (status === 'active') query.isActive = true;
    if (status === 'inactive') query.isActive = false;
    if (search) {
      query.$or = [
        { firstName: new RegExp(search, 'i') },
        { lastName: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const users = await User.find(query)
      .select('-password -otp -otpExpires')
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip);

    const totalUsers = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users: users.map(user => ({
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isActive: user.isActive,
          isEmailVerified: user.isEmailVerified,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin
        })),
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalUsers / parseInt(limit)),
          totalUsers,
          hasNext: skip + users.length < totalUsers,
          hasPrev: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      error: 'Failed to fetch users',
      message: 'Something went wrong while fetching users'
    });
  }
});

// @route   PUT /api/admin/users/:id/status
// @desc    Update user status (activate/deactivate)
// @access  Private (Admin)
router.put('/users/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({
        error: 'Invalid status',
        message: 'isActive must be a boolean value'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'No user found with this ID'
      });
    }

    // Prevent deactivating super admin
    if (user.role === 'super_admin' && !isActive) {
      return res.status(400).json({
        error: 'Cannot deactivate super admin',
        message: 'Super admin accounts cannot be deactivated'
      });
    }

    user.isActive = isActive;
    await user.save();

    res.json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          isActive: user.isActive
        }
      }
    });

  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      error: 'User update failed',
      message: 'Something went wrong while updating the user'
    });
  }
});

module.exports = router;

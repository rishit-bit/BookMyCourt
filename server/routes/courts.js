const express = require('express');
const jwt = require('jsonwebtoken');
const Court = require('../models/Court');
const User = require('../models/User');
const Booking = require('../models/Booking');
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

// @route   GET /api/courts
// @desc    Get all courts with optional filtering
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { sport, location, minPrice, maxPrice, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    const filter = { status: 'active', isActive: true };
    if (sport) filter.sport = sport;
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const courts = await Court.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Court.countDocuments(filter);

    // Calculate real-time ratings for each court
    const courtsWithRatings = await Promise.all(courts.map(async (court) => {
      const ratingStats = await Booking.aggregate([
        {
          $match: {
            'court.id': court._id.toString(),
            rating: { $exists: true, $ne: null },
            isActive: true
          }
        },
        {
          $group: {
            _id: null,
            averageRating: { $avg: '$rating' },
            totalRatings: { $sum: 1 }
          }
        }
      ]);

      const ratingData = ratingStats[0] || { averageRating: 0, totalRatings: 0 };
      
      return {
        ...court.toObject(),
        rating: ratingData.averageRating,
        totalRatings: ratingData.totalRatings
      };
    }));

    res.json({
      success: true,
      data: {
        courts: courtsWithRatings,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalCourts: total,
          hasNext: skip + courts.length < total,
          hasPrev: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Get courts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch courts'
    });
  }
});

// @route   GET /api/courts/sport/:sport
// @desc    Get courts by sport
// @access  Public
router.get('/sport/:sport', async (req, res) => {
  try {
    const { sport } = req.params;
    
    const courts = await Court.find({ 
      sport: sport, 
      status: 'active',
      isActive: true
    }).sort({ createdAt: -1 });

    // Calculate real-time ratings for each court
    const courtsWithRatings = await Promise.all(courts.map(async (court) => {
      const ratingStats = await Booking.aggregate([
        {
          $match: {
            'court.id': court._id.toString(),
            rating: { $exists: true, $ne: null },
            isActive: true
          }
        },
        {
          $group: {
            _id: null,
            averageRating: { $avg: '$rating' },
            totalRatings: { $sum: 1 }
          }
        }
      ]);

      const ratingData = ratingStats[0] || { averageRating: 0, totalRatings: 0 };
      
      return {
        ...court.toObject(),
        rating: ratingData.averageRating,
        totalRatings: ratingData.totalRatings
      };
    }));

    res.json({
      success: true,
      data: {
        courts: courtsWithRatings,
        sport
      }
    });
  } catch (error) {
    console.error('Get courts by sport error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch courts for this sport'
    });
  }
});

// @route   GET /api/courts/:id
// @desc    Get specific court details
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const court = await Court.findById(req.params.id);

    if (!court || court.status !== 'active' || !court.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Court not found'
      });
    }

    res.json({
      success: true,
      data: {
        court
      }
    });
  } catch (error) {
    console.error('Get court error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch court details'
    });
  }
});

module.exports = router;

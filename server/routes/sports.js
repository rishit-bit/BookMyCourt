const express = require('express');
const router = express.Router();

// @route   GET /api/sports
// @desc    Get all available sports
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Define available sports with their details
    const sports = [
      {
        id: 'cricket',
        name: 'Cricket',
        description: 'Bat and ball game',
        icon: '🏏'
      },
      {
        id: 'football',
        name: 'Football',
        description: 'Soccer game',
        icon: '⚽'
      },
      {
        id: 'basketball',
        name: 'Basketball',
        description: 'Basket shooting game',
        icon: '🏀'
      },
      {
        id: 'tennis',
        name: 'Tennis',
        description: 'Racket sport',
        icon: '🎾'
      },
      {
        id: 'badminton',
        name: 'Badminton',
        description: 'Racket sport with shuttlecock',
        icon: '🏸'
      },
      {
        id: 'volleyball',
        name: 'Volleyball',
        description: 'Net sport',
        icon: '🏐'
      },
      {
        id: 'hockey',
        name: 'Hockey',
        description: 'Stick and ball game',
        icon: '🏑'
      },
      {
        id: 'table-tennis',
        name: 'Table Tennis',
        description: 'Ping pong',
        icon: '🏓'
      },
      {
        id: 'squash',
        name: 'Squash',
        description: 'Racket sport in enclosed court',
        icon: '🥎'
      }
    ];

    res.json({
      success: true,
      data: {
        sports
      }
    });
  } catch (error) {
    console.error('Get sports error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sports'
    });
  }
});

module.exports = router;

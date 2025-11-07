const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendVerificationEmail, sendWelcomeEmail, sendOTPEmail, generateVerificationToken, generateOTP } = require('../utils/emailService');
const router = express.Router();

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'bookmycourt-super-secret-key-2024';

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};


router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, phone, dateOfBirth } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        error: 'User already exists',
        message: existingUser.email === email ? 'Email already registered' : 'Username already taken'
      });
    }

    // Generate OTP
    const otpCode = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create new user
    const user = new User({
      username,
      email,
      password,
      firstName,
      lastName,
      phone,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      otpCode: otpCode,
      otpExpires: otpExpires
    });

    await user.save();

    // Send OTP email
    try {
      await sendOTPEmail(email, firstName, otpCode);
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError);
      // Continue with registration even if email fails
    }

    // Generate token
    const token = generateToken(user._id);

    // Return user data (without password) and token
    res.status(201).json({
      success: true,
      message: 'User registered successfully! Please check your email for the verification code.',
      data: {
        user: user.getPublicProfile(),
        token,
        otpSent: true,
        needsVerification: true
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        error: 'Validation failed',
        message: validationErrors.join(', ')
      });
    }

    res.status(500).json({
      error: 'Registration failed',
      message: 'Something went wrong during registration. Please try again.'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        error: 'Missing credentials',
        message: 'Please provide both email and password'
      });
    }

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        error: 'Account deactivated',
        message: 'Your account has been deactivated. Please contact support.'
      });
    }

    // Check if email is verified (skip for admin users)
    if (!user.isVerified && user.role !== 'admin') {
      return res.status(401).json({
        error: 'Email not verified',
        message: 'Please verify your email address with the OTP code before logging in. Check your inbox for the verification code.',
        needsVerification: true
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Different welcome messages for admin vs regular users
    let welcomeMessage;
    if (user.role === 'admin' || user.role === 'super_admin') {
      welcomeMessage = `Welcome back, ${user.firstName}! Ready to manage the system? 👑`;
    } else {
      welcomeMessage = `Welcome back, ${user.firstName}! Ready to book your court? 🏟️`;
    }

    res.json({
      success: true,
      message: welcomeMessage,
      data: {
        user: user.getPublicProfile(),
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      message: 'Something went wrong during login. Please try again.'
    });
  }
});

// @route   POST /api/auth/verify-token
// @desc    Verify JWT token
// @access  Private
router.post('/verify-token', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(401).json({
        error: 'No token provided',
        message: 'Access denied. No token provided.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Get user data
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Token is invalid or expired.'
      });
    }

    res.json({
      success: true,
      message: 'Token verified successfully',
      data: {
        user: user.getPublicProfile()
      }
    });

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Token is invalid or expired.'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expired',
        message: 'Token has expired. Please login again.'
      });
    }

    res.status(500).json({
      error: 'Token verification failed',
      message: 'Something went wrong during token verification.'
    });
  }
});

// @route   POST /api/auth/refresh-token
// @desc    Refresh JWT token
// @access  Private
router.post('/refresh-token', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(401).json({
        error: 'No token provided',
        message: 'Access denied. No token provided.'
      });
    }

    // Verify current token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Check if user still exists
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({
        error: 'User not found',
        message: 'User no longer exists or is inactive.'
      });
    }

    // Generate new token
    const newToken = generateToken(user._id);

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        user: user.getPublicProfile(),
        token: newToken
      }
    });

  } catch (error) {
    res.status(401).json({
      error: 'Token refresh failed',
      message: 'Invalid or expired token. Please login again.'
    });
  }
});

// @route   POST /api/auth/verify-otp
// @desc    Verify user email with OTP
// @access  Public
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        error: 'Missing credentials',
        message: 'Email and OTP code are required'
      });
    }

    // Find user with matching email and OTP
    const user = await User.findOne({
      email: email,
      otpCode: otp,
      otpExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({
        error: 'Invalid or expired OTP',
        message: 'OTP code is invalid or has expired. Please request a new one.'
      });
    }

    // Update user verification status
    user.isVerified = true;
    user.otpCode = null;
    user.otpExpires = null;
    await user.save();

    // Refresh user object to ensure we have the latest data
    const updatedUser = await User.findById(user._id);
    
    if (!updatedUser) {
      return res.status(500).json({
        error: 'User not found',
        message: 'An error occurred during verification. Please try again.'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: updatedUser._id,
        email: updatedUser.email,
        isVerified: updatedUser.isVerified
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Send welcome email
    try {
      await sendWelcomeEmail(updatedUser.email, updatedUser.firstName);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Continue even if welcome email fails
    }

    res.json({
      success: true,
      message: 'Email verified successfully! Welcome to BookMyCourt! 🎉',
      data: {
        user: updatedUser.getPublicProfile(),
        token: token
      }
    });

  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({
      error: 'Verification failed',
      message: 'Something went wrong during OTP verification. Please try again.'
    });
  }
});

// @route   POST /api/auth/resend-otp
// @desc    Resend OTP verification code
// @access  Public
router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: 'Missing email',
        message: 'Email address is required'
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'No user found with this email address'
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        error: 'Already verified',
        message: 'This email is already verified'
      });
    }

    // Generate new OTP
    const otpCode = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user with new OTP
    user.otpCode = otpCode;
    user.otpExpires = otpExpires;
    await user.save();

    // Send new OTP email
    try {
      await sendOTPEmail(email, user.firstName, otpCode);
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError);
      return res.status(500).json({
        error: 'Email sending failed',
        message: 'Failed to send OTP email. Please try again later.'
      });
    }

    res.json({
      success: true,
      message: 'OTP code sent successfully! Please check your inbox.',
      data: {
        otpSent: true
      }
    });

  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      error: 'Resend failed',
      message: 'Something went wrong while resending OTP code. Please try again.'
    });
  }
});

// @route   PUT /api/auth/select-sports
// @desc    Update user's selected sports (multiple)
// @access  Private
router.put('/select-sports', async (req, res) => {
  try {
    const { sports } = req.body;
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        error: 'No token provided',
        message: 'Access denied. No token provided.'
      });
    }

    if (!sports || !Array.isArray(sports) || sports.length === 0) {
      return res.status(400).json({
        error: 'Missing sports',
        message: 'At least one sport selection is required'
      });
    }

    // Validate sport selections
    const validSports = ['cricket', 'football', 'basketball', 'tennis', 'badminton', 'volleyball', 'hockey', 'table-tennis', 'squash', 'swimming'];
    const invalidSports = sports.filter(sport => !validSports.includes(sport));
    
    if (invalidSports.length > 0) {
      return res.status(400).json({
        error: 'Invalid sports',
        message: `Invalid sports selected: ${invalidSports.join(', ')}. Please select valid sports from the available options.`
      });
    }

    // Verify token and get user
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Token is invalid or expired.'
      });
    }

    // Initialize preferences if not exists
    if (!user.preferences) {
      user.preferences = {
        favoriteSports: [],
        selectedSport: null,
        notifications: {
          email: true,
          sms: false,
          push: true
        }
      };
    }

    // Update user's selected sports
    user.preferences.favoriteSports = sports;
    // Set the first sport as the primary selected sport for backward compatibility
    user.preferences.selectedSport = sports[0];
    await user.save();

    res.json({
      success: true,
      message: `Sports preferences updated! You selected ${sports.length} sport${sports.length > 1 ? 's' : ''}.`,
      data: {
        user: user.getPublicProfile()
      }
    });

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Token is invalid or expired.'
      });
    }

    console.error('Select sports error:', error);
    res.status(500).json({
      error: 'Update failed',
      message: 'Something went wrong while updating sports preferences. Please try again.'
    });
  }
});

module.exports = router;



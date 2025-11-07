const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendOTPEmail, generateOTP } = require('../utils/emailService');
const upload = require('../middleware/upload');
const fs = require('fs');
const path = require('path');
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

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user.getPublicProfile()
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Failed to get profile',
      message: 'Something went wrong while fetching your profile'
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, email, phone, dateOfBirth, preferences, currentPassword, newPassword } = req.body;
    
    // Fields that can be updated
    const updateFields = {};
    
    if (firstName !== undefined) updateFields.firstName = firstName;
    if (lastName !== undefined) updateFields.lastName = lastName;
    if (phone !== undefined) updateFields.phone = phone;
    if (dateOfBirth !== undefined) updateFields.dateOfBirth = new Date(dateOfBirth);
    if (preferences !== undefined) updateFields.preferences = preferences;

    // Handle email change
    if (email !== undefined && email !== req.user.email) {
      // Check if email is already taken
      const existingUser = await User.findOne({ email: email });
      if (existingUser) {
        return res.status(400).json({
          error: 'Email already exists',
          message: 'This email address is already registered'
        });
      }
      
      // Generate OTP for email verification
      const otpCode = generateOTP();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      
      updateFields.email = email;
      updateFields.isVerified = false; // Require re-verification for email change
      updateFields.otpCode = otpCode;
      updateFields.otpExpires = otpExpires;
    }

    // Handle password change
    if (currentPassword && newPassword) {
      // Get user with password for comparison
      const user = await User.findById(req.user._id).select('+password');
      
      // Verify current password
      const isCurrentPasswordValid = await user.comparePassword(currentPassword);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          error: 'Invalid password',
          message: 'Current password is incorrect'
        });
      }

      // Validate new password
      if (newPassword.length < 6) {
        return res.status(400).json({
          error: 'Invalid password',
          message: 'New password must be at least 6 characters long'
        });
      }

      updateFields.password = newPassword;
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateFields,
      { new: true, runValidators: true }
    );

    let message = 'Profile updated successfully! 🎯';
    let needsEmailVerification = false;
    
    if (email !== undefined && email !== req.user.email) {
      needsEmailVerification = true;
      message += ' Please verify your new email address.';
      
      // Send OTP email
      try {
        await sendOTPEmail(email, updatedUser.firstName, otpCode);
        message += ' OTP sent to your new email address.';
      } catch (emailError) {
        console.error('Failed to send OTP email:', emailError);
        message += ' Please check your email for verification instructions.';
      }
    }

    res.json({
      success: true,
      message: message,
      needsEmailVerification: needsEmailVerification,
      data: {
        user: updatedUser.getPublicProfile()
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        error: 'Validation failed',
        message: validationErrors.join(', ')
      });
    }

    res.status(500).json({
      error: 'Profile update failed',
      message: 'Something went wrong while updating your profile'
    });
  }
});

// @route   POST /api/users/verify-new-email
// @desc    Verify new email with OTP
// @access  Private
router.post('/verify-new-email', authenticateToken, async (req, res) => {
  try {
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({
        error: 'Missing OTP',
        message: 'OTP code is required'
      });
    }

    // Find user with matching OTP
    const user = await User.findOne({
      _id: req.user._id,
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

    res.json({
      success: true,
      message: 'Email verified successfully! Your new email address is now active.',
      data: {
        user: user.getPublicProfile()
      }
    });

  } catch (error) {
    console.error('Verify new email error:', error);
    res.status(500).json({
      error: 'Verification failed',
      message: 'Something went wrong while verifying your email. Please try again.'
    });
  }
});

// @route   POST /api/users/upload-photo
// @desc    Upload profile photo
// @access  Private
router.post('/upload-photo', authenticateToken, (req, res, next) => {
  upload.single('profilePhoto')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({
        error: 'File upload error',
        message: err.message
      });
    }
    next();
  });
}, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'Missing photo',
        message: 'Profile photo is required'
      });
    }

    // Delete old profile photo if exists
    if (req.user.profilePhoto) {
      const oldPhotoPath = path.join(__dirname, '..', 'uploads', 'profile-photos', path.basename(req.user.profilePhoto));
      if (fs.existsSync(oldPhotoPath)) {
        fs.unlinkSync(oldPhotoPath);
      }
    }

    // Generate photo URL
    const photoUrl = `/uploads/profile-photos/${req.file.filename}`;
    console.log('Uploaded file:', req.file);
    console.log('Generated photo URL:', photoUrl);
    
    // Check if file actually exists
    const filePath = path.join(__dirname, '..', 'uploads', 'profile-photos', req.file.filename);
    console.log('File path:', filePath);
    console.log('File exists:', fs.existsSync(filePath));

    // Update user profile photo
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { profilePhoto: photoUrl },
      { new: true, runValidators: true }
    );
    
    console.log('Updated user profile photo:', updatedUser.profilePhoto);

    res.json({
      success: true,
      message: 'Profile photo updated successfully! 📸',
      data: {
        user: updatedUser.getPublicProfile()
      }
    });

  } catch (error) {
    console.error('Upload photo error:', error);
    
    // Delete uploaded file if there was an error
    if (req.file) {
      const filePath = path.join(__dirname, '..', 'uploads', 'profile-photos', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    res.status(500).json({
      error: 'Photo upload failed',
      message: 'Something went wrong while uploading your photo. Please try again.'
    });
  }
});

// @route   DELETE /api/users/photo
// @desc    Remove profile photo
// @access  Private
router.delete('/photo', authenticateToken, async (req, res) => {
  try {
    // Delete photo file if exists
    if (req.user.profilePhoto) {
      const photoPath = path.join(__dirname, '..', 'uploads', 'profile-photos', path.basename(req.user.profilePhoto));
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }

    // Remove profile photo from database
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { profilePhoto: null },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Profile photo removed successfully!',
      data: {
        user: updatedUser.getPublicProfile()
      }
    });

  } catch (error) {
    console.error('Remove photo error:', error);
    res.status(500).json({
      error: 'Photo removal failed',
      message: 'Something went wrong while removing your photo. Please try again.'
    });
  }
});

// @route   PUT /api/users/password
// @desc    Change user password
// @access  Private
router.put('/password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: 'Missing passwords',
        message: 'Please provide both current and new password'
      });
    }

    // Get user with password for comparison
    const user = await User.findById(req.user._id).select('+password');
    
    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        error: 'Invalid password',
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully! 🔐'
    });

  } catch (error) {
    console.error('Change password error:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        error: 'Validation failed',
        message: validationErrors.join(', ')
      });
    }

    res.status(500).json({
      error: 'Password change failed',
      message: 'Something went wrong while changing your password'
    });
  }
});

// @route   PUT /api/users/preferences
// @desc    Update user preferences
// @access  Private
router.put('/preferences', authenticateToken, async (req, res) => {
  try {
    const { favoriteSports, notifications } = req.body;
    
    const updateFields = {};
    
    if (favoriteSports !== undefined) updateFields['preferences.favoriteSports'] = favoriteSports;
    if (notifications !== undefined) updateFields['preferences.notifications'] = notifications;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateFields,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Preferences updated successfully! ⚡',
      data: {
        user: updatedUser.getPublicProfile()
      }
    });

  } catch (error) {
    console.error('Update preferences error:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        error: 'Validation failed',
        message: validationErrors.join(', ')
      });
    }

    res.status(500).json({
      error: 'Preferences update failed',
      message: 'Something went wrong while updating your preferences'
    });
  }
});

// @route   DELETE /api/users/profile
// @desc    Deactivate user account
// @access  Private
router.delete('/profile', authenticateToken, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { isActive: false });

    res.json({
      success: true,
      message: 'Account deactivated successfully. We\'ll miss you! 😢'
    });

  } catch (error) {
    console.error('Deactivate account error:', error);
    res.status(500).json({
      error: 'Account deactivation failed',
      message: 'Something went wrong while deactivating your account'
    });
  }
});

module.exports = router;



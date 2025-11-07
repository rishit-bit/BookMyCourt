const express = require('express');
const jwt = require('jsonwebtoken');
const Notification = require('../models/Notification');
const User = require('../models/User');
const router = express.Router();

// Middleware to authenticate admin
const authenticateAdmin = async (req, res, next) => {
  try {
    // Try multiple ways to get the token
    const authHeader = req.headers.authorization || req.headers.Authorization;
    let token = null;
    
    if (authHeader) {
      token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    }
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token or user not found.'
      });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Admin authentication error:', error);
    res.status(401).json({
      success: false,
      message: error.message || 'Invalid token.'
    });
  }
};

// Middleware to authenticate user
const authenticateToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token or user not found.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};

// @route   POST /api/notifications
// @desc    Send notification to all users or specific users (Admin only)
// @access  Private (Admin)
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const { title, message } = req.body;

    // Validate required fields
    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Title and message are required'
      });
    }

    // Create notification (always sent to all users)
    const notificationData = {
      title,
      message,
      sentBy: req.user._id
    };

    const notification = new Notification(notificationData);
    await notification.save();

    // Populate sender information
    await notification.populate('sentBy', 'firstName lastName email');

    // Emit real-time notification to all users via WebSocket
    const io = req.app.get('io');
    if (io) {
      const notificationData = {
        id: notification._id.toString(), // Convert ObjectId to string
        title: notification.title,
        message: notification.message,
        sentBy: {
          firstName: notification.sentBy.firstName,
          lastName: notification.sentBy.lastName,
          email: notification.sentBy.email
        },
        createdAt: notification.createdAt,
        isRead: false
      };

      // Emit to all connected users (excluding admins)
      io.except('admin_room').emit('new_notification', notificationData);
      
      console.log(`📢 Real-time notification sent to all users: "${notification.title}"`);
    }

    res.status(201).json({
      success: true,
      message: 'Notification sent successfully',
      data: {
        notification: notification.getSummary()
      }
    });

  } catch (error) {
    console.error('Send notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send notification. Please try again.'
    });
  }
});

// @route   GET /api/notifications
// @desc    Get all notifications (Admin only)
// @access  Private (Admin)
router.get('/', authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build filter
    const filter = {};
    if (status === 'active') filter.isActive = true;

    const notifications = await Notification.find(filter)
      .populate('sentBy', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Notification.countDocuments(filter);

    res.json({
      success: true,
      data: {
        notifications: notifications.map(notification => notification.getSummary()),
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalNotifications: total,
          hasNext: skip + notifications.length < total,
          hasPrev: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications'
    });
  }
});

// @route   GET /api/notifications/stats
// @desc    Get notification statistics (Admin only)
// @access  Private (Admin)
router.get('/stats', authenticateAdmin, async (req, res) => {
  try {
    const stats = await Notification.getNotificationStats();

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get notification stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notification statistics'
    });
  }
});

// @route   PUT /api/notifications/:id/status
// @desc    Update notification status (Admin only)
// @access  Private (Admin)
router.put('/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const { isActive } = req.body;
    const notificationId = req.params.id;

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    notification.isActive = isActive;
    await notification.save();

    res.json({
      success: true,
      message: 'Notification status updated successfully',
      data: {
        notification: notification.getSummary()
      }
    });

  } catch (error) {
    console.error('Update notification status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update notification status'
    });
  }
});

// @route   DELETE /api/notifications/:id
// @desc    Delete notification (Admin only) - removes from all users
// @access  Private (Admin)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const notificationId = req.params.id;

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Store notification ID before deletion for WebSocket notification
    const deletedNotificationId = notification._id.toString();

    // Delete the notification from database (removes it for all users)
    await Notification.findByIdAndDelete(notificationId);

    // Emit WebSocket event to notify all users that the notification was deleted
    const io = req.app.get('io');
    if (io) {
      // Emit to all connected users (excluding admins in admin room)
      io.except('admin_room').emit('notification_deleted', {
        notificationId: deletedNotificationId
      });
      
      console.log(`🗑️ Notification deleted and removed from all users: ${deletedNotificationId}`);
    }

    res.json({
      success: true,
      message: 'Notification deleted successfully and removed from all users'
    });

  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification'
    });
  }
});

// @route   GET /api/notifications/user
// @desc    Get notifications for current user
// @access  Private
router.get('/user', authenticateToken, async (req, res) => {
  try {
    const { limit = 10, unreadOnly = false } = req.query;
    const userId = req.user._id;

    const notifications = await Notification.getNotificationsForUser(userId, {
      limit: parseInt(limit)
    });

    // Filter unread notifications if requested
    const filteredNotifications = unreadOnly 
      ? notifications.filter(notification => !notification.isRead)
      : notifications;

    res.json({
      success: true,
      data: {
        notifications: filteredNotifications,
        unreadCount: notifications.filter(n => !n.isRead).length
      }
    });

  } catch (error) {
    console.error('Get user notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications'
    });
  }
});

// @route   PUT /api/notifications/read-all
// @desc    Mark all notifications as read for current user
// @access  Private
// NOTE: This route must be defined BEFORE /:id/read to avoid route conflicts
router.put('/read-all', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all unread notifications for the user
    const notifications = await Notification.find({
      isActive: true,
      'readBy.user': { $ne: userId }
    });

    // Mark all as read
    await Promise.all(
      notifications.map(notification => notification.markAsRead(userId))
    );

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });

  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark all notifications as read'
    });
  }
});

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
// NOTE: This route must be defined AFTER /read-all to avoid route conflicts
router.put('/:id/read', authenticateToken, async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user._id;

    // Validate notification ID format
    if (!notificationId || !notificationId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid notification ID format'
      });
    }

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // All users are recipients (no need to check)
    await notification.markAsRead(userId);

    res.json({
      success: true,
      message: 'Notification marked as read'
    });

  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read'
    });
  }
});

module.exports = router;

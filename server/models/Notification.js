const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, 'Notification message is required'],
    trim: true,
    maxlength: [500, 'Notification message cannot exceed 500 characters']
  },
  title: {
    type: String,
    required: [true, 'Notification title is required'],
    trim: true,
    maxlength: [100, 'Notification title cannot exceed 100 characters']
  },
  sentBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Admin sender is required']
  },
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for efficient queries
notificationSchema.index({ recipients: 1, isActive: 1, createdAt: -1 });
notificationSchema.index({ specificUsers: 1, isActive: 1, createdAt: -1 });
notificationSchema.index({ 'readBy.user': 1 });


// Method to mark notification as read for a user
notificationSchema.methods.markAsRead = function(userId) {
  const existingRead = this.readBy.find(read => read.user.toString() === userId.toString());
  
  if (!existingRead) {
    this.readBy.push({
      user: userId,
      readAt: new Date()
    });
    return this.save();
  }
  
  return Promise.resolve(this);
};

// Method to check if notification is read by a user
notificationSchema.methods.isReadBy = function(userId) {
  return this.readBy.some(read => read.user.toString() === userId.toString());
};

// Method to get notification summary
notificationSchema.methods.getSummary = function() {
  return {
    id: this._id.toString(), // Convert ObjectId to string for consistency
    title: this.title,
    message: this.message,
    sentBy: this.sentBy,
    readCount: this.readBy.length,
    createdAt: this.createdAt
  };
};

// Static method to get notifications for a specific user
notificationSchema.statics.getNotificationsForUser = async function(userId, options = {}) {
  const query = {
    isActive: true
  };

  const notifications = await this.find(query)
    .populate('sentBy', 'firstName lastName email')
    .sort({ createdAt: -1 })
    .limit(options.limit || 50)
    .skip(options.skip || 0);

  return notifications.map(notification => ({
    ...notification.getSummary(),
    isRead: notification.isReadBy(userId)
  }));
};

// Static method to get notification statistics
notificationSchema.statics.getNotificationStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalNotifications: { $sum: 1 },
        activeNotifications: {
          $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
        }
      }
    }
  ]);

  return {
    overview: stats[0] || { totalNotifications: 0, activeNotifications: 0 }
  };
};

module.exports = mongoose.model('Notification', notificationSchema);

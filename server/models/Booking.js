const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  court: {
    id: {
      type: String,
      required: [true, 'Court ID is required']
    },
    name: {
      type: String,
      required: [true, 'Court name is required']
    },
    location: {
      type: String,
      required: [true, 'Court location is required']
    },
    sport: {
      type: String,
      required: [true, 'Sport type is required'],
      enum: ['cricket', 'football', 'basketball', 'tennis', 'badminton', 'volleyball', 'hockey', 'table-tennis', 'squash']
    },
    price: {
      type: Number,
      required: [true, 'Court price is required'],
      min: [0, 'Price cannot be negative']
    }
  },
  bookingDate: {
    type: Date,
    required: [true, 'Booking date is required'],
    validate: {
      validator: function(v) {
        return v >= new Date().setHours(0, 0, 0, 0);
      },
      message: 'Booking date cannot be in the past'
    }
  },
  startTime: {
    type: String,
    required: [true, 'Start time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)']
  },
  endTime: {
    type: String,
    required: [true, 'End time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)']
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [1, 'Duration must be at least 1 hour'],
    max: [8, 'Duration cannot exceed 8 hours']
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total amount cannot be negative']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no-show'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'upi', 'netbanking', 'wallet', 'cash'],
    default: 'card'
  },
  specialRequests: {
    type: String,
    maxlength: [500, 'Special requests cannot exceed 500 characters']
  },
  cancellationReason: {
    type: String,
    maxlength: [200, 'Cancellation reason cannot exceed 200 characters']
  },
  cancelledAt: {
    type: Date
  },
  notes: {
    type: String,
    maxlength: [300, 'Notes cannot exceed 300 characters']
  },
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
    default: null
  },
  ratingComment: {
    type: String,
    maxlength: [500, 'Rating comment cannot exceed 500 characters']
  },
  ratedAt: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for formatted booking date
bookingSchema.virtual('formattedDate').get(function() {
  return this.bookingDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Virtual for booking duration in hours
bookingSchema.virtual('durationHours').get(function() {
  return this.duration;
});

// Virtual for booking status display
bookingSchema.virtual('statusDisplay').get(function() {
  const statusMap = {
    'pending': 'Pending Confirmation',
    'confirmed': 'Confirmed',
    'cancelled': 'Cancelled',
    'completed': 'Completed',
    'no-show': 'No Show'
  };
  return statusMap[this.status] || this.status;
});

// Index for efficient queries
bookingSchema.index({ user: 1, bookingDate: 1 });
bookingSchema.index({ 'court.id': 1, bookingDate: 1, startTime: 1 });
bookingSchema.index({ status: 1, bookingDate: 1 });
bookingSchema.index({ createdAt: -1 });

// Pre-save middleware to calculate total amount
bookingSchema.pre('save', function(next) {
  if (this.isModified('duration') || this.isModified('court.price')) {
    this.totalAmount = this.court.price * this.duration;
  }
  next();
});

// Method to check if booking can be cancelled
bookingSchema.methods.canBeCancelled = function() {
  const now = new Date();
  const bookingDateTime = new Date(this.bookingDate);
  const [hours, minutes] = this.startTime.split(':');
  bookingDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  
  // Can cancel if booking is more than 2 hours away
  const timeDiff = bookingDateTime.getTime() - now.getTime();
  const hoursDiff = timeDiff / (1000 * 60 * 60);
  
  return this.status === 'confirmed' && hoursDiff > 2;
};

// Method to get booking summary
bookingSchema.methods.getBookingSummary = function() {
  const summary = {
    id: this._id,
    courtName: this.court.name,
    location: this.court.location,
    sport: this.court.sport,
    date: this.formattedDate,
    time: `${this.startTime} - ${this.endTime}`,
    duration: this.durationHours,
    totalAmount: this.totalAmount,
    status: this.status,
    statusDisplay: this.statusDisplay,
    paymentStatus: this.paymentStatus,
    paymentMethod: this.paymentMethod,
    rating: this.rating,
    ratingComment: this.ratingComment,
    ratedAt: this.ratedAt
  };

  // Include user information if populated
  if (this.user && typeof this.user === 'object' && this.user.firstName) {
    summary.user = {
      id: this.user._id,
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
      phone: this.user.phone
    };
  }

  return summary;
};

// Method to submit rating
bookingSchema.methods.submitRating = function(rating, comment = '') {
  if (this.status !== 'completed') {
    throw new Error('Can only rate completed bookings');
  }
  
  if (this.rating !== null) {
    throw new Error('Booking has already been rated');
  }
  
  this.rating = rating;
  this.ratingComment = comment;
  this.ratedAt = new Date();
  
  return this.save();
};

// Static method to check court availability
bookingSchema.statics.checkAvailability = async function(courtId, date, startTime, endTime, excludeBookingId = null) {
  const query = {
    'court.id': courtId,
    bookingDate: date,
    status: { $in: ['confirmed', 'pending'] },
    $or: [
      {
        startTime: { $lt: endTime },
        endTime: { $gt: startTime }
      }
    ]
  };
  
  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }
  
  const conflictingBookings = await this.find(query);
  return conflictingBookings.length === 0;
};

// Static method to get user bookings
bookingSchema.statics.getUserBookings = async function(userId, status = null, limit = 10, skip = 0) {
  const query = { user: userId, isActive: true };
  if (status) {
    query.status = status;
  }
  
  return await this.find(query)
    .sort({ bookingDate: -1, startTime: -1 })
    .limit(limit)
    .skip(skip)
    .populate('user', 'firstName lastName email');
};

module.exports = mongoose.model('Booking', bookingSchema);

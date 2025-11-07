const mongoose = require('mongoose');

const courtSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Court name is required'],
    trim: true,
    maxlength: [100, 'Court name cannot exceed 100 characters']
  },
  sport: {
    type: String,
    required: [true, 'Sport type is required'],
    enum: ['cricket', 'football', 'basketball', 'tennis', 'badminton', 'volleyball', 'hockey', 'table-tennis', 'squash']
  },
  location: {
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
      match: [/^[1-9][0-9]{5}$/, 'Invalid pincode format']
    },
    coordinates: {
      latitude: {
        type: Number,
        min: -90,
        max: 90
      },
      longitude: {
        type: Number,
        min: -180,
        max: 180
      }
    }
  },
  capacity: {
    type: Number,
    required: [true, 'Capacity is required'],
    min: [1, 'Capacity must be at least 1'],
    max: [10000, 'Capacity cannot exceed 10000']
  },
  pricePerHour: {
    type: Number,
    required: [true, 'Price per hour is required'],
    min: [0, 'Price cannot be negative']
  },
  rating: {
    type: Number,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot exceed 5'],
    default: 0
  },
  facilities: [{
    type: String,
    trim: true
  }],
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: 'Court image'
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  operatingHours: {
    open: {
      type: String,
      required: true,
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)']
    },
    close: {
      type: String,
      required: true,
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)']
    }
  },
  availability: {
    monday: { type: Boolean, default: true },
    tuesday: { type: Boolean, default: true },
    wednesday: { type: Boolean, default: true },
    thursday: { type: Boolean, default: true },
    friday: { type: Boolean, default: true },
    saturday: { type: Boolean, default: true },
    sunday: { type: Boolean, default: true }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance', 'closed'],
    default: 'active'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full address
courtSchema.virtual('fullAddress').get(function() {
  return `${this.location.address}, ${this.location.city}, ${this.location.state} - ${this.location.pincode}`;
});

// Virtual for court status display
courtSchema.virtual('statusDisplay').get(function() {
  const statusMap = {
    'active': 'Active',
    'inactive': 'Inactive',
    'maintenance': 'Under Maintenance',
    'closed': 'Closed'
  };
  return statusMap[this.status] || this.status;
});

// Virtual for primary image
courtSchema.virtual('primaryImage').get(function() {
  const primaryImg = this.images.find(img => img.isPrimary);
  return primaryImg || this.images[0] || null;
});

// Index for efficient queries
courtSchema.index({ sport: 1, status: 1 });
courtSchema.index({ 'location.city': 1, 'location.state': 1 });
courtSchema.index({ pricePerHour: 1 });
courtSchema.index({ rating: -1 });
courtSchema.index({ isActive: 1, status: 1 });

// Pre-save middleware to validate operating hours
courtSchema.pre('save', function(next) {
  if (this.operatingHours.open && this.operatingHours.close) {
    const openTime = new Date(`2000-01-01 ${this.operatingHours.open}`);
    const closeTime = new Date(`2000-01-01 ${this.operatingHours.close}`);
    
    if (openTime >= closeTime) {
      return next(new Error('Opening time must be before closing time'));
    }
  }
  next();
});

// Method to check if court is available on a specific day
courtSchema.methods.isAvailableOnDay = function(dayOfWeek) {
  const dayMap = {
    0: 'sunday',
    1: 'monday',
    2: 'tuesday',
    3: 'wednesday',
    4: 'thursday',
    5: 'friday',
    6: 'saturday'
  };
  
  const day = dayMap[dayOfWeek];
  return this.availability[day] && this.status === 'active' && this.isActive;
};

// Method to get court summary
courtSchema.methods.getSummary = function() {
  return {
    id: this._id,
    name: this.name,
    sport: this.sport,
    location: this.location, // Return full location object for editing
    fullAddress: this.fullAddress, // Also include fullAddress string for display
    capacity: this.capacity,
    pricePerHour: this.pricePerHour,
    rating: this.rating,
    facilities: this.facilities,
    status: this.status, // Return actual status (lowercase) not statusDisplay
    statusDisplay: this.statusDisplay, // Also include display version for UI
    primaryImage: this.primaryImage?.url,
    operatingHours: this.operatingHours // Return full object, not just string
  };
};

// Static method to get courts by sport and location
courtSchema.statics.getCourtsByFilters = async function(filters = {}) {
  const query = { isActive: true, status: 'active' };
  
  if (filters.sport) {
    query.sport = filters.sport;
  }
  
  if (filters.city) {
    query['location.city'] = new RegExp(filters.city, 'i');
  }
  
  if (filters.state) {
    query['location.state'] = new RegExp(filters.state, 'i');
  }
  
  if (filters.minPrice !== undefined) {
    query.pricePerHour = { $gte: filters.minPrice };
  }
  
  if (filters.maxPrice !== undefined) {
    query.pricePerHour = { ...query.pricePerHour, $lte: filters.maxPrice };
  }
  
  if (filters.minRating !== undefined) {
    query.rating = { $gte: filters.minRating };
  }
  
  const courts = await this.find(query)
    .sort({ rating: -1, pricePerHour: 1 })
    .limit(filters.limit || 20)
    .skip(filters.skip || 0)
    .populate('createdBy', 'firstName lastName email')
    .populate('lastModifiedBy', 'firstName lastName email');
  
  return courts;
};

// Static method to get court statistics
courtSchema.statics.getStatistics = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalCourts: { $sum: 1 },
        activeCourts: {
          $sum: { $cond: [{ $and: [{ $eq: ['$isActive', true] }, { $eq: ['$status', 'active'] }] }, 1, 0] }
        },
        averageRating: { $avg: '$rating' },
        averagePrice: { $avg: '$pricePerHour' }
      }
    }
  ]);
  
  const sportStats = await this.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$sport',
        count: { $sum: 1 },
        averagePrice: { $avg: '$pricePerHour' }
      }
    },
    { $sort: { count: -1 } }
  ]);
  
  return {
    overview: stats[0] || { totalCourts: 0, activeCourts: 0, averageRating: 0, averagePrice: 0 },
    bySport: sportStats
  };
};

module.exports = mongoose.model('Court', courtSchema);

const mongoose = require('mongoose');
const Court = require('../models/Court');
const User = require('../models/User');
require('dotenv').config();

const sampleCourts = [
  {
    name: "Elite Cricket Ground",
    sport: "cricket",
    location: {
      address: "123 Sports Complex, Sector 15",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      coordinates: {
        latitude: 19.0760,
        longitude: 72.8777
      }
    },
    capacity: 22,
    pricePerHour: 800,
    rating: 4.5,
    facilities: ["Parking", "Changing Room", "Water", "Lighting", "Security"],
    images: [{
      url: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&h=600&fit=crop",
      alt: "Cricket Ground",
      isPrimary: true
    }],
    description: "Premium cricket ground with professional facilities and excellent lighting for day and night matches.",
    operatingHours: {
      open: "06:00",
      close: "22:00"
    },
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true
    },
    status: "active",
    isActive: true
  },
  {
    name: "Royal Tennis Court",
    sport: "tennis",
    location: {
      address: "456 Tennis Club, Bandra West",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400050",
      coordinates: {
        latitude: 19.0544,
        longitude: 72.8406
      }
    },
    capacity: 4,
    pricePerHour: 1200,
    rating: 4.8,
    facilities: ["Parking", "Changing Room", "Water", "Lighting", "WiFi", "Cafeteria"],
    images: [{
      url: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop",
      alt: "Tennis Court",
      isPrimary: true
    }],
    description: "Luxury tennis court with synthetic grass surface and professional lighting system.",
    operatingHours: {
      open: "05:00",
      close: "23:00"
    },
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true
    },
    status: "active",
    isActive: true
  },
  {
    name: "Basketball Arena",
    sport: "basketball",
    location: {
      address: "789 Sports Center, Andheri East",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400069",
      coordinates: {
        latitude: 19.1136,
        longitude: 72.8697
      }
    },
    capacity: 10,
    pricePerHour: 600,
    rating: 4.3,
    facilities: ["Parking", "Changing Room", "Water", "Lighting", "Gym"],
    images: [{
      url: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=600&fit=crop",
      alt: "Basketball Court",
      isPrimary: true
    }],
    description: "Indoor basketball court with professional flooring and excellent ventilation.",
    operatingHours: {
      open: "06:00",
      close: "22:00"
    },
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true
    },
    status: "active",
    isActive: true
  },
  {
    name: "Badminton Center",
    sport: "badminton",
    location: {
      address: "321 Recreation Club, Powai",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400076",
      coordinates: {
        latitude: 19.1197,
        longitude: 72.9064
      }
    },
    capacity: 6,
    pricePerHour: 400,
    rating: 4.6,
    facilities: ["Parking", "Changing Room", "Water", "Lighting", "Air Conditioning"],
    images: [{
      url: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop",
      alt: "Badminton Court",
      isPrimary: true
    }],
    description: "Air-conditioned badminton court with professional wooden flooring and excellent lighting.",
    operatingHours: {
      open: "06:00",
      close: "22:00"
    },
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true
    },
    status: "active",
    isActive: true
  },
  {
    name: "Football Field",
    sport: "football",
    location: {
      address: "654 Sports Ground, Goregaon West",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400062",
      coordinates: {
        latitude: 19.1592,
        longitude: 72.8546
      }
    },
    capacity: 22,
    pricePerHour: 1000,
    rating: 4.4,
    facilities: ["Parking", "Changing Room", "Water", "Lighting", "Security", "Cafeteria"],
    images: [{
      url: "https://images.unsplash.com/photo-1431326005620-acc6c0c5c4c1?w=800&h=600&fit=crop",
      alt: "Football Field",
      isPrimary: true
    }],
    description: "Full-size football field with natural grass and professional lighting for evening matches.",
    operatingHours: {
      open: "05:00",
      close: "22:00"
    },
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true
    },
    status: "active",
    isActive: true
  },
  {
    name: "Volleyball Court",
    sport: "volleyball",
    location: {
      address: "987 Beach Sports, Juhu",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400049",
      coordinates: {
        latitude: 19.1000,
        longitude: 72.8260
      }
    },
    capacity: 12,
    pricePerHour: 500,
    rating: 4.2,
    facilities: ["Parking", "Changing Room", "Water", "Lighting"],
    images: [{
      url: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=600&fit=crop",
      alt: "Volleyball Court",
      isPrimary: true
    }],
    description: "Beach volleyball court with sand surface and professional net setup.",
    operatingHours: {
      open: "06:00",
      close: "20:00"
    },
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true
    },
    status: "active",
    isActive: true
  },
  {
    name: "Hockey Turf",
    sport: "hockey",
    location: {
      address: "147 Sports Complex, Thane",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400601",
      coordinates: {
        latitude: 19.2183,
        longitude: 72.9781
      }
    },
    capacity: 22,
    pricePerHour: 700,
    rating: 4.7,
    facilities: ["Parking", "Changing Room", "Water", "Lighting", "Security", "Gym"],
    images: [{
      url: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&h=600&fit=crop",
      alt: "Hockey Turf",
      isPrimary: true
    }],
    description: "Professional hockey turf with synthetic grass and international standard facilities.",
    operatingHours: {
      open: "05:00",
      close: "22:00"
    },
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true
    },
    status: "active",
    isActive: true
  },
  {
    name: "Table Tennis Hall",
    sport: "table-tennis",
    location: {
      address: "258 Recreation Center, Malad West",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400064",
      coordinates: {
        latitude: 19.1868,
        longitude: 72.8490
      }
    },
    capacity: 4,
    pricePerHour: 300,
    rating: 4.1,
    facilities: ["Parking", "Changing Room", "Water", "Lighting", "Air Conditioning"],
    images: [{
      url: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop",
      alt: "Table Tennis",
      isPrimary: true
    }],
    description: "Air-conditioned table tennis hall with professional tables and excellent lighting.",
    operatingHours: {
      open: "06:00",
      close: "22:00"
    },
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true
    },
    status: "active",
    isActive: true
  },
  {
    name: "Squash Court",
    sport: "squash",
    location: {
      address: "369 Fitness Club, Worli",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400018",
      coordinates: {
        latitude: 19.0176,
        longitude: 72.8562
      }
    },
    capacity: 4,
    pricePerHour: 800,
    rating: 4.9,
    facilities: ["Parking", "Changing Room", "Water", "Lighting", "Air Conditioning", "Gym"],
    images: [{
      url: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=600&fit=crop",
      alt: "Squash Court",
      isPrimary: true
    }],
    description: "Premium squash court with glass walls and professional lighting system.",
    operatingHours: {
      open: "05:00",
      close: "23:00"
    },
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true
    },
    status: "active",
    isActive: true
  }
];

async function seedCourts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bookmycourt', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('🚀 Connected to MongoDB');

    // Find an admin user to assign as creator
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.log('❌ No admin user found. Please create an admin user first.');
      process.exit(1);
    }

    // Clear existing courts
    await Court.deleteMany({});
    console.log('🗑️ Cleared existing courts');

    // Add createdBy field to all courts
    const courtsWithCreator = sampleCourts.map(court => ({
      ...court,
      createdBy: adminUser._id
    }));

    // Insert sample courts
    const createdCourts = await Court.insertMany(courtsWithCreator);
    console.log(`✅ Successfully created ${createdCourts.length} sample courts`);

    // Display created courts
    createdCourts.forEach(court => {
      console.log(`🏟️ ${court.name} - ${court.sport} - ₹${court.pricePerHour}/hour`);
    });

    console.log('🎉 Court seeding completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding courts:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedCourts();

const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bookmycourt', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'lmcu881@gmail.com' });
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email: lmcu881@gmail.com');
      console.log('Password: admin123');
      process.exit(0);
    }

    // Create admin user with plain password (pre-save middleware will hash it)
    const adminUser = new User({
      username: 'lmcu881',
      firstName: 'Admin',
      lastName: 'User',
      email: 'lmcu881@gmail.com',
      password: 'admin123', // Plain password - pre-save middleware will hash it
      phone: '+1234567890',
      role: 'admin',
      permissions: ['manage_courts', 'manage_bookings', 'manage_users', 'view_analytics', 'manage_payments'],
      isEmailVerified: true,
      isVerified: true, // Ensure admin is verified
      isActive: true,
      preferences: {
        favoriteSports: ['cricket', 'football', 'basketball', 'tennis', 'badminton', 'volleyball', 'hockey', 'table-tennis', 'squash'],
        selectedSport: 'cricket', // Set a default sport
        notifications: {
          email: true,
          sms: false,
          push: true
        }
      }
    });

    await adminUser.save();

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: lmcu881@gmail.com');
    console.log('🔑 Password: admin123');
    console.log('👑 Role: Admin');
    console.log('🔗 Admin Panel: http://localhost:3000/admin');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

createAdminUser();

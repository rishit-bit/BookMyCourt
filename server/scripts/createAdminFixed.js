const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const createAdminFixed = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bookmycourt', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Remove existing admin user
    await User.deleteOne({ email: 'lmcu881@gmail.com' });
    console.log('✅ Removed existing admin user');

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
      isVerified: true,
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

    // Test the password
    const testUser = await User.findOne({ email: 'lmcu881@gmail.com' }).select('+password');
    const isPasswordValid = await testUser.comparePassword('admin123');
    
    console.log('🔑 Password test:', isPasswordValid ? '✅ Valid' : '❌ Invalid');
    
    if (isPasswordValid) {
      console.log('✅ Admin user ready for login!');
      console.log('📧 Email: lmcu881@gmail.com');
      console.log('🔑 Password: admin123');
      console.log('👑 Role: Admin');
      console.log('🔗 Admin Panel: http://localhost:3000/admin');
    } else {
      console.log('❌ Password test failed');
    }

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

createAdminFixed();

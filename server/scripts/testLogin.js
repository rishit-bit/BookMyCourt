const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const testLogin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bookmycourt', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Test login process
    const email = 'lmcu881@gmail.com';
    const password = 'admin123';

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      console.log('❌ User not found');
      process.exit(1);
    }

    console.log('✅ User found:', user.email);

    // Check if user is active
    if (!user.isActive) {
      console.log('❌ User is not active');
      process.exit(1);
    }

    // Check if email is verified (skip for admin users)
    if (!user.isVerified && user.role !== 'admin') {
      console.log('❌ Email not verified');
      process.exit(1);
    }

    console.log('✅ User is active and verified');

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      console.log('❌ Password is invalid');
      process.exit(1);
    }

    console.log('✅ Password is valid');
    console.log('✅ Login test successful!');
    console.log('📧 Email:', user.email);
    console.log('👤 Username:', user.username);
    console.log('👑 Role:', user.role);
    console.log('✅ Verified:', user.isVerified);
    console.log('✅ Active:', user.isActive);

  } catch (error) {
    console.error('❌ Error testing login:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

testLogin();

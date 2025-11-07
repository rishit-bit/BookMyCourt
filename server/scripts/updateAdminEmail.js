const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const updateAdminEmail = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bookmycourt', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Find the existing admin user
    const adminUser = await User.findOne({ email: 'admin@bookmycourt.com' });
    if (!adminUser) {
      console.log('❌ Admin user not found with email: admin@bookmycourt.com');
      console.log('Creating new admin user with email: lmcu881@gmail.com');
      
      // Create new admin user
      const bcrypt = require('bcryptjs');
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash('admin123', saltRounds);

      const newAdminUser = new User({
        username: 'lmcu881',
        firstName: 'Admin',
        lastName: 'User',
        email: 'lmcu881@gmail.com',
        password: hashedPassword,
        phone: '+1234567890',
        role: 'admin',
        permissions: ['manage_courts', 'manage_bookings', 'manage_users', 'view_analytics', 'manage_payments'],
        isEmailVerified: true,
        isActive: true,
        preferences: {
          selectedSports: ['cricket', 'football', 'basketball'],
          favoriteSports: ['cricket', 'football', 'basketball']
        }
      });

      await newAdminUser.save();
      console.log('✅ New admin user created successfully!');
    } else {
      // Update existing admin user
      adminUser.email = 'lmcu881@gmail.com';
      adminUser.username = 'lmcu881';
      adminUser.isVerified = true; // Ensure admin is verified
      await adminUser.save();
      console.log('✅ Admin user email updated successfully!');
    }

    console.log('📧 Email: lmcu881@gmail.com');
    console.log('🔑 Password: admin123');
    console.log('👑 Role: Admin');
    console.log('🔗 Admin Panel: http://localhost:3000/admin');

  } catch (error) {
    console.error('❌ Error updating admin user:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

updateAdminEmail();

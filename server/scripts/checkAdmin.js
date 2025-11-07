const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const checkAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bookmycourt', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Find the admin user
    const adminUser = await User.findOne({ email: 'lmcu881@gmail.com' }).select('+password');
    if (!adminUser) {
      console.log('❌ Admin user not found with email: lmcu881@gmail.com');
      
      // Check if there are any users with admin role
      const adminUsers = await User.find({ role: 'admin' });
      console.log('Admin users found:', adminUsers.length);
      adminUsers.forEach(user => {
        console.log(`- ${user.email} (${user.username}) - Verified: ${user.isVerified}`);
      });
      
      process.exit(1);
    }

    console.log('✅ Admin user found:');
    console.log('📧 Email:', adminUser.email);
    console.log('👤 Username:', adminUser.username);
    console.log('👑 Role:', adminUser.role);
    console.log('✅ Verified:', adminUser.isVerified);
    console.log('✅ Active:', adminUser.isActive);
    console.log('🔑 Has Password:', !!adminUser.password);

    // Test password
    const testPassword = 'admin123';
    const isPasswordValid = await bcrypt.compare(testPassword, adminUser.password);
    console.log('🔑 Password Valid:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('❌ Password is incorrect. Resetting password...');
      
      // Reset password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash('admin123', saltRounds);
      adminUser.password = hashedPassword;
      adminUser.isVerified = true;
      adminUser.isActive = true;
      adminUser.role = 'admin';
      adminUser.permissions = ['manage_courts', 'manage_bookings', 'manage_users', 'view_analytics', 'manage_payments'];
      
      await adminUser.save();
      console.log('✅ Password reset successfully!');
    }

  } catch (error) {
    console.error('❌ Error checking admin user:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

checkAdmin();

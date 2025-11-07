const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const verifyAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bookmycourt', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Find the admin user
    const adminUser = await User.findOne({ email: 'lmcu881@gmail.com' });
    if (!adminUser) {
      console.log('❌ Admin user not found with email: lmcu881@gmail.com');
      process.exit(1);
    }

    // Ensure admin is verified and active
    adminUser.isVerified = true;
    adminUser.isActive = true;
    adminUser.role = 'admin';
    adminUser.permissions = ['manage_courts', 'manage_bookings', 'manage_users', 'view_analytics', 'manage_payments'];
    
    await adminUser.save();

    console.log('✅ Admin user verified successfully!');
    console.log('📧 Email:', adminUser.email);
    console.log('👤 Username:', adminUser.username);
    console.log('👑 Role:', adminUser.role);
    console.log('✅ Verified:', adminUser.isVerified);
    console.log('✅ Active:', adminUser.isActive);

  } catch (error) {
    console.error('❌ Error verifying admin user:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

verifyAdmin();

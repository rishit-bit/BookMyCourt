const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const promoteToAdmin = async (email) => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bookmycourt', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Find user by email
    const user = await User.findOne({ email: email });
    if (!user) {
      console.log('❌ User not found with email:', email);
      process.exit(1);
    }

    // Update user to admin
    user.role = 'admin';
    user.permissions = ['manage_courts', 'manage_bookings', 'manage_users', 'view_analytics', 'manage_payments'];
    user.isEmailVerified = true;
    user.isVerified = true; // Ensure admin is verified
    user.isActive = true;
    
    // Ensure username exists (in case it's missing)
    if (!user.username) {
      user.username = user.email.split('@')[0]; // Use email prefix as username
    }

    await user.save();

    console.log('✅ User promoted to Super Admin successfully!');
    console.log('👤 User:', user.firstName, user.lastName);
    console.log('📧 Email:', user.email);
    console.log('👑 Role: Super Admin');
    console.log('🔗 Admin Panel: http://localhost:3000/admin');

  } catch (error) {
    console.error('❌ Error promoting user to admin:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

// Get email from command line argument
const email = process.argv[2];
if (!email) {
  console.log('Usage: node scripts/promoteToAdmin.js <email>');
  console.log('Example: node scripts/promoteToAdmin.js your-email@example.com');
  process.exit(1);
}

promoteToAdmin(email);

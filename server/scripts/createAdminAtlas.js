const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createAdminUser = async () => {
  try {
    // Use MongoDB Atlas connection string
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://rishit4908_db_user:tuoLV88UcioAsqVp@cluster0.vm8cr11.mongodb.net/bookmycourt?retryWrites=true&w=majority';
    
    console.log('Connecting to MongoDB Atlas...');
    
    // Connect to MongoDB
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB Atlas');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'lmcu881@gmail.com' });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log('📧 Email: lmcu881@gmail.com');
      console.log('👑 Role:', existingAdmin.role);
      console.log('✅ Status:', existingAdmin.isActive ? 'Active' : 'Inactive');
      
      // Update to admin if not already
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        existingAdmin.permissions = ['manage_courts', 'manage_bookings', 'manage_users', 'view_analytics', 'manage_payments'];
        existingAdmin.isVerified = true;
        existingAdmin.isEmailVerified = true;
        existingAdmin.isActive = true;
        await existingAdmin.save();
        console.log('✅ User promoted to admin!');
      }
      
      await mongoose.disconnect();
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
      isVerified: true,
      isActive: true,
      preferences: {
        favoriteSports: ['cricket', 'football', 'basketball', 'tennis', 'badminton', 'volleyball', 'hockey', 'table-tennis', 'squash'],
        selectedSport: 'cricket',
        notifications: {
          email: true,
          sms: false,
          push: true
        }
      }
    });

    await adminUser.save();

    console.log('\n✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email: lmcu881@gmail.com');
    console.log('🔑 Password: admin123');
    console.log('👑 Role: Admin');
    console.log('✅ Status: Active & Verified');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔗 Admin Panel: https://bookmycourt-green.vercel.app/admin');
    console.log('🔗 Local Admin: http://localhost:3000/admin');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    if (error.name === 'MongoServerError' && error.code === 11000) {
      console.error('⚠️  User with this email already exists');
    }
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

createAdminUser();


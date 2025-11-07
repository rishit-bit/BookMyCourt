const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const updateAdminSports = async () => {
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

    // Update admin user with all sports selected
    adminUser.preferences = {
      favoriteSports: ['cricket', 'football', 'basketball', 'tennis', 'badminton', 'volleyball', 'hockey', 'table-tennis', 'squash'],
      selectedSport: 'cricket', // Set a default sport
      notifications: {
        email: true,
        sms: false,
        push: true
      }
    };
    
    await adminUser.save();

    console.log('✅ Admin user sports preferences updated successfully!');
    console.log('📧 Email:', adminUser.email);
    console.log('👤 Username:', adminUser.username);
    console.log('👑 Role:', adminUser.role);
    console.log('🏆 Favorite Sports:', adminUser.preferences?.favoriteSports?.length || 0, 'sports');
    console.log('🎯 Selected Sport:', adminUser.preferences?.selectedSport || 'None');
    console.log('✅ Admin will skip sport selection and go directly to admin panel');

  } catch (error) {
    console.error('❌ Error updating admin sports:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

updateAdminSports();

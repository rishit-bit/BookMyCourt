const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const testAdminFlow = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bookmycourt', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Check admin user
    const adminUser = await User.findOne({ email: 'lmcu881@gmail.com' });
    if (!adminUser) {
      console.log('❌ Admin user not found');
      process.exit(1);
    }

    console.log('✅ Admin user found:');
    console.log('📧 Email:', adminUser.email);
    console.log('👤 Username:', adminUser.username);
    console.log('👑 Role:', adminUser.role);
    console.log('✅ Verified:', adminUser.isVerified);
    console.log('✅ Active:', adminUser.isActive);
    console.log('🏆 Favorite Sports:', adminUser.preferences?.favoriteSports?.length || 0, 'sports');
    console.log('🎯 Selected Sport:', adminUser.preferences?.selectedSport || 'None');
    
    console.log('\n🚀 Admin Login Flow Test:');
    console.log('1. Login with: lmcu881@gmail.com / admin123');
    console.log('2. Should redirect to: /admin (not /select-sport)');
    console.log('3. Admin panel should load immediately');
    console.log('4. No sport selection required!');

    // Test the logic that determines redirect
    const shouldGoToAdmin = adminUser.role === 'admin';
    const hasSelectedSport = adminUser.preferences?.selectedSport;
    
    console.log('\n🔍 Redirect Logic:');
    console.log('Is Admin:', shouldGoToAdmin);
    console.log('Has Selected Sport:', hasSelectedSport);
    console.log('Expected Redirect:', shouldGoToAdmin ? '/admin' : (hasSelectedSport ? '/dashboard' : '/select-sport'));

  } catch (error) {
    console.error('❌ Error testing admin flow:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

testAdminFlow();

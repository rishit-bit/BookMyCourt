const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const testAdminRedirect = async () => {
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
    
    console.log('\n🚀 Admin redirect test:');
    console.log('1. Login with: lmcu881@gmail.com / admin123');
    console.log('2. Should redirect to: /admin (not /dashboard)');
    console.log('3. Admin panel should be accessible immediately');

  } catch (error) {
    console.error('❌ Error testing admin redirect:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

testAdminRedirect();

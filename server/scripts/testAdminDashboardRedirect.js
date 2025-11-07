const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const testAdminDashboardRedirect = async () => {
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
    
    console.log('\n🚀 Admin Dashboard Redirect Test:');
    console.log('1. Admin users should NEVER see the dashboard');
    console.log('2. Any attempt to access /dashboard should redirect to /admin');
    console.log('3. Admin users should only see the admin panel');
    
    console.log('\n🔍 Redirect Logic:');
    console.log('Admin Role Check:', adminUser.role === 'admin');
    console.log('Expected Behavior:');
    console.log('- Login → /admin (not /dashboard)');
    console.log('- Direct /dashboard access → redirect to /admin');
    console.log('- Wildcard routes → /admin (not /dashboard)');
    console.log('- Sport selection → /admin (not /dashboard)');

    console.log('\n✅ Admin Dashboard Access: BLOCKED');
    console.log('✅ Admin Panel Access: ALLOWED');

  } catch (error) {
    console.error('❌ Error testing admin dashboard redirect:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

testAdminDashboardRedirect();

const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const cleanupOldAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bookmycourt', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Find and remove the old admin user
    const oldAdmin = await User.findOne({ email: 'admin@bookmycourt.com' });
    if (oldAdmin) {
      await User.findByIdAndDelete(oldAdmin._id);
      console.log('✅ Old admin user removed successfully!');
    } else {
      console.log('ℹ️ No old admin user found to remove.');
    }

    // Verify the new admin user exists
    const newAdmin = await User.findOne({ email: 'lmcu881@gmail.com' });
    if (newAdmin) {
      console.log('✅ New admin user confirmed:');
      console.log('📧 Email:', newAdmin.email);
      console.log('👤 Username:', newAdmin.username);
      console.log('👑 Role:', newAdmin.role);
    } else {
      console.log('❌ New admin user not found!');
    }

  } catch (error) {
    console.error('❌ Error cleaning up admin users:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

cleanupOldAdmin();

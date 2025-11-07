const mongoose = require('mongoose');
const Court = require('../models/Court');
const axios = require('axios');

const testCourtDeletion = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bookmycourt', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('🚀 Connected to MongoDB');

    console.log('\n🧪 Testing Court Deletion...\n');

    // Test 1: Check all courts before deletion
    console.log('1. Checking all courts before deletion...');
    const allCourtsBefore = await Court.find({});
    console.log(`   Total courts in database: ${allCourtsBefore.length}`);
    allCourtsBefore.forEach(court => {
      console.log(`   - ${court.name} (${court.sport}) - Active: ${court.isActive}, Status: ${court.status}`);
    });

    // Test 2: Check active courts only
    console.log('\n2. Checking active courts only...');
    const activeCourtsBefore = await Court.find({ isActive: true, status: 'active' });
    console.log(`   Active courts: ${activeCourtsBefore.length}`);

    // Test 3: Test public API - all courts
    console.log('\n3. Testing public API - all courts...');
    try {
      const publicResponse = await axios.get('http://localhost:5000/api/courts');
      console.log(`   Public API returned: ${publicResponse.data.data?.courts?.length || 0} courts`);
    } catch (error) {
      console.log('   ❌ Public API error:', error.message);
    }

    // Test 4: Test public API - football courts
    console.log('\n4. Testing public API - football courts...');
    try {
      const footballResponse = await axios.get('http://localhost:5000/api/courts/sport/football');
      console.log(`   Football courts: ${footballResponse.data.data?.courts?.length || 0}`);
    } catch (error) {
      console.log('   ❌ Football API error:', error.message);
    }

    // Test 5: Simulate court deletion (set isActive to false)
    console.log('\n5. Simulating court deletion...');
    const courtToDelete = await Court.findOne({ isActive: true });
    if (courtToDelete) {
      console.log(`   Deleting court: ${courtToDelete.name}`);
      courtToDelete.isActive = false;
      await courtToDelete.save();
      console.log('   ✅ Court marked as inactive');
    } else {
      console.log('   ⚠️ No active courts found to delete');
    }

    // Test 6: Check courts after deletion
    console.log('\n6. Checking courts after deletion...');
    const activeCourtsAfter = await Court.find({ isActive: true, status: 'active' });
    console.log(`   Active courts after deletion: ${activeCourtsAfter.length}`);

    // Test 7: Test public API after deletion
    console.log('\n7. Testing public API after deletion...');
    try {
      const publicResponseAfter = await axios.get('http://localhost:5000/api/courts');
      console.log(`   Public API returned: ${publicResponseAfter.data.data?.courts?.length || 0} courts`);
    } catch (error) {
      console.log('   ❌ Public API error:', error.message);
    }

    // Test 8: Test sport-specific API after deletion
    console.log('\n8. Testing sport-specific API after deletion...');
    try {
      const sportResponseAfter = await axios.get('http://localhost:5000/api/courts/sport/football');
      console.log(`   Football courts after deletion: ${sportResponseAfter.data.data?.courts?.length || 0}`);
    } catch (error) {
      console.log('   ❌ Sport API error:', error.message);
    }

    console.log('\n🎉 Court deletion test completed!');
    console.log('\n📊 Summary:');
    console.log(`- Total courts in DB: ${allCourtsBefore.length}`);
    console.log(`- Active courts before: ${activeCourtsBefore.length}`);
    console.log(`- Active courts after: ${activeCourtsAfter.length}`);

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
};

testCourtDeletion();

const axios = require('axios');

const testCourtsAPI = async () => {
  try {
    console.log('🧪 Testing Courts API...\n');

    // Test 1: Get all courts
    console.log('1. Testing GET /api/courts...');
    const allCourtsResponse = await axios.get('http://localhost:5000/api/courts');
    console.log('✅ All courts response:', {
      success: allCourtsResponse.data.success,
      totalCourts: allCourtsResponse.data.data?.courts?.length || 0,
      pagination: allCourtsResponse.data.data?.pagination
    });

    // Test 2: Get courts by sport (cricket)
    console.log('\n2. Testing GET /api/courts/sport/cricket...');
    const cricketCourtsResponse = await axios.get('http://localhost:5000/api/courts/sport/cricket');
    console.log('✅ Cricket courts response:', {
      success: cricketCourtsResponse.data.success,
      sport: cricketCourtsResponse.data.data?.sport,
      courtsCount: cricketCourtsResponse.data.data?.courts?.length || 0
    });

    // Test 3: Get courts by sport (football)
    console.log('\n3. Testing GET /api/courts/sport/football...');
    const footballCourtsResponse = await axios.get('http://localhost:5000/api/courts/sport/football');
    console.log('✅ Football courts response:', {
      success: footballCourtsResponse.data.success,
      sport: footballCourtsResponse.data.data?.sport,
      courtsCount: footballCourtsResponse.data.data?.courts?.length || 0
    });

    console.log('\n🎉 Courts API test completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Total courts available: ${allCourtsResponse.data.data?.courts?.length || 0}`);
    console.log(`- Cricket courts: ${cricketCourtsResponse.data.data?.courts?.length || 0}`);
    console.log(`- Football courts: ${footballCourtsResponse.data.data?.courts?.length || 0}`);

  } catch (error) {
    console.error('❌ Courts API test failed:', error.response?.data || error.message);
  }
};

testCourtsAPI();

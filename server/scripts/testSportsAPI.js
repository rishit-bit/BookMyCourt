const axios = require('axios');

const testSportsAPI = async () => {
  try {
    console.log('🧪 Testing Sports API...');
    
    const response = await axios.get('http://localhost:5000/api/sports');
    
    if (response.data.success) {
      console.log('✅ Sports API is working!');
      console.log('📊 Sports data:', response.data.data.sports);
      console.log(`📈 Total sports: ${response.data.data.sports.length}`);
    } else {
      console.log('❌ Sports API returned error:', response.data.message);
    }
  } catch (error) {
    console.error('❌ Error testing Sports API:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Make sure the server is running on port 5000');
    }
  }
};

testSportsAPI();

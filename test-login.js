const axios = require('axios');

async function testLogin() {
  try {
    console.log('🔍 로그인 테스트 중...');
    
    const response = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'newuser@example.com',
      password: 'password123'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ 로그인 성공!');
    console.log('응답:', response.data);
    
  } catch (error) {
    console.error('❌ 로그인 실패:', error.response?.data || error.message);
  }
}

testLogin(); 
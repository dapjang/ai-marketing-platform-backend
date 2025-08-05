const axios = require('axios');

async function testProfile() {
  try {
    console.log('🔍 프로필 API 테스트 중...');
    
    // 먼저 로그인
    const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'newuser@example.com',
      password: 'password123'
    });

    const token = loginResponse.data.token;
    console.log('✅ 로그인 성공, 토큰:', token.substring(0, 50) + '...');

    // 프로필 조회
    const profileResponse = await axios.get('http://localhost:3000/api/auth/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('✅ 프로필 조회 성공!');
    console.log('프로필:', profileResponse.data);
    
  } catch (error) {
    console.error('❌ 프로필 조회 실패:', error.response?.data || error.message);
  }
}

testProfile(); 
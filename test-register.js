const axios = require('axios');

async function testRegister() {
  try {
    console.log('🔍 회원가입 테스트 중...');
    
    const response = await axios.post('http://localhost:3000/api/auth/register', {
      email: 'newuser@example.com',
      password: 'password123',
      name: '새로운 사용자'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ 회원가입 성공!');
    console.log('응답:', response.data);
    
  } catch (error) {
    console.error('❌ 회원가입 실패:', error.response?.data || error.message);
  }
}

testRegister(); 
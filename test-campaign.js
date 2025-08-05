const axios = require('axios');

async function testCampaign() {
  try {
    console.log('🔍 캠페인 API 테스트 중...');
    
    // 먼저 로그인
    const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'newuser@example.com',
      password: 'password123'
    });

    const token = loginResponse.data.token;
    console.log('✅ 로그인 성공, 토큰:', token.substring(0, 50) + '...');

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    // 1. 캠페인 생성
    console.log('\n📝 캠페인 생성 테스트...');
    const createResponse = await axios.post('http://localhost:3000/api/campaigns', {
      title: '테스트 캠페인',
      description: 'AI 마케팅 플랫폼 테스트 캠페인입니다.',
      budget: 1000000,
      targetAudience: {
        age: '25-35',
        interests: ['기술', '마케팅'],
        location: '서울'
      },
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      campaignType: 'social_media'
    }, { headers });

    console.log('✅ 캠페인 생성 성공:', createResponse.data.message);
    const campaignId = createResponse.data.campaign.id;

    // 2. 캠페인 목록 조회
    console.log('\n📋 캠페인 목록 조회 테스트...');
    const listResponse = await axios.get('http://localhost:3000/api/campaigns', { headers });
    console.log('✅ 캠페인 목록 조회 성공:', listResponse.data.campaigns.length, '개');

    // 3. 특정 캠페인 조회
    console.log('\n🔍 특정 캠페인 조회 테스트...');
    const getResponse = await axios.get(`http://localhost:3000/api/campaigns/${campaignId}`, { headers });
    console.log('✅ 캠페인 조회 성공:', getResponse.data.campaign.title);

    // 4. 캠페인 상태 업데이트
    console.log('\n🔄 캠페인 상태 업데이트 테스트...');
    const statusResponse = await axios.patch(`http://localhost:3000/api/campaigns/${campaignId}/status`, {
      status: 'active'
    }, { headers });
    console.log('✅ 캠페인 상태 업데이트 성공:', statusResponse.data.message);

    // 5. AI 콘텐츠 업데이트
    console.log('\n🤖 AI 콘텐츠 업데이트 테스트...');
    const aiResponse = await axios.patch(`http://localhost:3000/api/campaigns/${campaignId}/ai-content`, {
      aiGeneratedContent: {
        title: 'AI 생성 제목',
        description: 'AI가 생성한 캠페인 설명',
        hashtags: ['#AI', '#마케팅', '#테스트']
      }
    }, { headers });
    console.log('✅ AI 콘텐츠 업데이트 성공:', aiResponse.data.message);

    console.log('\n🎉 모든 캠페인 API 테스트 완료!');
    
  } catch (error) {
    console.error('❌ 캠페인 API 테스트 실패:', error.response?.data || error.message);
  }
}

testCampaign(); 
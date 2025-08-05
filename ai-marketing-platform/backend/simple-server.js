const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// 미들웨어
app.use(cors());
app.use(express.json());

// 헬스 체크
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'AI 마케팅 플랫폼 서버가 정상적으로 실행 중입니다.',
    timestamp: new Date().toISOString()
  });
});

// 메인 페이지
app.get('/', (req, res) => {
  res.json({
    message: 'AI 마케팅 플랫폼 서버가 실행 중입니다!',
    timestamp: new Date().toISOString()
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`📊 헬스 체크: http://localhost:${PORT}/health`);
  console.log(`🏠 메인 페이지: http://localhost:${PORT}/`);
}); 
const http = require('http');

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.url === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({
      status: 'OK',
      message: 'AI 마케팅 플랫폼 서버가 정상적으로 실행 중입니다.',
      timestamp: new Date().toISOString()
    }));
  } else {
    res.writeHead(200);
    res.end(JSON.stringify({
      message: 'AI 마케팅 플랫폼 서버가 실행 중입니다!',
      timestamp: new Date().toISOString()
    }));
  }
});

const PORT = 3001;

server.listen(PORT, () => {
  console.log(`🚀 매우 간단한 테스트 서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`📊 헬스 체크: http://localhost:${PORT}/health`);
  console.log(`🏠 메인 페이지: http://localhost:${PORT}/`);
}); 
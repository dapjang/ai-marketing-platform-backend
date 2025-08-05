import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import authRoutes from './routes/auth';
import campaignRoutes from './routes/campaigns';

dotenv.config();

const app = express();
const PORT = process.env['PORT'] || 5000;

// 미들웨어
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 라우트
app.use('/api/auth', authRoutes);
app.use('/api/campaigns', campaignRoutes);

// 헬스 체크
app.get('/health', (_req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'AI 마케팅 플랫폼 서버가 정상적으로 실행 중입니다.',
    timestamp: new Date().toISOString()
  });
});

// 404 핸들러
app.use('*', (_req, res) => {
  res.status(404).json({ message: '요청한 엔드포인트를 찾을 수 없습니다.' });
});

// 에러 핸들러
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('서버 오류:', err);
  res.status(500).json({ message: '서버 오류가 발생했습니다.' });
});

// 서버 시작
const startServer = async () => {
  try {
    // MongoDB 연결 시도 (실패해도 서버는 시작)
    await connectDatabase(); // Error handling is now inside connectDatabase

    // 서버 시작 (MongoDB 연결 실패와 관계없이)
    const server = app.listen(PORT, () => {
      console.log(`🚀 서버가 포트 ${PORT}에서 실행 중입니다.`);
      console.log(`📊 헬스 체크: http://localhost:${PORT}/health`);
      console.log(`🔐 인증 API: http://localhost:${PORT}/api/auth`);
      console.log(`📈 캠페인 API: http://localhost:${PORT}/api/campaigns`);
    });

    // 서버 에러 핸들링
    server.on('error', (error: any) => {
      console.error('서버 에러:', error);
      if (error.code === 'EADDRINUSE') {
        console.log(`⚠️ 포트 ${PORT}가 이미 사용 중입니다.`);
        process.exit(1);
      }
    });
  } catch (error) {
    console.error('서버 시작 실패:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM 신호를 받았습니다. 서버를 종료합니다...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT 신호를 받았습니다. 서버를 종료합니다...');
  process.exit(0);
}); 
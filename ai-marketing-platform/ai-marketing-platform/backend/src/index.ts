import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import authRoutes from './routes/auth';
import campaignRoutes from './routes/campaigns';

// 환경 변수 로드
dotenv.config();

const app = express();
const PORT = (process.env as any).PORT || 3000;

// 보안 미들웨어
app.use(helmet());

// CORS 설정
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 100, // IP당 최대 요청 수
  message: { message: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.' }
});
app.use(limiter);

// Body parser 미들웨어
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 기본 라우트
app.get('/', (req, res) => {
  res.json({
    message: 'AI 마케팅 플랫폼 API',
    version: '1.0.0',
    status: 'running'
  });
});

// 헬스 체크
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API 라우트
app.use('/api/auth', authRoutes);
app.use('/api/campaigns', campaignRoutes);

// 404 핸들러
app.use('*', (req, res) => {
  res.status(404).json({ message: '요청한 엔드포인트를 찾을 수 없습니다.' });
});

// 에러 핸들러
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction): void => {
  console.error('서버 오류:', error);
  
  if (error.name === 'ValidationError') {
    res.status(400).json({
      message: '입력 데이터가 유효하지 않습니다.',
      errors: error.errors
    });
    return;
  }
  
  if (error.name === 'CastError') {
    res.status(400).json({
      message: '잘못된 데이터 형식입니다.'
    });
    return;
  }
  
  res.status(500).json({
    message: '서버 내부 오류가 발생했습니다.'
  });
  return;
});

// 서버 시작 함수
const startServer = async () => {
  try {
    // 데이터베이스 연결
    await connectDatabase();
    
    // 서버 시작
    app.listen(PORT, () => {
      console.log(`🚀 서버가 포트 ${PORT}에서 실행 중입니다.`);
      console.log(`📊 API 문서: http://localhost:${PORT}`);
      console.log(`🔗 프론트엔드: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
    });
  } catch (error) {
    console.error('❌ 서버 시작 실패:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 서버를 종료합니다...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 서버를 종료합니다...');
  process.exit(0);
});

// 서버 시작
startServer(); 
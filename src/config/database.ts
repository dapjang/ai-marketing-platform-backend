import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env['MONGODB_URI'] || 'mongodb://localhost:27017/ai-marketing-platform';

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB 연결 성공');
  } catch (error) {
    console.error('❌ MongoDB 연결 실패:', error);
    // 에러를 다시 던지지 않고 로그만 출력
    console.log('⚠️ MongoDB 없이 서버를 실행합니다.');
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('✅ MongoDB 연결 해제');
  } catch (error) {
    console.error('❌ MongoDB 연결 해제 실패:', error);
  }
}; 
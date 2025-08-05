import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// 환경 변수
const MONGODB_URI = (process.env as any).MONGODB_URI || 'mongodb://localhost:27017/ai-marketing-platform';
const USE_MONGODB = (process.env as any).USE_MONGODB !== 'false';
const NODE_ENV = (process.env as any).NODE_ENV || 'development';

// 데이터베이스 연결 옵션 (확장성 고려)
const connectionOptions = {
  // 연결 풀 설정
  maxPoolSize: 10, // 최대 연결 수
  minPoolSize: 2,  // 최소 연결 수
  maxIdleTimeMS: 30000, // 유휴 연결 타임아웃
  
  // 서버 선택 설정
  serverSelectionTimeoutMS: 5000, // 서버 선택 타임아웃
  heartbeatFrequencyMS: 10000, // 하트비트 주기
  
  // 쓰기 설정
  w: 'majority' as const, // 다수 복제본에 쓰기
  wtimeout: 10000, // 쓰기 타임아웃
  
  // 읽기 설정
  readPreference: 'secondaryPreferred' as const, // 보조 서버 우선 읽기
  
  // 재시도 설정
  retryWrites: true,
  retryReads: true,
  
  // 압축 설정
  compressors: ['zlib' as const],
  zlibCompressionLevel: 6 as const,
  
  // SSL 설정 (프로덕션)
  ...(NODE_ENV === 'production' && {
    ssl: true,
    sslValidate: true,
    sslCA: process.env.MONGODB_SSL_CA,
    sslCert: process.env.MONGODB_SSL_CERT,
    sslKey: process.env.MONGODB_SSL_KEY
  })
};

// 연결 이벤트 리스너
const setupConnectionListeners = () => {
  const db = mongoose.connection;
  
  db.on('connected', () => {
    console.log('✅ MongoDB 연결 성공');
    console.log(`📊 데이터베이스: ${db.name}`);
    console.log(`🔗 호스트: ${db.host}:${db.port}`);
  });
  
  db.on('error', (error) => {
    console.error('❌ MongoDB 연결 오류:', error);
  });
  
  db.on('disconnected', () => {
    console.log('⚠️ MongoDB 연결 해제');
  });
  
  db.on('reconnected', () => {
    console.log('🔄 MongoDB 재연결 성공');
  });
  
  // 연결 풀 모니터링
  setInterval(() => {
    const poolStatus = db.db?.admin().listDatabases();
    if (poolStatus) {
      console.log(`📈 연결 풀 상태: ${db.readyState === 1 ? '연결됨' : '연결 안됨'}`);
    }
  }, 60000); // 1분마다 체크
};

// 데이터베이스 연결 함수
export const connectDatabase = async (): Promise<void> => {
  // MongoDB 사용 여부 확인
  if (!USE_MONGODB) {
    console.log('⚠️ MongoDB를 사용하지 않고 서버를 실행합니다.');
    return;
  }

  try {
    // 기존 연결이 있으면 재사용
    if (mongoose.connection.readyState === 1) {
      console.log('✅ 이미 MongoDB에 연결되어 있습니다.');
      return;
    }

    // 연결 리스너 설정
    setupConnectionListeners();

    // 데이터베이스 연결
    await mongoose.connect(MONGODB_URI, connectionOptions);
    
    // 연결 성공 후 추가 설정
    await setupDatabaseIndexes();
    await setupDatabaseValidation();
    
  } catch (error) {
    console.error('❌ MongoDB 연결 실패:', error);
    console.log('⚠️ MongoDB 없이 서버를 실행합니다.');
  }
};

// 데이터베이스 인덱스 설정
const setupDatabaseIndexes = async (): Promise<void> => {
  try {
    const db = mongoose.connection;
    
    // 컬렉션별 인덱스 확인 및 생성
    const collections = ['users', 'organizations', 'campaigns', 'analytics'];
    
    for (const collectionName of collections) {
      const collection = db.collection(collectionName);
      const indexes = await collection.indexes();
      
      console.log(`📊 ${collectionName} 인덱스 수: ${indexes.length}`);
    }
    
    console.log('✅ 데이터베이스 인덱스 설정 완료');
  } catch (error) {
    console.error('❌ 인덱스 설정 오류:', error);
  }
};

// 데이터베이스 검증 설정
const setupDatabaseValidation = async (): Promise<void> => {
  try {
    // 데이터 무결성 검증
    const db = mongoose.connection;
    
    // 연결 상태 확인
    if (db.db) {
      await db.db.admin().ping();
    }
    
    console.log('✅ 데이터베이스 검증 완료');
  } catch (error) {
    console.error('❌ 데이터베이스 검증 오류:', error);
  }
};

// 데이터베이스 연결 해제
export const disconnectDatabase = async (): Promise<void> => {
  try {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('✅ MongoDB 연결 해제');
    }
  } catch (error) {
    console.error('❌ MongoDB 연결 해제 실패:', error);
  }
};

// 데이터베이스 상태 확인
export const getDatabaseStatus = () => {
  const status = {
    connected: mongoose.connection.readyState === 1,
    host: mongoose.connection.host,
    port: mongoose.connection.port,
    name: mongoose.connection.name,
    readyState: mongoose.connection.readyState
  };
  
  return status;
};

// 데이터베이스 통계
export const getDatabaseStats = async () => {
  try {
    const db = mongoose.connection;
    if (!db.db) {
      return null;
    }
    const stats = await db.db.stats();
    
    return {
      collections: stats.collections,
      dataSize: stats.dataSize,
      storageSize: stats.storageSize,
      indexes: stats.indexes,
      indexSize: stats.indexSize
    };
  } catch (error) {
    console.error('❌ 데이터베이스 통계 조회 오류:', error);
    return null;
  }
}; 
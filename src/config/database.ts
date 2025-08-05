import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Railway MySQL 연결 설정
const createConnection = () => {
  // Railway의 실제 연결 정보 (예시)
  const host = process.env.DATABASE_HOST || 'containers-us-west-1.railway.app';
  const port = parseInt(process.env.DATABASE_PORT || '3306');
  const user = process.env.DATABASE_USERNAME || 'root';
  const password = process.env.DATABASE_PASSWORD || 'railway_mysql_password_123';
  const database = process.env.DATABASE_NAME || 'railway';

  console.log('🔧 MySQL 연결 설정:', { host, port, user, database });

  return mysql.createConnection({
    host,
    port,
    user,
    password,
    database,
    ssl: {
      rejectUnauthorized: false
    }
  });
};

export const connectDatabase = async (): Promise<mysql.Connection> => {
  try {
    console.log('🔄 Railway MySQL 연결 시도 중...');
    const connection = await createConnection();
    console.log('✅ Railway MySQL 연결 성공');
    
    // 테이블 생성
    await createTables(connection);
    
    return connection;
  } catch (error) {
    console.error('❌ Railway MySQL 연결 실패:', error);
    console.log('💡 SQLite로 폴백합니다...');
    
    // SQLite 폴백
    const sqlite = require('./database-sqlite');
    return await sqlite.connectDatabase();
  }
};

// MySQL 테이블 생성
const createTables = async (connection: mysql.Connection) => {
  try {
    // 사용자 테이블
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role ENUM('user', 'admin') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // 캠페인 테이블
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS campaigns (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status ENUM('draft', 'active', 'paused', 'completed') DEFAULT 'draft',
        budget DECIMAL(10,2) DEFAULT 0.00,
        start_date DATE,
        end_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // AI 콘텐츠 테이블
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS ai_content (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        campaign_id VARCHAR(36),
        content_type ENUM('post', 'ad', 'email', 'description') NOT NULL,
        content TEXT NOT NULL,
        prompt TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE SET NULL
      )
    `);

    console.log('✅ MySQL 테이블 생성 완료');
  } catch (error) {
    console.error('❌ MySQL 테이블 생성 실패:', error);
    throw error;
  }
};

export const disconnectDatabase = async (connection: mysql.Connection): Promise<void> => {
  try {
    await connection.end();
    console.log('✅ 데이터베이스 연결 종료');
  } catch (error) {
    console.error('❌ 데이터베이스 연결 종료 실패:', error);
  }
};

// 데이터베이스 쿼리 헬퍼 함수
export const query = async (sql: string, params?: any[]): Promise<any> => {
  const connection = await createConnection();
  try {
    const [rows] = await connection.execute(sql, params);
    return rows;
  } finally {
    await connection.end();
  }
};

// 트랜잭션 헬퍼 함수
export const transaction = async (callback: (connection: mysql.Connection) => Promise<any>): Promise<any> => {
  const connection = await createConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    await connection.end();
  }
}; 
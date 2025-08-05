import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

// SQLite 데이터베이스 파일 경로
const dbPath = path.join(__dirname, '../../database.sqlite');

export const connectDatabase = async () => {
  try {
    console.log('🔄 SQLite 데이터베이스 연결 시도 중...');
    
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    // 테이블 생성
    await createTables(db);
    
    console.log('✅ SQLite 데이터베이스 연결 성공');
    return db;
  } catch (error) {
    console.error('❌ SQLite 데이터베이스 연결 실패:', error);
    throw error;
  }
};

// SQLite 테이블 생성
const createTables = async (db: any) => {
  try {
    // 사용자 테이블
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 캠페인 테이블
    await db.exec(`
      CREATE TABLE IF NOT EXISTS campaigns (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'draft',
        budget REAL DEFAULT 0.0,
        start_date TEXT,
        end_date TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // AI 콘텐츠 테이블
    await db.exec(`
      CREATE TABLE IF NOT EXISTS ai_content (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        campaign_id TEXT,
        content_type TEXT NOT NULL,
        content TEXT NOT NULL,
        prompt TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (campaign_id) REFERENCES campaigns(id)
      )
    `);

    console.log('✅ SQLite 테이블 생성 완료');
  } catch (error) {
    console.error('❌ SQLite 테이블 생성 실패:', error);
    throw error;
  }
};

export const disconnectDatabase = async (db: any): Promise<void> => {
  try {
    await db.close();
    console.log('✅ SQLite 데이터베이스 연결 종료');
  } catch (error) {
    console.error('❌ SQLite 데이터베이스 연결 종료 실패:', error);
  }
};

// 데이터베이스 쿼리 헬퍼 함수
export const query = async (sql: string, params?: any[]): Promise<any> => {
  const db = await connectDatabase();
  try {
    const rows = await db.all(sql, params);
    return rows;
  } finally {
    await db.close();
  }
};

// 트랜잭션 헬퍼 함수
export const transaction = async (callback: (db: any) => Promise<any>): Promise<any> => {
  const db = await connectDatabase();
  try {
    await db.run('BEGIN TRANSACTION');
    const result = await callback(db);
    await db.run('COMMIT');
    return result;
  } catch (error) {
    await db.run('ROLLBACK');
    throw error;
  } finally {
    await db.close();
  }
}; 
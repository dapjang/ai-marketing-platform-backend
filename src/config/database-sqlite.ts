import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

let db: Database | null = null;

export const connectDatabase = async (): Promise<Database> => {
  if (db) {
    return db;
  }

  try {
    const dbPath = path.join(process.cwd(), 'database.sqlite');
    db = await open({
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

export const disconnectDatabase = async (): Promise<void> => {
  if (db) {
    await db.close();
    db = null;
    console.log('✅ SQLite 데이터베이스 연결 종료');
  }
};

const createTables = async (database: Database) => {
  // 사용자 테이블
  await database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      organization_id TEXT,
      profile_image_url TEXT,
      bio TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 조직 테이블
  await database.exec(`
    CREATE TABLE IF NOT EXISTS organizations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      industry TEXT,
      website_url TEXT,
      logo_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 캠페인 테이블
  await database.exec(`
    CREATE TABLE IF NOT EXISTS campaigns (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      organization_id TEXT,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'draft',
      campaign_type TEXT NOT NULL,
      target_audience TEXT,
      budget REAL,
      start_date TEXT,
      end_date TEXT,
      ai_generated_content TEXT,
      metrics TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE SET NULL
    )
  `);

  // 분석 데이터 테이블
  await database.exec(`
    CREATE TABLE IF NOT EXISTS analytics (
      id TEXT PRIMARY KEY,
      campaign_id TEXT NOT NULL,
      metric_type TEXT NOT NULL,
      value REAL NOT NULL,
      date TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE
    )
  `);

  // AI 생성 콘텐츠 테이블
  await database.exec(`
    CREATE TABLE IF NOT EXISTS ai_content (
      id TEXT PRIMARY KEY,
      campaign_id TEXT NOT NULL,
      content_type TEXT NOT NULL,
      content TEXT NOT NULL,
      ai_model TEXT,
      prompt_used TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE
    )
  `);

  // 사용자 세션 테이블
  await database.exec(`
    CREATE TABLE IF NOT EXISTS user_sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      token_hash TEXT NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  console.log('✅ SQLite 테이블 생성 완료');
};

// 데이터베이스 쿼리 헬퍼 함수
export const query = async (sql: string, params?: any[]): Promise<any> => {
  const database = await connectDatabase();
  return await database.all(sql, params);
};

// 트랜잭션 헬퍼 함수
export const transaction = async (callback: (database: Database) => Promise<any>): Promise<any> => {
  const database = await connectDatabase();
  try {
    await database.run('BEGIN TRANSACTION');
    const result = await callback(database);
    await database.run('COMMIT');
    return result;
  } catch (error) {
    await database.run('ROLLBACK');
    throw error;
  }
}; 
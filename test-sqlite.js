const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

async function testSQLiteConnection() {
  try {
    console.log('🔍 SQLite 데이터베이스 연결 테스트 중...');
    
    const dbPath = path.join(process.cwd(), 'database.sqlite');
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    console.log('✅ SQLite 데이터베이스 연결 성공!');

    // 테이블 생성
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

    // 테이블 존재 확인
    const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table'");
    console.log('📋 생성된 테이블:');
    tables.forEach(table => {
      console.log(`  - ${table.name}`);
    });

    // 테스트 사용자 생성
    const testUser = {
      id: 'test-user-1',
      email: 'test@example.com',
      password_hash: 'hashed_password',
      name: '테스트 사용자'
    };

    await db.run(
      'INSERT OR REPLACE INTO users (id, email, password_hash, name) VALUES (?, ?, ?, ?)',
      [testUser.id, testUser.email, testUser.password_hash, testUser.name]
    );

    console.log('✅ 테스트 사용자 생성 완료');

    // 생성된 사용자 확인
    const users = await db.all('SELECT * FROM users');
    console.log('👥 등록된 사용자:', users.length);

    await db.close();
    console.log('✅ SQLite 연결 테스트 완료!');
    
  } catch (error) {
    console.error('❌ SQLite 데이터베이스 연결 실패:', error.message);
  }
}

testSQLiteConnection(); 
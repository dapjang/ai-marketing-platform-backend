const mysql = require('mysql2/promise');
require('dotenv').config();

async function testDatabaseConnection() {
  try {
    console.log('🔍 PlanetScale 데이터베이스 연결 테스트 중...');
    
    const connection = await mysql.createConnection({
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      ssl: {
        rejectUnauthorized: false
      }
    });

    console.log('✅ 데이터베이스 연결 성공!');

    // 테이블 존재 확인
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('📋 생성된 테이블:');
    tables.forEach(table => {
      console.log(`  - ${Object.values(table)[0]}`);
    });

    await connection.end();
    console.log('✅ 연결 테스트 완료!');
    
  } catch (error) {
    console.error('❌ 데이터베이스 연결 실패:', error.message);
    console.log('\n🔧 해결 방법:');
    console.log('1. PlanetScale 계정을 만들었나요?');
    console.log('2. 데이터베이스를 생성했나요?');
    console.log('3. env.local 파일에 올바른 연결 정보를 입력했나요?');
    console.log('4. database-schema.sql을 실행했나요?');
  }
}

testDatabaseConnection(); 
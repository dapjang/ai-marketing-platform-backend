import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// PlanetScale MySQL 연결 설정
const createConnection = () => {
  return mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    ssl: {
      rejectUnauthorized: false
    }
  });
};

export const connectDatabase = async (): Promise<mysql.Connection> => {
  try {
    const connection = await createConnection();
    console.log('✅ PlanetScale MySQL 연결 성공');
    return connection;
  } catch (error) {
    console.error('❌ PlanetScale MySQL 연결 실패:', error);
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
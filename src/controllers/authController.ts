import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { query, transaction } from '../config/database-sqlite';

// 회원가입
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, company, phone } = req.body;

    // 이메일 중복 확인
    const existingUsers = await query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      res.status(400).json({ message: '이미 존재하는 이메일입니다.' });
      return;
    }

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    
    // 사용자 생성
    await query(
      'INSERT INTO users (id, email, password_hash, name, role) VALUES (?, ?, ?, ?, ?)',
      [userId, email, hashedPassword, name, 'user']
    );

    // JWT 토큰 생성
    const token = jwt.sign(
      { userId, email, role: 'user' },
      (process.env as any).JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({ 
      message: '회원가입이 완료되었습니다.',
      token,
      user: {
        id: userId,
        email,
        name,
        role: 'user'
      }
    });
  } catch (error) {
    console.error('회원가입 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 로그인
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // 사용자 조회
    const users = await query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      res.status(400).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
      return;
    }

    const user = users[0];

    // 비밀번호 확인
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      res.status(400).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
      return;
    }

    // JWT 토큰 생성
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      (process.env as any).JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: '로그인이 완료되었습니다.',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('로그인 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 프로필 조회
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    
    const users = await query('SELECT * FROM users WHERE id = ?', [userId]);
    if (users.length === 0) {
      res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
      return;
    }

    const user = users[0];
    const { password_hash, ...userWithoutPassword } = user;
    
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('프로필 조회 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 프로필 업데이트
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const { name, company, phone } = req.body;
    
    await query(
      'UPDATE users SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [name, userId]
    );

    const users = await query('SELECT * FROM users WHERE id = ?', [userId]);
    if (users.length === 0) {
      res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
      return;
    }

    const user = users[0];
    const { password_hash, ...userWithoutPassword } = user;
    
    res.json({ 
      message: '프로필이 업데이트되었습니다.',
      user: userWithoutPassword 
    });
  } catch (error) {
    console.error('프로필 업데이트 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
}; 
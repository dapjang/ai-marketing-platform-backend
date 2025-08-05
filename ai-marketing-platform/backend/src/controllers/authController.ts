import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

// 회원가입 (MongoDB 없이 작동)
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, company, role } = req.body;

    // 간단한 유효성 검사
    if (!email || !password || !name) {
      res.status(400).json({ message: '필수 필드가 누락되었습니다.' });
      return;
    }

    // JWT 토큰 생성 (임시 사용자 ID 사용)
    const token = jwt.sign(
      { id: 'temp-user-id', email },
      process.env['JWT_SECRET'] || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: '회원가입이 완료되었습니다. (MongoDB 없이 작동)',
      token,
      user: {
        id: 'temp-user-id',
        email,
        name,
        company,
        role: role || 'client'
      }
    });
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 로그인 (MongoDB 없이 작동)
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // 간단한 유효성 검사
    if (!email || !password) {
      res.status(400).json({ message: '이메일과 비밀번호를 입력해주세요.' });
      return;
    }

    // 임시 로그인 로직 (실제로는 데이터베이스에서 확인해야 함)
    if (email === 'test@example.com' && password === 'password') {
      // JWT 토큰 생성
      const token = jwt.sign(
        { id: 'temp-user-id', email },
        process.env['JWT_SECRET'] || 'your-secret-key',
        { expiresIn: '7d' }
      );

      res.json({
        message: '로그인이 완료되었습니다. (MongoDB 없이 작동)',
        token,
        user: {
          id: 'temp-user-id',
          email,
          name: '테스트 사용자',
          company: '테스트 회사',
          role: 'client'
        }
      });
    } else {
      res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    }
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 프로필 조회 (MongoDB 없이 작동)
export const getProfile = async (_req: any, res: Response): Promise<void> => {
  try {
    // 임시 사용자 정보 반환
    res.json({
      id: 'temp-user-id',
      email: 'test@example.com',
      name: '테스트 사용자',
      company: '테스트 회사',
      role: 'client'
    });
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 프로필 업데이트 (MongoDB 없이 작동)
export const updateProfile = async (req: any, res: Response): Promise<void> => {
  try {
    const { name, company } = req.body;
    
    // 임시 업데이트 응답
    res.json({
      message: '프로필이 업데이트되었습니다. (MongoDB 없이 작동)',
      user: {
        id: 'temp-user-id',
        email: 'test@example.com',
        name: name || '테스트 사용자',
        company: company || '테스트 회사',
        role: 'client'
      }
    });
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
}; 
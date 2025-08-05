import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { query } from '../config/database-sqlite';

// 사용자 정보를 포함한 Request 인터페이스 확장
export interface AuthRequest extends Request {
  user?: any;
}

// JWT 토큰 검증 미들웨어
export const auth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({ message: '인증 토큰이 필요합니다.' });
      return;
    }

    console.log('🔍 토큰 검증 중:', token.substring(0, 50) + '...');

    const decoded = jwt.verify(token, (process.env as any).JWT_SECRET || 'your-secret-key') as any;
    console.log('✅ 토큰 디코딩 성공:', decoded);
    
    // SQLite에서 사용자 조회
    const users = await query('SELECT * FROM users WHERE id = ?', [decoded.userId]);
    
    if (users.length === 0) {
      console.log('❌ 사용자를 찾을 수 없음:', decoded.userId);
      res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
      return;
    }
    
    const user = users[0];
    const { password_hash, ...userWithoutPassword } = user;
    req.user = { ...userWithoutPassword, userId: user.id };
    
    console.log('✅ 인증 성공:', req.user);
    next();
  } catch (error) {
    console.error('❌ 토큰 검증 실패:', error);
    res.status(401).json({ message: '토큰이 유효하지 않습니다.' });
  }
};

// 역할 기반 접근 제어 미들웨어
export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: '인증이 필요합니다.' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ message: '접근 권한이 없습니다.' });
      return;
    }

    next();
  };
};

// 특정 역할 미들웨어
export const requireAdmin = requireRole(['admin']);
export const requireMarketer = requireRole(['admin', 'marketer']);
export const requireUser = requireRole(['admin', 'marketer', 'user']); 
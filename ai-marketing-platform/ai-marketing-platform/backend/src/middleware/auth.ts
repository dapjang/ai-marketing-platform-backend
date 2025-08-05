import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

// 인증된 요청에 사용자 정보를 추가하기 위한 인터페이스
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    name: string;
  };
}

// JWT 토큰 검증 미들웨어
export const auth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({ message: '인증 토큰이 필요합니다.' });
      return;
    }

    const decoded = jwt.verify(token, (process.env as any).JWT_SECRET || 'your-secret-key') as any;
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
      return;
    }

    if (!user.isActive) {
      res.status(401).json({ message: '비활성화된 계정입니다.' });
      return;
    }

    req.user = {
      id: (user as any)._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name
    };

    next();
  } catch (error) {
    res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
    return;
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

// 관리자 전용 미들웨어
export const requireAdmin = requireRole(['admin']);

// 마케터 전용 미들웨어
export const requireMarketer = requireRole(['marketer', 'admin']);

// 일반 사용자 미들웨어
export const requireUser = requireRole(['user', 'marketer', 'admin']); 
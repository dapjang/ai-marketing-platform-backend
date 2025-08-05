import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';

interface AuthRequest extends Request {
  user?: IUser;
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      res.status(401).json({ message: '인증 토큰이 필요합니다.' });
      return;
    }

    const decoded = jwt.verify(token, process.env['JWT_SECRET'] || 'your-secret-key') as { id: string };
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: '인증에 실패했습니다.' });
  }
};

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
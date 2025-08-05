import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

// 회원가입
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, company, role } = req.body;

    // 이메일 중복 확인
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: '이미 존재하는 이메일입니다.' });
      return;
    }

    // 새 사용자 생성
    const user = new User({
      email,
      password,
      name,
      company,
      role: role || 'client'
    });

    await user.save();

    // JWT 토큰 생성
    const token = jwt.sign(
      { id: user._id },
      process.env['JWT_SECRET'] || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: '회원가입이 완료되었습니다.',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        company: user.company,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 로그인
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // 사용자 찾기
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
      return;
    }

    // 비밀번호 확인
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
      return;
    }

    // 활성 상태 확인
    if (!user.isActive) {
      res.status(401).json({ message: '비활성화된 계정입니다.' });
      return;
    }

    // JWT 토큰 생성
    const token = jwt.sign(
      { id: user._id },
      process.env['JWT_SECRET'] || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: '로그인이 완료되었습니다.',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        company: user.company,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 프로필 조회
export const getProfile = async (req: any, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 프로필 업데이트
export const updateProfile = async (req: any, res: Response): Promise<void> => {
  try {
    const { name, company } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, company },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: '프로필이 업데이트되었습니다.',
      user
    });
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
}; 
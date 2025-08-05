import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

// 사용자 등록
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, company, phone, role = 'user' } = req.body;

    // 필수 필드 검증
    if (!email || !password || !name) {
      res.status(400).json({ message: '이메일, 비밀번호, 이름은 필수입니다.' });
      return;
    }

    // 이메일 중복 확인
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: '이미 등록된 이메일입니다.' });
      return;
    }

    // 새 사용자 생성
    const user = new User({
      email,
      password,
      name,
      company,
      phone,
      role
    });

    await user.save();

    // JWT 토큰 생성
    const token = jwt.sign(
      { id: user._id },
      (process.env as any).JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: '회원가입이 완료되었습니다.',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        company: user.company
      }
    });
  } catch (error) {
    console.error('회원가입 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    return;
  }
};

// 사용자 로그인
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // 필수 필드 검증
    if (!email || !password) {
      res.status(400).json({ message: '이메일과 비밀번호를 입력해주세요.' });
      return;
    }

    // 사용자 찾기
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
      return;
    }

    // 비밀번호 확인
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
      return;
    }

    // 계정 활성화 확인
    if (!user.isActive) {
      res.status(401).json({ message: '비활성화된 계정입니다.' });
      return;
    }

    // 마지막 로그인 시간 업데이트
    user.lastLogin = new Date();
    await user.save();

    // JWT 토큰 생성
    const token = jwt.sign(
      { id: user._id },
      (process.env as any).JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: '로그인이 완료되었습니다.',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        company: user.company
      }
    });
  } catch (error) {
    console.error('로그인 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    return;
  }
};

// 프로필 조회
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    
    if (!userId) {
      res.status(401).json({ message: '인증이 필요합니다.' });
      return;
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
      return;
    }

    res.json({ user });
  } catch (error) {
    console.error('프로필 조회 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    return;
  }
};

// 프로필 수정
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const { name, company, phone, profileImage } = req.body;

    if (!userId) {
      res.status(401).json({ message: '인증이 필요합니다.' });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
      return;
    }

    // 업데이트할 필드들
    if (name) user.name = name;
    if (company !== undefined) user.company = company;
    if (phone !== undefined) user.phone = phone;
    if (profileImage !== undefined) user.profileImage = profileImage;

    await user.save();

    res.json({
      message: '프로필이 업데이트되었습니다.',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        company: user.company,
        phone: user.phone,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    console.error('프로필 수정 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    return;
  }
}; 
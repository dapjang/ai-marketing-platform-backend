import express from 'express';
import { register, login, getProfile, updateProfile } from '../controllers/authController';
import { auth } from '../middleware/auth';

const router = express.Router();

// 회원가입
router.post('/register', register);

// 로그인
router.post('/login', login);

// 프로필 조회 (인증 필요)
router.get('/profile', auth, getProfile);

// 프로필 업데이트 (인증 필요)
router.put('/profile', auth, updateProfile);

export default router; 
import express from 'express';
import { register, login, getProfile, updateProfile } from '../controllers/authController';
import { auth } from '../middleware/auth';

const router = express.Router();

// 공개 라우트
router.post('/register', register);
router.post('/login', login);

// 보호된 라우트
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);

export default router; 
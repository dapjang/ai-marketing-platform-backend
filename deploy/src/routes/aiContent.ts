import express from 'express';
import { 
  generateAIContent, 
  getUserAIContent, 
  getAIContent, 
  deleteAIContent 
} from '../controllers/aiContentController';
import { auth, requireUser } from '../middleware/auth';

const router = express.Router();

// 모든 라우트에 인증 미들웨어 적용
router.use(auth);

// AI 콘텐츠 관리 라우트
router.post('/', requireUser, generateAIContent);
router.get('/', getUserAIContent);
router.get('/:id', getAIContent);
router.delete('/:id', requireUser, deleteAIContent);

export default router; 
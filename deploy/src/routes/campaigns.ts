import express from 'express';
import { 
  createCampaign, 
  getUserCampaigns, 
  getCampaign, 
  updateCampaign, 
  deleteCampaign,
  updateCampaignStatus,
  updateAIContent
} from '../controllers/campaignController';
import { auth, requireUser } from '../middleware/auth';

const router = express.Router();

// 모든 라우트에 인증 미들웨어 적용
router.use(auth);

// 캠페인 관리 라우트
router.post('/', requireUser, createCampaign);
router.get('/', getUserCampaigns);
router.get('/:id', getCampaign);
router.put('/:id', requireUser, updateCampaign);
router.delete('/:id', requireUser, deleteCampaign);
router.patch('/:id/status', requireUser, updateCampaignStatus);
router.patch('/:id/ai-content', requireUser, updateAIContent);

export default router; 
import { Router } from 'express';
import {
  createCampaign,
  getUserCampaigns,
  getCampaign,
  updateCampaign,
  deleteCampaign,
  updateCampaignStatus,
  updateAIContent
} from '../controllers/campaignController';
import { auth, requireMarketer } from '../middleware/auth';

const router = Router();

// 모든 캠페인 라우트는 인증 필요
router.use(auth);

// 캠페인 CRUD
router.post('/', requireMarketer, createCampaign);
router.get('/', getUserCampaigns);
router.get('/:id', getCampaign);
router.put('/:id', requireMarketer, updateCampaign);
router.delete('/:id', requireMarketer, deleteCampaign);

// 캠페인 상태 관리
router.patch('/:id/status', requireMarketer, updateCampaignStatus);

// AI 콘텐츠 관리
router.patch('/:id/ai-content', requireMarketer, updateAIContent);

export default router; 
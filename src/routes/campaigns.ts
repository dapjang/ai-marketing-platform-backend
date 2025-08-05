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
import { auth } from '../middleware/auth';

const router = express.Router();

// 모든 캠페인 라우트에 인증 미들웨어 적용
router.use(auth);

// 캠페인 생성
router.post('/', createCampaign);

// 사용자의 캠페인 목록 조회
router.get('/', getUserCampaigns);

// 특정 캠페인 조회
router.get('/:id', getCampaign);

// 캠페인 업데이트
router.put('/:id', updateCampaign);

// 캠페인 삭제
router.delete('/:id', deleteCampaign);

// 캠페인 상태 업데이트
router.patch('/:id/status', updateCampaignStatus);

// AI 콘텐츠 업데이트
router.patch('/:id/ai-content', updateAIContent);

export default router; 
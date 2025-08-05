import { Response } from 'express';
import { Campaign } from '../models/Campaign';
import { AuthRequest } from '../middleware/auth';

// 캠페인 생성
export const createCampaign = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, budget, targetAudience, startDate, endDate } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: '인증이 필요합니다.' });
      return;
    }

    if (!title || !description) {
      res.status(400).json({ message: '제목과 설명은 필수입니다.' });
      return;
    }

    const campaign = new Campaign({
      title,
      description,
      userId,
      budget,
      targetAudience,
      startDate,
      endDate,
      status: 'draft'
    });

    await campaign.save();

    res.status(201).json({
      message: '캠페인이 생성되었습니다.',
      campaign
    });
  } catch (error) {
    console.error('캠페인 생성 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    return;
  }
};

// 사용자의 캠페인 목록 조회
export const getUserCampaigns = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { status, page = 1, limit = 10 } = req.query;

    if (!userId) {
      res.status(401).json({ message: '인증이 필요합니다.' });
      return;
    }

    const filter: any = { userId };
    if (status) filter.status = status;

    const campaigns = await Campaign.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Campaign.countDocuments(filter);

    res.json({
      campaigns,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('캠페인 목록 조회 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    return;
  }
};

// 특정 캠페인 조회
export const getCampaign = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: '인증이 필요합니다.' });
      return;
    }

    const campaign = await Campaign.findOne({ _id: id, userId });
    if (!campaign) {
      res.status(404).json({ message: '캠페인을 찾을 수 없습니다.' });
      return;
    }

    res.json({ campaign });
  } catch (error) {
    console.error('캠페인 조회 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    return;
  }
};

// 캠페인 수정
export const updateCampaign = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const { title, description, budget, targetAudience, startDate, endDate } = req.body;

    if (!userId) {
      res.status(401).json({ message: '인증이 필요합니다.' });
      return;
    }

    const campaign = await Campaign.findOne({ _id: id, userId });
    if (!campaign) {
      res.status(404).json({ message: '캠페인을 찾을 수 없습니다.' });
      return;
    }

    // 업데이트할 필드들
    if (title) campaign.title = title;
    if (description) campaign.description = description;
    if (budget !== undefined) campaign.budget = budget;
    if (targetAudience) campaign.targetAudience = targetAudience;
    if (startDate) (campaign as any).schedule.startDate = startDate;
    if (endDate) (campaign as any).schedule.endDate = endDate;

    await campaign.save();

    res.json({
      message: '캠페인이 업데이트되었습니다.',
      campaign
    });
  } catch (error) {
    console.error('캠페인 수정 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    return;
  }
};

// 캠페인 삭제
export const deleteCampaign = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: '인증이 필요합니다.' });
      return;
    }

    const campaign = await Campaign.findOne({ _id: id, userId });
    if (!campaign) {
      res.status(404).json({ message: '캠페인을 찾을 수 없습니다.' });
      return;
    }

    await Campaign.findByIdAndDelete(id);

    res.json({ message: '캠페인이 삭제되었습니다.' });
  } catch (error) {
    console.error('캠페인 삭제 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    return;
  }
};

// 캠페인 상태 변경
export const updateCampaignStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: '인증이 필요합니다.' });
      return;
    }

    const validStatuses = ['draft', 'active', 'paused', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ message: '유효하지 않은 상태입니다.' });
      return;
    }

    const campaign = await Campaign.findOne({ _id: id, userId });
    if (!campaign) {
      res.status(404).json({ message: '캠페인을 찾을 수 없습니다.' });
      return;
    }

    campaign.status = status;
    await campaign.save();

    res.json({
      message: '캠페인 상태가 업데이트되었습니다.',
      campaign
    });
  } catch (error) {
    console.error('캠페인 상태 변경 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    return;
  }
};

// AI 콘텐츠 업데이트
export const updateAIContent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { aiContent } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: '인증이 필요합니다.' });
      return;
    }

    if (!aiContent) {
      res.status(400).json({ message: 'AI 콘텐츠는 필수입니다.' });
      return;
    }

    const campaign = await Campaign.findOne({ _id: id, userId });
    if (!campaign) {
      res.status(404).json({ message: '캠페인을 찾을 수 없습니다.' });
      return;
    }

    campaign.aiContent = aiContent;
    await campaign.save();

    res.json({
      message: 'AI 콘텐츠가 업데이트되었습니다.',
      campaign
    });
  } catch (error) {
    console.error('AI 콘텐츠 업데이트 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    return;
  }
}; 
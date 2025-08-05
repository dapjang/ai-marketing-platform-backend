import { Response } from 'express';
// MongoDB 없이 작동하도록 Campaign 모델 import 제거

// 캠페인 생성 (MongoDB 없이 작동)
export const createCampaign = async (req: any, res: Response): Promise<void> => {
  try {
    const campaignData = {
      ...req.body,
      userId: 'temp-user-id',
      _id: 'temp-campaign-id-' + Date.now()
    };

    res.status(201).json({
      message: '캠페인이 생성되었습니다. (MongoDB 없이 작동)',
      campaign: campaignData
    });
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 사용자의 캠페인 목록 조회 (MongoDB 없이 작동)
export const getUserCampaigns = async (req: any, res: Response): Promise<void> => {
  try {
    const { page = 1, _limit = 10, _status } = req.query;

    // 임시 캠페인 데이터
    const campaigns = [
      {
        _id: 'temp-campaign-1',
        title: '테스트 캠페인 1',
        description: '테스트 캠페인 설명',
        status: 'active',
        budget: 1000000,
        createdAt: new Date().toISOString()
      },
      {
        _id: 'temp-campaign-2',
        title: '테스트 캠페인 2',
        description: '테스트 캠페인 설명',
        status: 'draft',
        budget: 2000000,
        createdAt: new Date().toISOString()
      }
    ];

    res.json({
      campaigns,
      pagination: {
        current: Number(page),
        total: 1,
        hasNext: false,
        hasPrev: false
      }
    });
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 특정 캠페인 조회 (MongoDB 없이 작동)
export const getCampaign = async (req: any, res: Response): Promise<void> => {
  try {
    // 임시 캠페인 데이터
    const campaign = {
      _id: req.params.id,
      title: '테스트 캠페인',
      description: '테스트 캠페인 설명',
      status: 'active',
      budget: 1000000,
      createdAt: new Date().toISOString()
    };

    res.json(campaign);
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 캠페인 업데이트 (MongoDB 없이 작동)
export const updateCampaign = async (req: any, res: Response): Promise<void> => {
  try {
    const campaign = {
      _id: req.params.id,
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    res.json({
      message: '캠페인이 업데이트되었습니다. (MongoDB 없이 작동)',
      campaign
    });
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 캠페인 삭제 (MongoDB 없이 작동)
export const deleteCampaign = async (req: any, res: Response): Promise<void> => {
  try {
    res.json({ message: '캠페인이 삭제되었습니다. (MongoDB 없이 작동)' });
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 캠페인 상태 변경 (MongoDB 없이 작동)
export const updateCampaignStatus = async (req: any, res: Response): Promise<void> => {
  try {
    const { status } = req.body;

    const campaign = {
      _id: req.params.id,
      status,
      updatedAt: new Date().toISOString()
    };

    res.json({
      message: '캠페인 상태가 업데이트되었습니다. (MongoDB 없이 작동)',
      campaign
    });
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// AI 생성 콘텐츠 업데이트 (MongoDB 없이 작동)
export const updateAIContent = async (req: any, res: Response): Promise<void> => {
  try {
    const { aiGeneratedContent } = req.body;

    const campaign = {
      _id: req.params.id,
      aiGeneratedContent,
      updatedAt: new Date().toISOString()
    };

    res.json({
      message: 'AI 생성 콘텐츠가 업데이트되었습니다. (MongoDB 없이 작동)',
      campaign
    });
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
}; 
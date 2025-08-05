import { Response } from 'express';
import { Campaign } from '../models/Campaign';

// 캠페인 생성
export const createCampaign = async (req: any, res: Response): Promise<void> => {
  try {
    const campaignData = {
      ...req.body,
      userId: req.user._id
    };

    const campaign = new Campaign(campaignData);
    await campaign.save();

    res.status(201).json({
      message: '캠페인이 생성되었습니다.',
      campaign
    });
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 사용자의 캠페인 목록 조회
export const getUserCampaigns = async (req: any, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter: any = { userId: req.user._id };
    if (status) filter.status = status;

    const campaigns = await Campaign.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Campaign.countDocuments(filter);

    res.json({
      campaigns,
      pagination: {
        current: Number(page),
        total: Math.ceil(total / Number(limit)),
        hasNext: skip + campaigns.length < total,
        hasPrev: Number(page) > 1
      }
    });
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 특정 캠페인 조회
export const getCampaign = async (req: any, res: Response): Promise<void> => {
  try {
    const campaign = await Campaign.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!campaign) {
      res.status(404).json({ message: '캠페인을 찾을 수 없습니다.' });
      return;
    }

    res.json(campaign);
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 캠페인 업데이트
export const updateCampaign = async (req: any, res: Response): Promise<void> => {
  try {
    const campaign = await Campaign.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user._id
      },
      req.body,
      { new: true, runValidators: true }
    );

    if (!campaign) {
      res.status(404).json({ message: '캠페인을 찾을 수 없습니다.' });
      return;
    }

    res.json({
      message: '캠페인이 업데이트되었습니다.',
      campaign
    });
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 캠페인 삭제
export const deleteCampaign = async (req: any, res: Response): Promise<void> => {
  try {
    const campaign = await Campaign.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!campaign) {
      res.status(404).json({ message: '캠페인을 찾을 수 없습니다.' });
      return;
    }

    res.json({ message: '캠페인이 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 캠페인 상태 변경
export const updateCampaignStatus = async (req: any, res: Response): Promise<void> => {
  try {
    const { status } = req.body;

    const campaign = await Campaign.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user._id
      },
      { status },
      { new: true }
    );

    if (!campaign) {
      res.status(404).json({ message: '캠페인을 찾을 수 없습니다.' });
      return;
    }

    res.json({
      message: '캠페인 상태가 업데이트되었습니다.',
      campaign
    });
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// AI 생성 콘텐츠 업데이트
export const updateAIContent = async (req: any, res: Response): Promise<void> => {
  try {
    const { aiGeneratedContent } = req.body;

    const campaign = await Campaign.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user._id
      },
      { aiGeneratedContent },
      { new: true }
    );

    if (!campaign) {
      res.status(404).json({ message: '캠페인을 찾을 수 없습니다.' });
      return;
    }

    res.json({
      message: 'AI 생성 콘텐츠가 업데이트되었습니다.',
      campaign
    });
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
}; 
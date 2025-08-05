import { Response } from 'express';
import { Campaign } from '../models/Campaign';

// 캠페인 생성
export const createCampaign = async (req: any, res: Response): Promise<void> => {
  try {
    const { 
      title, 
      description, 
      budget, 
      targetAudience, 
      startDate, 
      endDate 
    } = req.body;
    
    const campaign = new Campaign({
      title,
      description,
      budget,
      targetAudience,
      startDate,
      endDate,
      userId: req.user._id
    });

    await campaign.save();
    res.status(201).json({
      message: '캠페인이 생성되었습니다.',
      campaign
    });
  } catch (error) {
    console.error('캠페인 생성 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 사용자의 캠페인 목록 조회
export const getUserCampaigns = async (req: any, res: Response): Promise<void> => {
  try {
    const campaigns = await Campaign.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json({ campaigns });
  } catch (error) {
    console.error('캠페인 목록 조회 오류:', error);
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

    res.json({ campaign });
  } catch (error) {
    console.error('캠페인 조회 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 캠페인 업데이트
export const updateCampaign = async (req: any, res: Response): Promise<void> => {
  try {
    const campaign = await Campaign.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
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
    console.error('캠페인 업데이트 오류:', error);
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
    console.error('캠페인 삭제 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 캠페인 상태 업데이트
export const updateCampaignStatus = async (req: any, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    
    const campaign = await Campaign.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
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
    console.error('캠페인 상태 업데이트 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// AI 콘텐츠 업데이트
export const updateAIContent = async (req: any, res: Response): Promise<void> => {
  try {
    const { aiContent } = req.body;
    
    const campaign = await Campaign.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { aiContent },
      { new: true }
    );

    if (!campaign) {
      res.status(404).json({ message: '캠페인을 찾을 수 없습니다.' });
      return;
    }

    res.json({
      message: 'AI 콘텐츠가 업데이트되었습니다.',
      campaign
    });
  } catch (error) {
    console.error('AI 콘텐츠 업데이트 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
}; 
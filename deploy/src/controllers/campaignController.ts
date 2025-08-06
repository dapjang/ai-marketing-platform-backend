import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query, transaction } from '../config/database';

// 캠페인 생성
export const createCampaign = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      title, 
      description, 
      budget, 
      targetAudience, 
      startDate, 
      endDate,
      campaignType = 'social_media'
    } = req.body;
    
    const userId = (req as any).user.userId;
    const campaignId = uuidv4();
    
    await query(
      `INSERT INTO campaigns (
        id, user_id, title, description, budget, target_audience, 
        start_date, end_date, campaign_type, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        campaignId, userId, title, description, budget, 
        JSON.stringify(targetAudience), startDate, endDate, 
        campaignType, 'draft'
      ]
    );

    const campaigns = await query('SELECT * FROM campaigns WHERE id = ?', [campaignId]);
    const campaign = campaigns[0];

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
export const getUserCampaigns = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    
    const campaigns = await query(
      'SELECT * FROM campaigns WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    
    res.json({ campaigns });
  } catch (error) {
    console.error('캠페인 목록 조회 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 특정 캠페인 조회
export const getCampaign = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const campaignId = req.params.id;
    
    const campaigns = await query(
      'SELECT * FROM campaigns WHERE id = ? AND user_id = ?',
      [campaignId, userId]
    );

    if (campaigns.length === 0) {
      res.status(404).json({ message: '캠페인을 찾을 수 없습니다.' });
      return;
    }

    res.json({ campaign: campaigns[0] });
  } catch (error) {
    console.error('캠페인 조회 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 캠페인 업데이트
export const updateCampaign = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const campaignId = req.params.id;
    const { title, description, budget, targetAudience, startDate, endDate, campaignType } = req.body;
    
    await query(
      `UPDATE campaigns SET 
        title = ?, description = ?, budget = ?, target_audience = ?,
        start_date = ?, end_date = ?, campaign_type = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ? AND user_id = ?`,
      [
        title, description, budget, JSON.stringify(targetAudience),
        startDate, endDate, campaignType, campaignId, userId
      ]
    );

    const campaigns = await query(
      'SELECT * FROM campaigns WHERE id = ? AND user_id = ?',
      [campaignId, userId]
    );

    if (campaigns.length === 0) {
      res.status(404).json({ message: '캠페인을 찾을 수 없습니다.' });
      return;
    }

    res.json({
      message: '캠페인이 업데이트되었습니다.',
      campaign: campaigns[0]
    });
  } catch (error) {
    console.error('캠페인 업데이트 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 캠페인 삭제
export const deleteCampaign = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const campaignId = req.params.id;
    
    const result = await query(
      'DELETE FROM campaigns WHERE id = ? AND user_id = ?',
      [campaignId, userId]
    );

    if (result.changes === 0) {
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
export const updateCampaignStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const campaignId = req.params.id;
    const { status } = req.body;
    
    await query(
      'UPDATE campaigns SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
      [status, campaignId, userId]
    );

    const campaigns = await query(
      'SELECT * FROM campaigns WHERE id = ? AND user_id = ?',
      [campaignId, userId]
    );

    if (campaigns.length === 0) {
      res.status(404).json({ message: '캠페인을 찾을 수 없습니다.' });
      return;
    }

    res.json({
      message: '캠페인 상태가 업데이트되었습니다.',
      campaign: campaigns[0]
    });
  } catch (error) {
    console.error('캠페인 상태 업데이트 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// AI 콘텐츠 업데이트
export const updateAIContent = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const campaignId = req.params.id;
    const { aiGeneratedContent } = req.body;
    
    await query(
      'UPDATE campaigns SET ai_generated_content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
      [JSON.stringify(aiGeneratedContent), campaignId, userId]
    );

    const campaigns = await query(
      'SELECT * FROM campaigns WHERE id = ? AND user_id = ?',
      [campaignId, userId]
    );

    if (campaigns.length === 0) {
      res.status(404).json({ message: '캠페인을 찾을 수 없습니다.' });
      return;
    }

    res.json({
      message: 'AI 콘텐츠가 업데이트되었습니다.',
      campaign: campaigns[0]
    });
  } catch (error) {
    console.error('AI 콘텐츠 업데이트 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
}; 
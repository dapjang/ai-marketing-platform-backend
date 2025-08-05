import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/database';

// AI 콘텐츠 생성
export const generateAIContent = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      type,
      platform,
      targetAudience,
      productInfo,
      tone,
      userId
    } = req.body;

    // 실제 AI API 호출 대신 모의 데이터 생성
    const generatedContent = generateMockAIContent(type, platform, targetAudience, productInfo, tone);
    
    const contentId = uuidv4();
    
    // 생성된 콘텐츠를 데이터베이스에 저장
    await query(
      `INSERT INTO ai_generated_content (
        id, user_id, type, platform, target_audience, product_info, 
        tone, content, hashtags, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      [
        contentId,
        userId,
        type,
        platform || null,
        JSON.stringify(targetAudience),
        productInfo,
        tone,
        generatedContent.content,
        JSON.stringify(generatedContent.hashtags || [])
      ]
    );

    res.status(201).json({
      message: 'AI 콘텐츠가 생성되었습니다.',
      content: {
        id: contentId,
        ...generatedContent,
        created_at: new Date()
      }
    });
  } catch (error) {
    console.error('AI 콘텐츠 생성 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 사용자의 AI 생성 콘텐츠 목록 조회
export const getUserAIContent = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    
    const contents = await query(
      'SELECT * FROM ai_generated_content WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    
    res.json({ contents });
  } catch (error) {
    console.error('AI 콘텐츠 목록 조회 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 특정 AI 콘텐츠 조회
export const getAIContent = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const contentId = req.params.id;
    
    const contents = await query(
      'SELECT * FROM ai_generated_content WHERE id = ? AND user_id = ?',
      [contentId, userId]
    );

    if (contents.length === 0) {
      res.status(404).json({ message: '콘텐츠를 찾을 수 없습니다.' });
      return;
    }

    res.json({ content: contents[0] });
  } catch (error) {
    console.error('AI 콘텐츠 조회 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// AI 콘텐츠 삭제
export const deleteAIContent = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const contentId = req.params.id;
    
    const result = await query(
      'DELETE FROM ai_generated_content WHERE id = ? AND user_id = ?',
      [contentId, userId]
    );

    if (result.changes === 0) {
      res.status(404).json({ message: '콘텐츠를 찾을 수 없습니다.' });
      return;
    }

    res.json({ message: '콘텐츠가 삭제되었습니다.' });
  } catch (error) {
    console.error('AI 콘텐츠 삭제 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

// 모의 AI 콘텐츠 생성 함수
const generateMockAIContent = (type: string, platform: string, targetAudience: string, productInfo: string, tone: string) => {
  const contents = {
    social_post: {
      instagram: `🔥 새로운 제품이 출시되었어요! ${targetAudience}을 위한 특별한 혜택을 준비했습니다. ${productInfo} 지금 바로 확인해보세요! #새로운제품 #특별한혜택 #라이프스타일`,
      facebook: `안녕하세요! 오늘은 ${targetAudience}에게 특별한 소식을 전해드릴게요. ${productInfo} 고객님들의 많은 관심을 받고 있습니다. 지금 바로 확인해보세요!`,
      twitter: `새로운 제품 출시! 🎉 ${targetAudience}을 위한 ${productInfo} 지금 바로 확인해보세요! #새로운제품 #혁신`,
      linkedin: `새로운 제품 출시를 알려드립니다. ${targetAudience}의 니즈를 정확히 파악하여 개발한 ${productInfo} 시장에서 큰 호응을 얻고 있습니다. #제품출시 #마케팅`
    },
    ad_copy: {
      title: `${targetAudience}을 위한 특별한 제안`,
      description: `${productInfo}로 더욱 편리하고 즐거운 일상을 경험해보세요.`,
      cta: '지금 바로 확인하기'
    },
    email: {
      subject: `${targetAudience}을 위한 특별한 혜택을 놓치지 마세요!`,
      content: `안녕하세요! 오늘은 ${targetAudience}에게 특별한 소식을 전해드릴게요. ${productInfo} 고객님들의 많은 관심을 받고 있습니다. 지금 바로 확인해보세요!`
    },
    blog: {
      title: `${targetAudience}을 위한 마케팅 전략`,
      content: `오늘은 ${targetAudience}을 위한 효과적인 마케팅 전략에 대해 알아보겠습니다. ${productInfo}의 니즈를 정확히 파악하고 그에 맞는 메시지를 전달하는 것이 중요합니다.`
    }
  };

  if (type === 'social_post') {
    const content = contents.social_post[platform as keyof typeof contents.social_post] || contents.social_post.instagram;
    return {
      content,
      hashtags: ['#새로운제품', '#특별한혜택', '#라이프스타일', '#혁신', '#마케팅']
    };
  } else if (type === 'ad_copy') {
    const adContent = contents.ad_copy;
    return {
      content: `${adContent.title}\n\n${adContent.description}\n\n${adContent.cta}`,
      title: adContent.title,
      description: adContent.description,
      cta: adContent.cta
    };
  } else if (type === 'email') {
    const emailContent = contents.email;
    return {
      content: emailContent.content,
      subject: emailContent.subject
    };
  } else {
    const blogContent = contents.blog;
    return {
      content: blogContent.content,
      title: blogContent.title
    };
  }
}; 
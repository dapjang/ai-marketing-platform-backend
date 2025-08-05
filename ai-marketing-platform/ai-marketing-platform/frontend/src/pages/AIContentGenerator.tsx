import React, { useState } from 'react';
import { 
  Sparkles, 
  MessageSquare, 
  Image, 
  FileText, 
  Share2, 
  Copy, 
  Download,
  Wand2,
  Lightbulb,
  Target,
  Users,
  TrendingUp
} from 'lucide-react';

interface GeneratedContent {
  id: string;
  type: 'social_post' | 'ad_copy' | 'email' | 'blog';
  platform?: string;
  content: string;
  hashtags?: string[];
  title?: string;
  description?: string;
  cta?: string;
  generatedAt: Date;
}

const AIContentGenerator: React.FC = () => {
  const [selectedType, setSelectedType] = useState<'social_post' | 'ad_copy' | 'email' | 'blog'>('social_post');
  const [platform, setPlatform] = useState('instagram');
  const [targetAudience, setTargetAudience] = useState('');
  const [productInfo, setProductInfo] = useState('');
  const [tone, setTone] = useState('friendly');
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const contentTypes = [
    {
      id: 'social_post',
      name: '소셜 미디어 포스트',
      icon: MessageSquare,
      description: '인스타그램, 페이스북 등에 적합한 포스트'
    },
    {
      id: 'ad_copy',
      name: '광고 카피',
      icon: Target,
      description: '디스플레이 광고, 검색 광고용 카피'
    },
    {
      id: 'email',
      name: '이메일 마케팅',
      icon: FileText,
      description: '뉴스레터, 프로모션 이메일'
    },
    {
      id: 'blog',
      name: '블로그 포스트',
      icon: FileText,
      description: '블로그, 웹사이트용 콘텐츠'
    }
  ];

  const platforms = [
    { id: 'instagram', name: 'Instagram', color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
    { id: 'facebook', name: 'Facebook', color: 'bg-gradient-to-r from-blue-500 to-blue-600' },
    { id: 'twitter', name: 'Twitter', color: 'bg-gradient-to-r from-blue-400 to-blue-500' },
    { id: 'linkedin', name: 'LinkedIn', color: 'bg-gradient-to-r from-blue-600 to-blue-700' }
  ];

  const tones = [
    { id: 'friendly', name: '친근한', emoji: '😊' },
    { id: 'professional', name: '전문적인', emoji: '💼' },
    { id: 'casual', name: '편안한', emoji: '😌' },
    { id: 'energetic', name: '활기찬', emoji: '🔥' },
    { id: 'luxury', name: '고급스러운', emoji: '✨' }
  ];

  const generateContent = async () => {
    if (!targetAudience || !productInfo) {
      alert('타겟 오디언스와 제품 정보를 입력해주세요.');
      return;
    }

    setIsGenerating(true);

    // 실제 AI API 호출 대신 모의 데이터 생성
    setTimeout(() => {
      const mockContent: GeneratedContent[] = [
        {
          id: '1',
          type: selectedType,
          platform: selectedType === 'social_post' ? platform : undefined,
          content: generateMockContent(),
          hashtags: selectedType === 'social_post' ? generateHashtags() : undefined,
          title: selectedType === 'blog' ? '타피가 추천하는 마케팅 전략' : undefined,
          description: selectedType === 'ad_copy' ? '고객의 마음을 사로잡는 매력적인 제품' : undefined,
          cta: selectedType === 'ad_copy' ? '지금 바로 확인하기' : undefined,
          generatedAt: new Date()
        }
      ];

      setGeneratedContent(prev => [...mockContent, ...prev]);
      setIsGenerating(false);
    }, 2000);
  };

  const generateMockContent = () => {
    const contents = {
      social_post: {
        instagram: '🔥 새로운 제품이 출시되었어요! 여러분의 일상을 더욱 특별하게 만들어드릴게요. 지금 바로 확인해보세요! #새로운제품 #특별한혜택 #라이프스타일',
        facebook: '안녕하세요! 오늘은 여러분께 특별한 소식을 전해드릴게요. 새로운 제품이 출시되어 고객님들의 많은 관심을 받고 있습니다. 지금 바로 확인해보세요!',
        twitter: '새로운 제품 출시! 🎉 여러분의 일상을 더욱 편리하고 즐겁게 만들어드립니다. 지금 바로 확인해보세요! #새로운제품 #혁신',
        linkedin: '새로운 제품 출시를 알려드립니다. 고객의 니즈를 정확히 파악하여 개발한 이번 제품은 시장에서 큰 호응을 얻고 있습니다. #제품출시 #마케팅'
      },
      ad_copy: {
        title: '당신의 일상을 바꿔드립니다',
        description: '혁신적인 기술로 만든 새로운 제품으로 더욱 편리하고 즐거운 일상을 경험해보세요.',
        cta: '지금 바로 확인하기'
      },
      email: {
        subject: '특별한 혜택을 놓치지 마세요!',
        content: '안녕하세요! 오늘은 여러분께 특별한 소식을 전해드릴게요. 새로운 제품이 출시되어 고객님들의 많은 관심을 받고 있습니다. 지금 바로 확인해보세요!'
      },
      blog: {
        title: '타피가 추천하는 마케팅 전략',
        content: '오늘은 효과적인 마케팅 전략에 대해 알아보겠습니다. 고객의 니즈를 정확히 파악하고 그에 맞는 메시지를 전달하는 것이 중요합니다.'
      }
    };

    if (selectedType === 'social_post') {
      return contents.social_post[platform as keyof typeof contents.social_post] || contents.social_post.instagram;
    } else if (selectedType === 'ad_copy') {
      return `${contents.ad_copy.title}\n\n${contents.ad_copy.description}\n\n${contents.ad_copy.cta}`;
    } else if (selectedType === 'email') {
      return contents.email.content;
    } else {
      return contents.blog.content;
    }
  };

  const generateHashtags = () => {
    const hashtags = [
      '#새로운제품', '#특별한혜택', '#라이프스타일', '#혁신', '#마케팅', 
      '#고객만족', '#품질보증', '#트렌드', '#추천', '#인기상품'
    ];
    return hashtags.slice(0, 5);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('클립보드에 복사되었습니다!');
  };

  const downloadContent = (content: GeneratedContent) => {
    const blob = new Blob([content.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${content.type}_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
            <Sparkles size={24} className="text-white" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-400 rounded-full opacity-80"></div>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI 콘텐츠 생성기</h1>
          <p className="text-gray-600 dark:text-gray-400">타피가 마케팅 콘텐츠를 자동으로 생성해드려요</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 설정 패널 */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">콘텐츠 유형</h3>
            <div className="space-y-3">
              {contentTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id as any)}
                    className={`w-full p-4 rounded-lg border-2 transition-all ${
                      selectedType === type.id
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-orange-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon size={20} className="text-orange-500" />
                      <div className="text-left">
                        <div className="font-medium text-gray-900 dark:text-white">{type.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{type.description}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedType === 'social_post' && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">플랫폼 선택</h3>
              <div className="grid grid-cols-2 gap-3">
                {platforms.map((platform) => (
                  <button
                    key={platform.id}
                    onClick={() => setPlatform(platform.id)}
                    className={`p-3 rounded-lg text-white font-medium transition-all ${
                      platform.id === platform
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-800'
                        : 'opacity-80 hover:opacity-100'
                    } ${platform.color}`}
                  >
                    {platform.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">콘텐츠 설정</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  타겟 오디언스
                </label>
                <textarea
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="예: 20-30대 여성, 패션에 관심이 많은 직장인"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  제품/서비스 정보
                </label>
                <textarea
                  value={productInfo}
                  onChange={(e) => setProductInfo(e.target.value)}
                  placeholder="예: 새로운 스마트폰, 혁신적인 기능, 합리적인 가격"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  톤앤매너
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {tones.map((tone) => (
                    <button
                      key={tone.id}
                      onClick={() => setTone(tone.id)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        tone.id === tone
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-orange-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span>{tone.emoji}</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{tone.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={generateContent}
            disabled={isGenerating || !targetAudience || !productInfo}
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>생성 중...</span>
              </>
            ) : (
              <>
                <Wand2 size={20} />
                <span>콘텐츠 생성하기</span>
              </>
            )}
          </button>
        </div>

        {/* 생성된 콘텐츠 */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">생성된 콘텐츠</h3>
            {generatedContent.length > 0 && (
              <button
                onClick={() => setGeneratedContent([])}
                className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                모두 지우기
              </button>
            )}
          </div>

          {generatedContent.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <Sparkles size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                콘텐츠를 생성해보세요
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                왼쪽 설정을 완료하고 "콘텐츠 생성하기" 버튼을 클릭하세요
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {generatedContent.map((content, index) => (
                <div key={content.id} className="card">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                        <Sparkles size={16} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {contentTypes.find(t => t.id === content.type)?.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {content.generatedAt.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => copyToClipboard(content.content)}
                        className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <Copy size={16} />
                      </button>
                      <button
                        onClick={() => downloadContent(content)}
                        className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <Download size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {content.title && (
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">제목</label>
                        <p className="text-gray-900 dark:text-white">{content.title}</p>
                      </div>
                    )}
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">콘텐츠</label>
                      <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{content.content}</p>
                    </div>

                    {content.hashtags && (
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">해시태그</label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {content.hashtags.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="px-2 py-1 bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400 rounded text-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIContentGenerator; 
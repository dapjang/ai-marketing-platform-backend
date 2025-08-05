import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Play, 
  Pause, 
  Eye, 
  Calendar, 
  DollarSign, 
  Users, 
  Target, 
  BarChart3, 
  TrendingUp,
  Sparkles,
  MessageCircle,
  Share2,
  Download
} from 'lucide-react';
import { campaignAPI } from '../services/api';

interface Campaign {
  id: string;
  title: string;
  description: string;
  status: string;
  campaign_type: string;
  budget: number;
  start_date: string;
  end_date: string;
  target_audience: any;
  ai_generated_content?: any;
  created_at: string;
  updated_at: string;
}

const CampaignDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (id) {
      fetchCampaignDetail();
    }
  }, [id]);

  const fetchCampaignDetail = async () => {
    try {
      setLoading(true);
      // 실제 API 호출로 변경 필요
      const mockCampaign: Campaign = {
        id: id || '1',
        title: '여름 시즌 프로모션',
        description: '여름 시즌을 맞아 고객들에게 특별한 혜택을 제공하는 마케팅 캠페인입니다.',
        status: 'active',
        campaign_type: 'social_media',
        budget: 5000000,
        start_date: '2025-06-01',
        end_date: '2025-08-31',
        target_audience: {
          ageRange: '20-40',
          gender: 'all',
          interests: ['패션', '여행', '음식'],
          location: '전국'
        },
        ai_generated_content: {
          posts: [
            {
              platform: 'instagram',
              content: '🔥 여름이 왔어요! 시원한 아이스크림과 함께하는 특별한 혜택을 놓치지 마세요! #여름프로모션 #특별혜택',
              hashtags: ['#여름프로모션', '#특별혜택', '#아이스크림']
            },
            {
              platform: 'facebook',
              content: '여름 시즌 특별 이벤트! 고객 여러분을 위한 특별한 할인 혜택을 준비했습니다. 지금 바로 확인해보세요!',
              hashtags: ['#여름이벤트', '#특별할인', '#고객혜택']
            }
          ],
          ads: [
            {
              type: 'display',
              headline: '여름 시즌 특별 혜택',
              description: '시원한 여름을 더욱 특별하게! 지금 바로 확인하세요.',
              cta: '자세히 보기'
            }
          ]
        },
        created_at: '2025-06-01T00:00:00Z',
        updated_at: '2025-06-15T00:00:00Z'
      };
      setCampaign(mockCampaign);
    } catch (error) {
      console.error('캠페인 상세 정보 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!campaign) return;
    
    try {
      await campaignAPI.updateCampaignStatus(campaign.id, newStatus);
      setCampaign({ ...campaign, status: newStatus });
    } catch (error) {
      console.error('캠페인 상태 업데이트 실패:', error);
    }
  };

  const handleDelete = async () => {
    if (!campaign || !window.confirm('정말로 이 캠페인을 삭제하시겠습니까?')) return;
    
    try {
      await campaignAPI.deleteCampaign(campaign.id);
      navigate('/campaigns');
    } catch (error) {
      console.error('캠페인 삭제 실패:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'paused': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '진행중';
      case 'paused': return '일시정지';
      case 'completed': return '완료';
      case 'draft': return '초안';
      default: return status;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">캠페인을 찾을 수 없습니다</h2>
        <button
          onClick={() => navigate('/campaigns')}
          className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
        >
          캠페인 목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/campaigns')}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{campaign.title}</h1>
            <p className="text-gray-600 dark:text-gray-400">캠페인 상세 정보</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(campaign.status)}`}>
            {getStatusText(campaign.status)}
          </span>
          <button
            onClick={() => handleStatusUpdate(campaign.status === 'active' ? 'paused' : 'active')}
            className={`p-2 rounded-lg transition-colors ${
              campaign.status === 'active' 
                ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400' 
                : 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
            }`}
          >
            {campaign.status === 'active' ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button className="p-2 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors">
            <Edit size={20} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 rounded-lg bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', name: '개요', icon: Eye },
            { id: 'content', name: 'AI 콘텐츠', icon: Sparkles },
            { id: 'analytics', name: '분석', icon: BarChart3 },
            { id: 'audience', name: '타겟 오디언스', icon: Users }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Icon size={16} />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* 탭 콘텐츠 */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 기본 정보 */}
            <div className="space-y-6">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">기본 정보</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">설명</label>
                    <p className="text-gray-900 dark:text-white mt-1">{campaign.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">캠페인 유형</label>
                      <p className="text-gray-900 dark:text-white mt-1">{campaign.campaign_type}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">예산</label>
                      <p className="text-gray-900 dark:text-white mt-1">{formatCurrency(campaign.budget)}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">시작일</label>
                      <p className="text-gray-900 dark:text-white mt-1">{formatDate(campaign.start_date)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-400">종료일</label>
                      <p className="text-gray-900 dark:text-white mt-1">{formatDate(campaign.end_date)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 타겟 오디언스 */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">타겟 오디언스</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Users size={16} className="text-orange-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">연령대: {campaign.target_audience.ageRange}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target size={16} className="text-orange-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">성별: {campaign.target_audience.gender}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp size={16} className="text-orange-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">관심사: {campaign.target_audience.interests.join(', ')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar size={16} className="text-orange-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">지역: {campaign.target_audience.location}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 통계 */}
            <div className="space-y-6">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">캠페인 통계</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">1,234</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">조회수</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">567</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">참여수</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">45.9%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">전환율</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">₩2.3M</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">매출</div>
                  </div>
                </div>
              </div>

              {/* 타피의 조언 */}
              <div className="card bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-800">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                    <Sparkles size={16} className="text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">타피의 조언</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  이 캠페인은 좋은 성과를 보이고 있어요! 인스타그램 포스트의 참여율이 높으니 
                  더 많은 시각적 콘텐츠를 추가해보는 건 어떨까요?
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI 생성 콘텐츠</h3>
              <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                새 콘텐츠 생성
              </button>
            </div>

            {/* 소셜 미디어 포스트 */}
            <div className="card">
              <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">소셜 미디어 포스트</h4>
              <div className="space-y-4">
                {campaign.ai_generated_content?.posts?.map((post: any, index: number) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{post.platform === 'instagram' ? 'IG' : 'FB'}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{post.platform}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                          <Share2 size={16} />
                        </button>
                        <button className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                          <Download size={16} />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">{post.content}</p>
                    <div className="flex flex-wrap gap-1">
                      {post.hashtags.map((tag: string, tagIndex: number) => (
                        <span key={tagIndex} className="px-2 py-1 bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 광고 콘텐츠 */}
            <div className="card">
              <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">광고 콘텐츠</h4>
              <div className="space-y-4">
                {campaign.ai_generated_content?.ads?.map((ad: any, index: number) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{ad.type} 광고</span>
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                          <Share2 size={16} />
                        </button>
                        <button className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                          <Download size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{ad.headline}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{ad.description}</p>
                      <button className="px-4 py-2 bg-orange-500 text-white rounded text-sm hover:bg-orange-600 transition-colors">
                        {ad.cta}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">성과 분석</h3>
              <p className="text-gray-600 dark:text-gray-400">상세한 분석 차트가 여기에 표시됩니다.</p>
            </div>
          </div>
        )}

        {activeTab === 'audience' && (
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">타겟 오디언스 분석</h3>
              <p className="text-gray-600 dark:text-gray-400">오디언스 세그먼트 분석이 여기에 표시됩니다.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignDetail; 
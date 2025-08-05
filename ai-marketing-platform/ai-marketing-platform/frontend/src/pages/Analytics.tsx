import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Eye, 
  MousePointer, 
  Heart,
  Share2,
  Calendar,
  Target,
  Sparkles,
  Activity,
  PieChart,
  LineChart
} from 'lucide-react';

interface AnalyticsData {
  totalCampaigns: number;
  activeCampaigns: number;
  totalViews: number;
  totalClicks: number;
  totalEngagement: number;
  totalRevenue: number;
  conversionRate: number;
  ctr: number;
  engagementRate: number;
  roi: number;
  monthlyData: {
    month: string;
    views: number;
    clicks: number;
    revenue: number;
  }[];
  platformData: {
    platform: string;
    views: number;
    clicks: number;
    engagement: number;
  }[];
  campaignPerformance: {
    name: string;
    views: number;
    clicks: number;
    revenue: number;
    status: string;
  }[];
}

const Analytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedPeriod]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      // 실제 API 호출 대신 모의 데이터
      const mockData: AnalyticsData = {
        totalCampaigns: 12,
        activeCampaigns: 8,
        totalViews: 45678,
        totalClicks: 2345,
        totalEngagement: 1234,
        totalRevenue: 45678,
        conversionRate: 5.2,
        ctr: 2.1,
        engagementRate: 8.5,
        roi: 320,
        monthlyData: [
          { month: '1월', views: 12000, clicks: 650, revenue: 15000 },
          { month: '2월', views: 15000, clicks: 800, revenue: 18000 },
          { month: '3월', views: 18000, clicks: 950, revenue: 22000 },
          { month: '4월', views: 22000, clicks: 1100, revenue: 25000 },
          { month: '5월', views: 25000, clicks: 1250, revenue: 28000 },
          { month: '6월', views: 28000, clicks: 1400, revenue: 32000 }
        ],
        platformData: [
          { platform: 'Instagram', views: 18000, clicks: 900, engagement: 450 },
          { platform: 'Facebook', views: 15000, clicks: 750, engagement: 375 },
          { platform: 'Twitter', views: 8000, clicks: 400, engagement: 200 },
          { platform: 'LinkedIn', views: 4000, clicks: 200, engagement: 100 }
        ],
        campaignPerformance: [
          { name: '여름 시즌 프로모션', views: 8500, clicks: 425, revenue: 10200, status: 'active' },
          { name: '봄 신제품 출시', views: 7200, clicks: 360, revenue: 8640, status: 'active' },
          { name: '겨울 할인 이벤트', views: 6500, clicks: 325, revenue: 7800, status: 'completed' },
          { name: '가을 특별 혜택', views: 5800, clicks: 290, revenue: 6960, status: 'paused' }
        ]
      };
      
      setAnalyticsData(mockData);
    } catch (error) {
      console.error('분석 데이터 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ko-KR').format(num);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'paused': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'completed': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">분석 데이터를 불러올 수 없습니다</h2>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
              <BarChart3 size={24} className="text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-400 rounded-full opacity-80"></div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">캠페인 분석</h1>
            <p className="text-gray-600 dark:text-gray-400">타피가 분석한 마케팅 성과를 확인해보세요</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            <option value="7d">최근 7일</option>
            <option value="30d">최근 30일</option>
            <option value="90d">최근 90일</option>
            <option value="1y">최근 1년</option>
          </select>
        </div>
      </div>

      {/* 주요 지표 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Eye size={24} className="text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">총 조회수</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {formatNumber(analyticsData.totalViews)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <MousePointer size={24} className="text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">총 클릭수</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {formatNumber(analyticsData.totalClicks)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Heart size={24} className="text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">총 참여수</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {formatNumber(analyticsData.totalEngagement)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <DollarSign size={24} className="text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">총 매출</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {formatCurrency(analyticsData.totalRevenue)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 성과 지표 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">성과 지표</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Target size={16} className="text-orange-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">전환율</span>
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {analyticsData.conversionRate}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MousePointer size={16} className="text-orange-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">클릭률 (CTR)</span>
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {analyticsData.ctr}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Heart size={16} className="text-orange-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">참여율</span>
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {analyticsData.engagementRate}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp size={16} className="text-orange-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">ROI</span>
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {analyticsData.roi}%
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">타피의 분석</h3>
          <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                <Sparkles size={16} className="text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">성과 분석</h4>
            </div>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p>• 전환율이 목표 대비 15% 높습니다</p>
              <p>• Instagram에서 가장 높은 참여율을 보이고 있습니다</p>
              <p>• "여름 시즌 프로모션" 캠페인이 최고 성과를 기록했습니다</p>
              <p>• 다음 달 매출 예상: {formatCurrency(analyticsData.totalRevenue * 1.2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 월별 트렌드 */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">월별 트렌드</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">월</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">조회수</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">클릭수</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">매출</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.monthlyData.map((data, index) => (
                <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">{data.month}</td>
                  <td className="py-3 px-4 text-sm text-right text-gray-900 dark:text-white">
                    {formatNumber(data.views)}
                  </td>
                  <td className="py-3 px-4 text-sm text-right text-gray-900 dark:text-white">
                    {formatNumber(data.clicks)}
                  </td>
                  <td className="py-3 px-4 text-sm text-right text-gray-900 dark:text-white">
                    {formatCurrency(data.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 플랫폼별 성과 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">플랫폼별 성과</h3>
          <div className="space-y-4">
            {analyticsData.platformData.map((platform, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    index === 0 ? 'bg-blue-500' : 
                    index === 1 ? 'bg-green-500' : 
                    index === 2 ? 'bg-purple-500' : 'bg-orange-500'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {platform.platform}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    조회 {formatNumber(platform.views)} | 클릭 {formatNumber(platform.clicks)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">캠페인 성과</h3>
          <div className="space-y-4">
            {analyticsData.campaignPerformance.map((campaign, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">{campaign.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                    {campaign.status === 'active' ? '진행중' : 
                     campaign.status === 'paused' ? '일시정지' : '완료'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600 dark:text-gray-400">조회수</div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {formatNumber(campaign.views)}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600 dark:text-gray-400">클릭수</div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {formatNumber(campaign.clicks)}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600 dark:text-gray-400">매출</div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(campaign.revenue)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BarChart3, Users, Target, TrendingUp, Sparkles, MessageCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    {
      name: '활성 캠페인',
      value: '12',
      change: '+2.5%',
      changeType: 'positive',
      icon: Target,
    },
    {
      name: '총 고객',
      value: '1,234',
      change: '+12.3%',
      changeType: 'positive',
      icon: Users,
    },
    {
      name: '월 매출',
      value: '₩45,678,000',
      change: '+8.1%',
      changeType: 'positive',
      icon: TrendingUp,
    },
    {
      name: '전환율',
      value: '3.2%',
      change: '+0.5%',
      changeType: 'positive',
      icon: BarChart3,
    },
  ];

  return (
    <div className="space-y-6">
      {/* 환영 메시지 */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg p-6 border border-orange-200 dark:border-orange-800">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
              <Sparkles size={32} className="text-white" />
            </div>
            {/* 타피 캐릭터의 안경 효과 */}
            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-blue-400 rounded-full opacity-80"></div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              안녕하세요, {user?.name}님! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              타피가 오늘의 마케팅 성과를 분석해드릴게요.
            </p>
          </div>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="card">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className={`text-sm ${
                    stat.changeType === 'positive' 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {stat.change}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 최근 활동 */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            최근 활동
          </h3>
          <div className="flex items-center space-x-2">
            <MessageCircle size={16} className="text-orange-500" />
            <span className="text-sm text-orange-600 dark:text-orange-400">타피의 메시지</span>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              새로운 캠페인 "여름 세일"이 생성되었습니다.
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              "봄 프로모션" 캠페인이 완료되었습니다.
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              고객 반응률이 15% 증가했습니다.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 
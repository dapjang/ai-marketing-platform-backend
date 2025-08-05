import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BarChart3, Users, Target, TrendingUp } from 'lucide-react';

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
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          안녕하세요, {user?.name}님!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          오늘의 마케팅 성과를 확인해보세요.
        </p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="card">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon className="h-8 w-8 text-blue-600" />
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
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          최근 활동
        </h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
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
              AI 콘텐츠가 "신제품 출시" 캠페인에 생성되었습니다.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 
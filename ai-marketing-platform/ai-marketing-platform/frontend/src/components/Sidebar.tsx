import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BarChart3, Users, Settings, Calendar, Target, TrendingUp, Sparkles, Wand2 } from 'lucide-react';

const Sidebar: React.FC = () => {
  const navigation = [
    { name: '대시보드', href: '/', icon: Home },
    { name: '캠페인', href: '/campaigns', icon: Target },
    { name: 'AI 콘텐츠 생성기', href: '/ai-content', icon: Wand2 },
    { name: '분석', href: '/analytics', icon: BarChart3 },
    { name: '고객', href: '/customers', icon: Users },
    { name: '일정', href: '/schedule', icon: Calendar },
    { name: '성과', href: '/performance', icon: TrendingUp },
    { name: '설정', href: '/settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700">
      {/* 타피 캐릭터 섹션 */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg">
              <Sparkles size={24} className="text-white" />
            </div>
            {/* 타피 캐릭터의 안경 효과 */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-400 rounded-full opacity-80"></div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">타피</h3>
            <p className="text-xs text-orange-600 dark:text-orange-400">AI 마케팅 어시스턴트</p>
          </div>
        </div>
      </div>

      <nav className="mt-5 px-2">
        <div className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border-l-4 border-orange-500'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }`
                }
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar; 
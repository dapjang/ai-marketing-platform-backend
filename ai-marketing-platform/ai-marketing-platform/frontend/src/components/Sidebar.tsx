import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BarChart3, Users, Settings, Calendar, Target, TrendingUp } from 'lucide-react';

const Sidebar: React.FC = () => {
  const navigation = [
    { name: '대시보드', href: '/', icon: Home },
    { name: '캠페인', href: '/campaigns', icon: Target },
    { name: '분석', href: '/analytics', icon: BarChart3 },
    { name: '고객', href: '/customers', icon: Users },
    { name: '일정', href: '/schedule', icon: Calendar },
    { name: '성과', href: '/performance', icon: TrendingUp },
    { name: '설정', href: '/settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700">
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
                      ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
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
import React, { useState } from 'react';
import { Plus, Search, Filter, MoreVertical } from 'lucide-react';

const Campaigns: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const campaigns = [
    {
      id: '1',
      title: '여름 세일 캠페인',
      status: 'active',
      type: 'social',
      budget: '₩5,000,000',
      spent: '₩2,300,000',
      startDate: '2024-06-01',
      endDate: '2024-08-31',
      performance: {
        reach: '125,000',
        clicks: '12,500',
        conversions: '1,250',
        ctr: '10%',
      },
    },
    {
      id: '2',
      title: '신제품 출시',
      status: 'draft',
      type: 'content',
      budget: '₩3,000,000',
      spent: '₩0',
      startDate: '2024-07-15',
      endDate: '2024-09-15',
      performance: {
        reach: '0',
        clicks: '0',
        conversions: '0',
        ctr: '0%',
      },
    },
    {
      id: '3',
      title: '봄 프로모션',
      status: 'completed',
      type: 'email',
      budget: '₩2,000,000',
      spent: '₩2,000,000',
      startDate: '2024-03-01',
      endDate: '2024-05-31',
      performance: {
        reach: '85,000',
        clicks: '8,500',
        conversions: '850',
        ctr: '10%',
      },
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '진행중';
      case 'draft':
        return '초안';
      case 'completed':
        return '완료';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            캠페인 관리
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            마케팅 캠페인을 관리하고 성과를 추적하세요.
          </p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Plus size={20} />
          <span>새 캠페인</span>
        </button>
      </div>

      {/* 검색 및 필터 */}
      <div className="flex space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="캠페인 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10 w-full"
          />
        </div>
        <button className="btn-secondary flex items-center space-x-2">
          <Filter size={20} />
          <span>필터</span>
        </button>
      </div>

      {/* 캠페인 목록 */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  캠페인
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  예산
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  성과
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  기간
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">작업</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {campaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {campaign.title}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {campaign.type}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
                      {getStatusText(campaign.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {campaign.budget}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      사용: {campaign.spent}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      도달: {campaign.performance.reach}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      CTR: {campaign.performance.ctr}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {campaign.startDate} ~ {campaign.endDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Campaigns; 
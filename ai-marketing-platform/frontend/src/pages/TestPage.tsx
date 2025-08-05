import React, { useState } from 'react';
import api from '../services/api';

const TestPage: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testBackendConnection = async () => {
    setIsLoading(true);
    setTestResult('');
    
    try {
      // 헬스 체크 테스트
      const healthResponse = await fetch('http://localhost:3000/health');
      const healthData = await healthResponse.json();
      
      // API 테스트
      const apiResponse = await api.get('/auth/profile');
      
      setTestResult(`✅ 백엔드 연결 성공!\n\n헬스 체크: ${JSON.stringify(healthData, null, 2)}\n\nAPI 응답: ${JSON.stringify(apiResponse.data, null, 2)}`);
    } catch (error: any) {
      setTestResult(`❌ 백엔드 연결 실패: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          AI 마케팅 플랫폼 테스트
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          백엔드 서버 연결을 테스트합니다.
        </p>
        
        <button
          onClick={testBackendConnection}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md transition duration-200"
        >
          {isLoading ? '테스트 중...' : '백엔드 연결 테스트'}
        </button>
        
        {testResult && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md">
            <pre className="text-sm text-gray-800 whitespace-pre-wrap">
              {testResult}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestPage; 
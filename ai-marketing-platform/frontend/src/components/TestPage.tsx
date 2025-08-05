import React, { useState } from 'react';

const TestPage: React.FC = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const testBackend = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/health');
      const data = await response.json();
      setMessage(`백엔드 연결 성공: ${JSON.stringify(data)}`);
    } catch (error) {
      setMessage(`백엔드 연결 실패: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            AI 마케팅 플랫폼 테스트
          </h1>
          <p className="text-gray-600 mb-8">
            백엔드 서버 연결을 테스트합니다.
          </p>
          
          <button
            onClick={testBackend}
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? '테스트 중...' : '백엔드 연결 테스트'}
          </button>
          
          {message && (
            <div className="mt-4 p-4 bg-white rounded-lg border">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                {message}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestPage; 
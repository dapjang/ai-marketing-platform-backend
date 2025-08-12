import React, { useState, useEffect } from 'react';
import './App.css';

interface User {
  id: string;
  email: string;
  name: string;
}

function App() {
  const [stats, setStats] = useState({
    campaigns: 0,
    content: 0,
    views: 0,
    engagement: 0
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ email: '', password: '', confirmPassword: '', name: '' });
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // 토큰이 있으면 자동 로그인
  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token]);

  // 프로필 조회
  const fetchProfile = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        fetchStats();
      } else {
        // 토큰이 유효하지 않으면 로그아웃
        logout();
      }
    } catch (error) {
      console.error('프로필 조회 오류:', error);
      logout();
    }
  };

  // 통계 조회
  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // 캠페인 수 조회
      const campaignsResponse = await fetch('http://localhost:5000/api/campaigns', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // AI 콘텐츠 수 조회
      const contentResponse = await fetch('http://localhost:5000/api/ai-content', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const campaigns = campaignsResponse.ok ? await campaignsResponse.json() : { campaigns: [] };
      const contents = contentResponse.ok ? await contentResponse.json() : { contents: [] };
      
      setStats({
        campaigns: campaigns.campaigns.length,
        content: contents.contents.length,
        views: 1250,
        engagement: 89
      });
      
      setMessage('백엔드 API 연결 성공');
    } catch (error) {
      console.error('백엔드 연결 실패:', error);
      setMessage('백엔드 연결 실패 - 모의 데이터 사용 중');
      setStats({
        campaigns: 12,
        content: 45,
        views: 1250,
        engagement: 89
      });
    } finally {
      setLoading(false);
    }
  };

  // 로그인
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData)
      });
      
      if (response.ok) {
        const data = await response.json();
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        setMessage('로그인이 완료되었습니다');
        setShowLogin(false);
        setLoginData({ email: '', password: '' });
      } else {
        const error = await response.json();
        setMessage(error.message);
      }
    } catch (error) {
      console.error('로그인 오류:', error);
      setMessage('로그인 중 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  };

  // 회원가입
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 비밀번호 확인 검증
    if (registerData.password !== registerData.confirmPassword) {
      setMessage('비밀번호가 일치하지 않습니다');
      return;
    }
    
    // 전자약관 동의 확인
    if (!agreeToTerms) {
      setMessage('전자약관에 동의해주세요');
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: registerData.email,
          password: registerData.password,
          name: registerData.name
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        setMessage('회원가입이 완료되었습니다');
        setShowRegister(false);
        setRegisterData({ email: '', password: '', confirmPassword: '', name: '' });
        setAgreeToTerms(false);
      } else {
        const error = await response.json();
        setMessage(error.message);
      }
    } catch (error) {
      console.error('회원가입 오류:', error);
      setMessage('회원가입 중 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  };

  // 로그아웃
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    setMessage('로그아웃되었습니다');
  };

  // 캠페인 생성
  const handleCampaignCreate = async () => {
    if (!token) {
      setMessage('로그인이 필요합니다');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: '새로운 캠페인',
          description: 'AI 마케팅 플랫폼에서 생성된 캠페인'
        })
      });
      
      if (response.ok) {
        setMessage('캠페인이 성공적으로 생성되었습니다');
        fetchStats();
      } else {
        setMessage('캠페인 생성에 실패했습니다');
      }
    } catch (error) {
      console.error('캠페인 생성 오류:', error);
      setMessage('캠페인 생성 중 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  };

  // AI 콘텐츠 생성
  const handleContentGenerate = async () => {
    if (!token) {
      setMessage('로그인이 필요합니다');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/ai-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          type: 'social_media',
          platform: 'instagram',
          targetAudience: '젊은 층',
          productInfo: 'AI 마케팅 플랫폼',
          tone: '친근하고 전문적'
        })
      });
      
      if (response.ok) {
        setMessage('AI 콘텐츠가 성공적으로 생성되었습니다');
        fetchStats();
      } else {
        setMessage('AI 콘텐츠 생성에 실패했습니다');
      }
    } catch (error) {
      console.error('AI 콘텐츠 생성 오류:', error);
      setMessage('AI 콘텐츠 생성 중 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>AI 마케팅 플랫폼</h1>
        <p>마케팅 캠페인과 콘텐츠를 관리하세요</p>
        
        {user ? (
          <div className="user-info">
            <span>안녕하세요, {user.name}님!</span>
            <button className="logout-button" onClick={logout}>로그아웃</button>
          </div>
        ) : (
          <div className="auth-buttons">
            <button className="auth-button" onClick={() => setShowLogin(true)}>로그인</button>
            <button className="auth-button" onClick={() => setShowRegister(true)}>회원가입</button>
          </div>
        )}
        
        {message && (
          <div className="message">
            {message}
          </div>
        )}
      </header>
      
      {!user ? (
        <main className="App-main">
          <div className="welcome-card">
            <h2>AI 마케팅 플랫폼에 오신 것을 환영합니다</h2>
            <p>로그인하여 캠페인과 콘텐츠를 관리하세요</p>
          </div>
        </main>
      ) : (
        <main className="App-main">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>캠페인 수</h3>
              <div className="stat-value">{stats.campaigns}</div>
            </div>
            <div className="stat-card">
              <h3>생성된 콘텐츠</h3>
              <div className="stat-value">{stats.content}</div>
            </div>
            <div className="stat-card">
              <h3>총 조회수</h3>
              <div className="stat-value">{stats.views.toLocaleString()}</div>
            </div>
            <div className="stat-card">
              <h3>참여율</h3>
              <div className="stat-value">{stats.engagement}%</div>
            </div>
          </div>

          <div className="action-cards">
            <div className="action-card">
              <h2>캠페인 관리</h2>
              <p>새로운 캠페인을 시작해보세요</p>
              <button 
                className="action-button" 
                onClick={handleCampaignCreate}
                disabled={loading}
              >
                {loading ? '처리 중...' : '캠페인 생성'}
              </button>
            </div>
            <div className="action-card">
              <h2>AI 콘텐츠 생성</h2>
              <p>AI로 마케팅 콘텐츠를 생성하세요</p>
              <button 
                className="action-button" 
                onClick={handleContentGenerate}
                disabled={loading}
              >
                {loading ? '처리 중...' : '콘텐츠 생성'}
              </button>
            </div>
          </div>
        </main>
      )}

      {/* 로그인 모달 */}
      {showLogin && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>로그인</h2>
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="이메일"
                value={loginData.email}
                onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                required
              />
              <input
                type="password"
                placeholder="비밀번호"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                required
              />
              <div className="modal-buttons">
                <button type="submit" disabled={loading}>
                  {loading ? '로그인 중...' : '로그인'}
                </button>
                <button type="button" onClick={() => setShowLogin(false)}>
                  취소
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 회원가입 모달 */}
      {showRegister && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>회원가입</h2>
            <form onSubmit={handleRegister}>
              <input
                type="text"
                placeholder="이름"
                value={registerData.name}
                onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                required
              />
              <input
                type="email"
                placeholder="이메일"
                value={registerData.email}
                onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                required
              />
              <input
                type="password"
                placeholder="비밀번호"
                value={registerData.password}
                onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                required
              />
              <input
                type="password"
                placeholder="비밀번호 확인"
                value={registerData.confirmPassword}
                onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                required
              />
              <div className="terms-checkbox">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  required
                />
                <label htmlFor="agreeToTerms">
                  <a href="#" onClick={(e) => { e.preventDefault(); alert('개인정보처리방침\n\n1. 개인정보 수집 및 이용 목적\n- 회원가입 및 서비스 제공\n- 고객상담 및 문의응답\n\n2. 수집하는 개인정보 항목\n- 이름, 이메일, 비밀번호\n\n3. 개인정보 보유 및 이용기간\n- 회원탈퇴 시까지\n\n4. 동의 거부권\n- 동의 거부 시 회원가입이 제한됩니다.'); }}>
                    전자약관 및 개인정보처리방침에 동의합니다
                  </a>
                </label>
              </div>
              <div className="modal-buttons">
                <button type="submit" disabled={loading}>
                  {loading ? '회원가입 중...' : '회원가입'}
                </button>
                <button type="button" onClick={() => setShowRegister(false)}>
                  취소
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

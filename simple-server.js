const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'your-secret-key-change-in-production';

// SQLite 데이터베이스 연결
const dbPath = path.join(__dirname, 'marketing_platform.db');
const db = new sqlite3.Database(dbPath);

// 데이터베이스 초기화
const initDatabase = () => {
  db.serialize(() => {
    // 사용자 테이블 생성
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // 캠페인 테이블 생성
    db.run(`CREATE TABLE IF NOT EXISTS campaigns (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'draft',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`);

    // AI 콘텐츠 테이블 생성
    db.run(`CREATE TABLE IF NOT EXISTS ai_content (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      type TEXT NOT NULL,
      platform TEXT,
      content TEXT NOT NULL,
      hashtags TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`);

    console.log('데이터베이스 초기화 완료');
  });
};

// JWT 토큰 검증 미들웨어
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: '인증 토큰이 필요합니다.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
    }
    req.user = user;
    next();
  });
};

// 미들웨어
app.use(cors());
app.use(express.json());

// 헬스 체크
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'AI 마케팅 플랫폼 서버가 정상적으로 실행 중입니다.',
    timestamp: new Date().toISOString()
  });
});

// 메인 페이지
app.get('/', (req, res) => {
  res.json({
    message: 'AI 마케팅 플랫폼 서버가 실행 중입니다!',
    timestamp: new Date().toISOString()
  });
});

// 회원가입 API
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({ message: '이메일, 비밀번호, 이름을 모두 입력해주세요.' });
    }

    // 이메일 중복 확인
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        console.error('사용자 조회 오류:', err);
        return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
      }

      if (user) {
        return res.status(400).json({ message: '이미 존재하는 이메일입니다.' });
      }

      // 비밀번호 해시화
      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = Date.now().toString();

      // 사용자 생성
      const stmt = db.prepare('INSERT INTO users (id, email, password_hash, name) VALUES (?, ?, ?, ?)');
      stmt.run(userId, email, hashedPassword, name, (err) => {
        if (err) {
          console.error('사용자 생성 오류:', err);
          return res.status(500).json({ message: '회원가입 중 오류가 발생했습니다.' });
        }

        // JWT 토큰 생성
        const token = jwt.sign({ userId, email, name }, JWT_SECRET, { expiresIn: '24h' });

        res.status(201).json({
          message: '회원가입이 완료되었습니다!',
          token,
          user: { id: userId, email, name }
        });
      });
      stmt.finalize();
    });
  } catch (error) {
    console.error('회원가입 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 로그인 API
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: '이메일과 비밀번호를 입력해주세요.' });
    }

    // 사용자 조회
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        console.error('사용자 조회 오류:', err);
        return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
      }

      if (!user) {
        return res.status(400).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
      }

      // 비밀번호 확인
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        return res.status(400).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
      }

      // JWT 토큰 생성
      const token = jwt.sign({ userId: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '24h' });

      res.json({
        message: '로그인이 완료되었습니다!',
        token,
        user: { id: user.id, email: user.email, name: user.name }
      });
    });
  } catch (error) {
    console.error('로그인 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 프로필 조회 API
app.get('/api/auth/profile', authenticateToken, (req, res) => {
  try {
    db.get('SELECT id, email, name, role, created_at FROM users WHERE id = ?', [req.user.userId], (err, user) => {
      if (err) {
        console.error('프로필 조회 오류:', err);
        return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
      }

      if (!user) {
        return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
      }

      res.json({ user });
    });
  } catch (error) {
    console.error('프로필 조회 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 캠페인 생성 API (인증 필요)
app.post('/api/campaigns', authenticateToken, (req, res) => {
  try {
    const { title, description } = req.body;
    const id = Date.now().toString();
    const userId = req.user.userId;
    
    console.log('캠페인 생성 요청:', { title, description, userId });
    
    const stmt = db.prepare('INSERT INTO campaigns (id, user_id, title, description) VALUES (?, ?, ?, ?)');
    stmt.run(id, userId, title || '새로운 캠페인', description || 'AI 마케팅 플랫폼에서 생성된 캠페인', (err) => {
      if (err) {
        console.error('캠페인 저장 오류:', err);
        res.status(500).json({ message: '캠페인 생성 중 오류가 발생했습니다.' });
      } else {
        const newCampaign = {
          id,
          user_id: userId,
          title: title || '새로운 캠페인',
          description: description || 'AI 마케팅 플랫폼에서 생성된 캠페인',
          status: 'draft',
          created_at: new Date().toISOString()
        };
        
        res.status(201).json({
          message: '캠페인이 성공적으로 생성되었습니다!',
          campaign: newCampaign
        });
      }
    });
    stmt.finalize();
  } catch (error) {
    console.error('캠페인 생성 오류:', error);
    res.status(500).json({ message: '캠페인 생성 중 오류가 발생했습니다.' });
  }
});

// AI 콘텐츠 생성 API (인증 필요)
app.post('/api/ai-content', authenticateToken, (req, res) => {
  try {
    const { type, platform, targetAudience, productInfo, tone } = req.body;
    const id = Date.now().toString();
    const userId = req.user.userId;
    
    console.log('AI 콘텐츠 생성 요청:', { type, platform, targetAudience, productInfo, tone, userId });
    
    // AI 콘텐츠 생성 (모의)
    const content = `${targetAudience || '타겟'}을 위한 ${productInfo || '제품'} 소개!\n\n${tone || '친근하고 전문적인'} 톤으로 작성된 마케팅 콘텐츠입니다.\n\n#마케팅 #AI #콘텐츠 #${platform || 'instagram'}`;
    const hashtags = JSON.stringify(['마케팅', 'AI', '콘텐츠', platform || 'instagram']);
    
    const stmt = db.prepare('INSERT INTO ai_content (id, user_id, type, platform, content, hashtags) VALUES (?, ?, ?, ?, ?, ?)');
    stmt.run(id, userId, type || 'social_media', platform || 'instagram', content, hashtags, (err) => {
      if (err) {
        console.error('AI 콘텐츠 저장 오류:', err);
        res.status(500).json({ message: 'AI 콘텐츠 생성 중 오류가 발생했습니다.' });
      } else {
        const generatedContent = {
          id,
          user_id: userId,
          type: type || 'social_media',
          platform: platform || 'instagram',
          content,
          hashtags: ['마케팅', 'AI', '콘텐츠', platform || 'instagram'],
          created_at: new Date().toISOString()
        };
        
        res.status(201).json({
          message: 'AI 콘텐츠가 성공적으로 생성되었습니다!',
          content: generatedContent
        });
      }
    });
    stmt.finalize();
  } catch (error) {
    console.error('AI 콘텐츠 생성 오류:', error);
    res.status(500).json({ message: 'AI 콘텐츠 생성 중 오류가 발생했습니다.' });
  }
});

// 캠페인 목록 조회 API (인증 필요)
app.get('/api/campaigns', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;
    db.all('SELECT * FROM campaigns WHERE user_id = ? ORDER BY created_at DESC', [userId], (err, rows) => {
      if (err) {
        console.error('캠페인 목록 조회 오류:', err);
        res.status(500).json({ message: '캠페인 목록 조회 중 오류가 발생했습니다.' });
      } else {
        res.json({ campaigns: rows || [] });
      }
    });
  } catch (error) {
    console.error('캠페인 목록 조회 오류:', error);
    res.status(500).json({ message: '캠페인 목록 조회 중 오류가 발생했습니다.' });
  }
});

// AI 콘텐츠 목록 조회 API (인증 필요)
app.get('/api/ai-content', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;
    db.all('SELECT * FROM ai_content WHERE user_id = ? ORDER BY created_at DESC', [userId], (err, rows) => {
      if (err) {
        console.error('AI 콘텐츠 목록 조회 오류:', err);
        res.status(500).json({ message: 'AI 콘텐츠 목록 조회 중 오류가 발생했습니다.' });
      } else {
        res.json({ contents: rows || [] });
      }
    });
  } catch (error) {
    console.error('AI 콘텐츠 목록 조회 오류:', error);
    res.status(500).json({ message: 'AI 콘텐츠 목록 조회 중 오류가 발생했습니다.' });
  }
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`헬스 체크: http://localhost:${PORT}/health`);
  console.log(`메인 페이지: http://localhost:${PORT}/`);
  console.log(`API 엔드포인트:`);
  console.log(`   - POST /api/auth/register (회원가입)`);
  console.log(`   - POST /api/auth/login (로그인)`);
  console.log(`   - GET /api/auth/profile (프로필 조회)`);
  console.log(`   - POST /api/campaigns (캠페인 생성)`);
  console.log(`   - GET /api/campaigns (캠페인 목록)`);
  console.log(`   - POST /api/ai-content (AI 콘텐츠 생성)`);
  console.log(`   - GET /api/ai-content (AI 콘텐츠 목록)`);
  
  // 데이터베이스 초기화
  initDatabase();
}); 
# AI 마케팅 플랫폼 백엔드

## 배포 정보

### Render.com 배포
- **서비스 타입**: Web Service
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Node.js 버전**: 18.x

### 환경 변수 설정
Render.com 대시보드에서 다음 환경 변수를 설정하세요:

```
DATABASE_HOST=nozomi.proxy.rlwy.net
DATABASE_USERNAME=root
DATABASE_PASSWORD=EvffpWdCDPVwZsXcHLVGJrrfEcsFaPpG
DATABASE_NAME=railway
DATABASE_PORT=32219
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=production
PORT=3000
```

### API 엔드포인트
- **헬스 체크**: `GET /health`
- **API 정보**: `GET /api`
- **인증**: `POST /api/auth/login`, `POST /api/auth/register`
- **캠페인**: `GET /api/campaigns`, `POST /api/campaigns`
- **AI 콘텐츠**: `GET /api/ai-content`

### 데이터베이스
- **타입**: MySQL (Railway)
- **연결**: Railway MySQL 인스턴스 사용 
import axios from 'axios';
import { LoginCredentials, RegisterData, AuthResponse, User } from '../types/auth';

// API 기본 설정
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 (토큰 자동 추가)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (에러 처리)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 토큰 만료 시 로그아웃
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 인증 API
export const authAPI = {
  // 로그인
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // 회원가입
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  // 프로필 조회
  getProfile: async (): Promise<{ user: User }> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // 프로필 수정
  updateProfile: async (data: Partial<User>): Promise<{ message: string; user: User }> => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },
};

// 캠페인 API
export const campaignAPI = {
  // 캠페인 목록 조회
  getCampaigns: async (params?: { status?: string; page?: number; limit?: number }) => {
    const response = await api.get('/campaigns', { params });
    return response.data;
  },

  // 캠페인 생성
  createCampaign: async (data: any) => {
    const response = await api.post('/campaigns', data);
    return response.data;
  },

  // 캠페인 조회
  getCampaign: async (id: string) => {
    const response = await api.get(`/campaigns/${id}`);
    return response.data;
  },

  // 캠페인 수정
  updateCampaign: async (id: string, data: any) => {
    const response = await api.put(`/campaigns/${id}`, data);
    return response.data;
  },

  // 캠페인 삭제
  deleteCampaign: async (id: string) => {
    const response = await api.delete(`/campaigns/${id}`);
    return response.data;
  },

  // 캠페인 상태 변경
  updateCampaignStatus: async (id: string, status: string) => {
    const response = await api.patch(`/campaigns/${id}/status`, { status });
    return response.data;
  },

  // AI 콘텐츠 업데이트
  updateAIContent: async (id: string, aiContent: any) => {
    const response = await api.patch(`/campaigns/${id}/ai-content`, { aiContent });
    return response.data;
  },
};

export default api; 
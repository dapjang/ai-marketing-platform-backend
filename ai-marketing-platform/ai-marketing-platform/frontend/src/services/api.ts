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

// 요청 인터셉터 - 토큰 추가
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

// 응답 인터셉터 - 토큰 만료 처리
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 인증 API
export const authAPI = {
  login: (credentials: LoginCredentials) => api.post<AuthResponse>('/auth/login', credentials),
  register: (data: RegisterData) => api.post<AuthResponse>('/auth/register', data),
  getProfile: () => api.get<{ user: User }>('/auth/profile'),
};

// 캠페인 API
export const campaignAPI = {
  getCampaigns: () => api.get('/campaigns'),
  createCampaign: (data: any) => api.post('/campaigns', data),
  getCampaign: (id: string) => api.get(`/campaigns/${id}`),
  updateCampaign: (id: string, data: any) => api.put(`/campaigns/${id}`, data),
  deleteCampaign: (id: string) => api.delete(`/campaigns/${id}`),
  updateCampaignStatus: (id: string, status: string) => api.patch(`/campaigns/${id}/status`, { status }),
  updateAIContent: (id: string, content: any) => api.patch(`/campaigns/${id}/ai-content`, content),
};

// AI 콘텐츠 API
export const aiContentAPI = {
  generateContent: (data: {
    type: string;
    platform?: string;
    targetAudience: string;
    productInfo: string;
    tone: string;
  }) => api.post('/ai-content', data),
  getContent: () => api.get('/ai-content'),
  getContentById: (id: string) => api.get(`/ai-content/${id}`),
  deleteContent: (id: string) => api.delete(`/ai-content/${id}`),
};

export default api; 
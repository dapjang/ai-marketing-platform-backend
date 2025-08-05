export interface User {
  _id: string;
  email: string;
  name: string;
  company?: string;
  role: 'admin' | 'marketer' | 'client';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Campaign {
  _id: string;
  title: string;
  description: string;
  targetAudience: string;
  budget: number;
  startDate: string;
  endDate: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  platform: string[];
  userId: string;
  aiGeneratedContent?: {
    copy: string;
    visuals: string[];
    strategy: string;
  };
  metrics?: {
    impressions: number;
    clicks: number;
    conversions: number;
    spend: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    current: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
} 
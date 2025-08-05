export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'marketer' | 'admin';
  company?: string;
  phone?: string;
  profileImage?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  company?: string;
  phone?: string;
  role?: 'user' | 'marketer' | 'admin';
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
} 
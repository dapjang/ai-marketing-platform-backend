import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// 사용자 인터페이스
export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: 'user' | 'marketer' | 'admin';
  company?: string;
  phone?: string;
  profileImage?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// 사용자 스키마
const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, '이메일은 필수입니다.'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, '유효한 이메일을 입력해주세요.']
  },
  password: {
    type: String,
    required: [true, '비밀번호는 필수입니다.'],
    minlength: [8, '비밀번호는 최소 8자 이상이어야 합니다.']
  },
  name: {
    type: String,
    required: [true, '이름은 필수입니다.'],
    trim: true,
    maxlength: [50, '이름은 50자 이하여야 합니다.']
  },
  role: {
    type: String,
    enum: {
      values: ['user', 'marketer', 'admin'],
      message: '유효하지 않은 역할입니다.'
    },
    default: 'user'
  },
  company: {
    type: String,
    trim: true,
    maxlength: [100, '회사명은 100자 이하여야 합니다.']
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[0-9-+\s()]+$/, '유효한 전화번호를 입력해주세요.']
  },
  profileImage: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 복합 인덱스 (성능 최적화)
userSchema.index({ email: 1 });
userSchema.index({ role: 1, isActive: 1 });
userSchema.index({ company: 1 });
userSchema.index({ createdAt: -1 });

// 가상 필드
userSchema.virtual('displayName').get(function() {
  return this.name || this.email.split('@')[0];
});

// 비밀번호 해시화 미들웨어
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// 비밀번호 비교 메서드
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('비밀번호 비교 중 오류가 발생했습니다.');
  }
};

// 사용자 모델
export const User = mongoose.model<IUser>('User', userSchema); 
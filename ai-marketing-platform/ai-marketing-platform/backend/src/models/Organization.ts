import mongoose, { Document, Schema } from 'mongoose';

// 조직 인터페이스
export interface IOrganization extends Document {
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  website?: string;
  industry?: string;
  size?: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  plan: 'free' | 'basic' | 'professional' | 'enterprise';
  settings: {
    features: {
      aiContent: boolean;
      analytics: boolean;
      teamCollaboration: boolean;
      apiAccess: boolean;
    };
    limits: {
      campaigns: number;
      teamMembers: number;
      storage: number;
      apiCalls: number;
    };
  };
  billing: {
    status: 'active' | 'suspended' | 'cancelled';
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    nextBillingDate: Date;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 조직 스키마
const organizationSchema = new Schema<IOrganization>({
  name: {
    type: String,
    required: [true, '조직명은 필수입니다.'],
    trim: true,
    maxlength: [100, '조직명은 100자 이하여야 합니다.']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[a-z0-9-]+$/, '슬러그는 영문자, 숫자, 하이픈만 사용 가능합니다.']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, '설명은 500자 이하여야 합니다.']
  },
  logo: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true,
    match: [/^https?:\/\/.+/, '유효한 웹사이트 URL을 입력해주세요.']
  },
  industry: {
    type: String,
    trim: true,
    maxlength: [50, '산업은 50자 이하여야 합니다.']
  },
  size: {
    type: String,
    enum: {
      values: ['startup', 'small', 'medium', 'large', 'enterprise'],
      message: '유효하지 않은 조직 크기입니다.'
    }
  },
  plan: {
    type: String,
    enum: {
      values: ['free', 'basic', 'professional', 'enterprise'],
      message: '유효하지 않은 플랜입니다.'
    },
    default: 'free'
  },
  settings: {
    features: {
      aiContent: { type: Boolean, default: true },
      analytics: { type: Boolean, default: false },
      teamCollaboration: { type: Boolean, default: false },
      apiAccess: { type: Boolean, default: false }
    },
    limits: {
      campaigns: { type: Number, default: 5 },
      teamMembers: { type: Number, default: 1 },
      storage: { type: Number, default: 100 }, // MB
      apiCalls: { type: Number, default: 1000 }
    }
  },
  billing: {
    status: {
      type: String,
      enum: {
        values: ['active', 'suspended', 'cancelled'],
        message: '유효하지 않은 결제 상태입니다.'
      },
      default: 'active'
    },
    currentPeriodStart: { type: Date },
    currentPeriodEnd: { type: Date },
    nextBillingDate: { type: Date }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 인덱스 (성능 최적화)
organizationSchema.index({ slug: 1 });
organizationSchema.index({ plan: 1, isActive: 1 });
organizationSchema.index({ 'billing.status': 1 });
organizationSchema.index({ createdAt: -1 });

// 가상 필드
organizationSchema.virtual('memberCount').get(function() {
  // 실제 멤버 수는 별도 쿼리로 계산
  return 0;
});

// 조직 모델
export const Organization = mongoose.model<IOrganization>('Organization', organizationSchema); 
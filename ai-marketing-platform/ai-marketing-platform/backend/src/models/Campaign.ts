import mongoose, { Document, Schema } from 'mongoose';

// 캠페인 인터페이스
export interface ICampaign extends Document {
  organizationId: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  title: string;
  description: string;
  type: 'social' | 'email' | 'content' | 'advertising' | 'event' | 'influencer';
  status: 'draft' | 'review' | 'approved' | 'active' | 'paused' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // 타겟팅 정보
  targetAudience: {
    demographics: {
      ageRange?: { min: number; max: number };
      gender?: string[];
      location?: string[];
      interests?: string[];
    };
    behavior: {
      purchaseHistory?: boolean;
      engagementLevel?: 'low' | 'medium' | 'high';
      loyaltyStatus?: string[];
    };
    size: number;
  };
  
  // 예산 및 일정
  budget: {
    total: number;
    currency: string;
    spent: number;
    remaining: number;
    breakdown: {
      creative: number;
      media: number;
      tools: number;
      other: number;
    };
  };
  
  schedule: {
    startDate: Date;
    endDate: Date;
    timezone: string;
    milestones: Array<{
      name: string;
      date: Date;
      status: 'pending' | 'completed' | 'delayed';
    }>;
  };
  
  // AI 콘텐츠
  aiContent: {
    generated: boolean;
    content: {
      headlines: string[];
      descriptions: string[];
      hashtags: string[];
      copy: string;
      images: Array<{
        url: string;
        alt: string;
        type: 'banner' | 'social' | 'ad';
      }>;
    };
    settings: {
      tone: 'professional' | 'casual' | 'friendly' | 'authoritative';
      language: string;
      brandVoice: string;
    };
    lastGenerated: Date;
  };
  
  // 성과 추적
  performance: {
    metrics: {
      reach: number;
      impressions: number;
      clicks: number;
      conversions: number;
      engagement: number;
      ctr: number;
      cpc: number;
      roas: number;
    };
    goals: {
      target: number;
      current: number;
      unit: string;
    };
    tracking: {
      pixelId?: string;
      conversionEvents: string[];
      customEvents: Array<{
        name: string;
        value: number;
        timestamp: Date;
      }>;
    };
  };
  
  // 팀 협업
  team: {
    members: Array<{
      userId: mongoose.Types.ObjectId;
      role: 'owner' | 'manager' | 'editor' | 'viewer';
      permissions: string[];
    }>;
    comments: Array<{
      userId: mongoose.Types.ObjectId;
      content: string;
      timestamp: Date;
      resolved: boolean;
    }>;
  };
  
  // 태그 및 분류
  tags: string[];
  category: string;
  
  // 메타데이터
  metadata: {
    source: string;
    version: number;
    lastModified: Date;
    modifiedBy: mongoose.Types.ObjectId;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

// 캠페인 스키마
const campaignSchema = new Schema<ICampaign>({
  organizationId: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
    required: [true, '조직 ID는 필수입니다.']
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, '생성자는 필수입니다.']
  },
  title: {
    type: String,
    required: [true, '제목은 필수입니다.'],
    trim: true,
    maxlength: [200, '제목은 200자 이하여야 합니다.']
  },
  description: {
    type: String,
    required: [true, '설명은 필수입니다.'],
    trim: true,
    maxlength: [2000, '설명은 2000자 이하여야 합니다.']
  },
  type: {
    type: String,
    enum: {
      values: ['social', 'email', 'content', 'advertising', 'event', 'influencer'],
      message: '유효하지 않은 캠페인 타입입니다.'
    },
    required: true
  },
  status: {
    type: String,
    enum: {
      values: ['draft', 'review', 'approved', 'active', 'paused', 'completed', 'cancelled'],
      message: '유효하지 않은 상태입니다.'
    },
    default: 'draft'
  },
  priority: {
    type: String,
    enum: {
      values: ['low', 'medium', 'high', 'urgent'],
      message: '유효하지 않은 우선순위입니다.'
    },
    default: 'medium'
  },
  targetAudience: {
    demographics: {
      ageRange: {
        min: { type: Number, min: 0, max: 120 },
        max: { type: Number, min: 0, max: 120 }
      },
      gender: [{ type: String, enum: ['male', 'female', 'other'] }],
      location: [String],
      interests: [String]
    },
    behavior: {
      purchaseHistory: Boolean,
      engagementLevel: {
        type: String,
        enum: ['low', 'medium', 'high']
      },
      loyaltyStatus: [String]
    },
    size: {
      type: Number,
      required: true,
      min: [1, '타겟 오디언스 크기는 1명 이상이어야 합니다.']
    }
  },
  budget: {
    total: {
      type: Number,
      required: true,
      min: [0, '예산은 0 이상이어야 합니다.']
    },
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'KRW', 'EUR', 'JPY']
    },
    spent: {
      type: Number,
      default: 0,
      min: 0
    },
    remaining: {
      type: Number,
      default: function() { return (this as any).total; }
    },
    breakdown: {
      creative: { type: Number, default: 0 },
      media: { type: Number, default: 0 },
      tools: { type: Number, default: 0 },
      other: { type: Number, default: 0 }
    }
  },
  schedule: {
    startDate: {
      type: Date,
      required: [true, '시작일은 필수입니다.']
    },
    endDate: {
      type: Date,
      required: [true, '종료일은 필수입니다.']
    },
    timezone: {
      type: String,
      default: 'UTC'
    },
    milestones: [{
      name: { type: String, required: true },
      date: { type: Date, required: true },
      status: {
        type: String,
        enum: ['pending', 'completed', 'delayed'],
        default: 'pending'
      }
    }]
  },
  aiContent: {
    generated: {
      type: Boolean,
      default: false
    },
    content: {
      headlines: [String],
      descriptions: [String],
      hashtags: [String],
      copy: String,
      images: [{
        url: { type: String, required: true },
        alt: String,
        type: {
          type: String,
          enum: ['banner', 'social', 'ad']
        }
      }]
    },
    settings: {
      tone: {
        type: String,
        enum: ['professional', 'casual', 'friendly', 'authoritative'],
        default: 'professional'
      },
      language: {
        type: String,
        default: 'ko'
      },
      brandVoice: String
    },
    lastGenerated: Date
  },
  performance: {
    metrics: {
      reach: { type: Number, default: 0 },
      impressions: { type: Number, default: 0 },
      clicks: { type: Number, default: 0 },
      conversions: { type: Number, default: 0 },
      engagement: { type: Number, default: 0 },
      ctr: { type: Number, default: 0 },
      cpc: { type: Number, default: 0 },
      roas: { type: Number, default: 0 }
    },
    goals: {
      target: { type: Number, required: true },
      current: { type: Number, default: 0 },
      unit: { type: String, required: true }
    },
    tracking: {
      pixelId: String,
      conversionEvents: [String],
      customEvents: [{
        name: { type: String, required: true },
        value: { type: Number, required: true },
        timestamp: { type: Date, default: Date.now }
      }]
    }
  },
  team: {
    members: [{
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      role: {
        type: String,
        enum: ['owner', 'manager', 'editor', 'viewer'],
        required: true
      },
      permissions: [String]
    }],
    comments: [{
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      content: {
        type: String,
        required: true,
        maxlength: [1000, '댓글은 1000자 이하여야 합니다.']
      },
      timestamp: {
        type: Date,
        default: Date.now
      },
      resolved: {
        type: Boolean,
        default: false
      }
    }]
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, '태그는 50자 이하여야 합니다.']
  }],
  category: {
    type: String,
    trim: true,
    maxlength: [100, '카테고리는 100자 이하여야 합니다.']
  },
  metadata: {
    source: {
      type: String,
      default: 'web'
    },
    version: {
      type: Number,
      default: 1
    },
    lastModified: {
      type: Date,
      default: Date.now
    },
    modifiedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 복합 인덱스 (성능 최적화)
campaignSchema.index({ organizationId: 1, status: 1 });
campaignSchema.index({ organizationId: 1, createdBy: 1 });
campaignSchema.index({ organizationId: 1, type: 1 });
campaignSchema.index({ organizationId: 1, 'schedule.startDate': 1 });
campaignSchema.index({ organizationId: 1, 'schedule.endDate': 1 });
campaignSchema.index({ tags: 1 });
campaignSchema.index({ category: 1 });
campaignSchema.index({ createdAt: -1 });

// 가상 필드
campaignSchema.virtual('duration').get(function() {
  if (this.schedule?.startDate && this.schedule?.endDate) {
    return Math.ceil((this.schedule.endDate.getTime() - this.schedule.startDate.getTime()) / (1000 * 60 * 60 * 24));
  }
  return 0;
});

campaignSchema.virtual('budgetUtilization').get(function() {
  if (this.budget?.total > 0) {
    return (this.budget.spent / this.budget.total) * 100;
  }
  return 0;
});

// 미들웨어
campaignSchema.pre('save', function(next) {
  // 예산 잔액 자동 계산
  if (this.budget) {
    this.budget.remaining = this.budget.total - this.budget.spent;
  }
  
  // 메타데이터 업데이트
  this.metadata.lastModified = new Date();
  this.metadata.version += 1;
  
  next();
});

// 캠페인 모델
export const Campaign = mongoose.model<ICampaign>('Campaign', campaignSchema); 
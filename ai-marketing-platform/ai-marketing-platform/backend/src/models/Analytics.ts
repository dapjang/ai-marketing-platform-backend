import mongoose, { Document, Schema } from 'mongoose';

// 분석 인터페이스
export interface IAnalytics extends Document {
  organizationId: mongoose.Types.ObjectId;
  campaignId?: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  
  // 이벤트 데이터
  event: {
    type: string;
    name: string;
    category: string;
    action: string;
    label?: string;
    value?: number;
    properties: Record<string, any>;
  };
  
  // 사용자 컨텍스트
  user: {
    id?: string;
    sessionId: string;
    device: {
      type: 'desktop' | 'mobile' | 'tablet';
      browser: string;
      os: string;
      userAgent: string;
    };
    location: {
      country?: string;
      region?: string;
      city?: string;
      ip?: string;
    };
  };
  
  // 페이지/화면 정보
  page: {
    url: string;
    title: string;
    referrer?: string;
    path: string;
  };
  
  // 성과 지표
  metrics: {
    timestamp: Date;
    duration?: number;
    loadTime?: number;
    errorCount?: number;
  };
  
  // AI 관련 데이터
  ai: {
    modelUsed?: string;
    promptTokens?: number;
    responseTokens?: number;
    cost?: number;
    accuracy?: number;
    feedback?: 'positive' | 'negative' | 'neutral';
  };
  
  // 메타데이터
  metadata: {
    source: string;
    version: string;
    environment: 'development' | 'staging' | 'production';
    processed: boolean;
  };
  
  createdAt: Date;
}

// 분석 스키마
const analyticsSchema = new Schema<IAnalytics>({
  organizationId: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
    required: [true, '조직 ID는 필수입니다.']
  },
  campaignId: {
    type: Schema.Types.ObjectId,
    ref: 'Campaign'
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  event: {
    type: {
      type: String,
      required: true,
      enum: ['pageview', 'click', 'conversion', 'error', 'performance', 'ai_interaction']
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    action: {
      type: String,
      required: true,
      trim: true
    },
    label: String,
    value: {
      type: Number,
      min: 0
    },
    properties: {
      type: Schema.Types.Mixed,
      default: {}
    }
  },
  user: {
    id: String,
    sessionId: {
      type: String,
      required: true
    },
    device: {
      type: {
        type: String,
        enum: ['desktop', 'mobile', 'tablet'],
        required: true
      },
      browser: {
        type: String,
        required: true
      },
      os: {
        type: String,
        required: true
      },
      userAgent: {
        type: String,
        required: true
      }
    },
    location: {
      country: String,
      region: String,
      city: String,
      ip: String
    }
  },
  page: {
    url: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    referrer: String,
    path: {
      type: String,
      required: true
    }
  },
  metrics: {
    timestamp: {
      type: Date,
      required: true,
      default: Date.now
    },
    duration: {
      type: Number,
      min: 0
    },
    loadTime: {
      type: Number,
      min: 0
    },
    errorCount: {
      type: Number,
      min: 0,
      default: 0
    }
  },
  ai: {
    modelUsed: String,
    promptTokens: {
      type: Number,
      min: 0
    },
    responseTokens: {
      type: Number,
      min: 0
    },
    cost: {
      type: Number,
      min: 0
    },
    accuracy: {
      type: Number,
      min: 0,
      max: 1
    },
    feedback: {
      type: String,
      enum: ['positive', 'negative', 'neutral']
    }
  },
  metadata: {
    source: {
      type: String,
      default: 'web'
    },
    version: {
      type: String,
      required: true
    },
    environment: {
      type: String,
      enum: ['development', 'staging', 'production'],
      default: 'production'
    },
    processed: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 복합 인덱스 (성능 최적화)
analyticsSchema.index({ organizationId: 1, 'event.timestamp': -1 });
analyticsSchema.index({ organizationId: 1, campaignId: 1 });
analyticsSchema.index({ organizationId: 1, 'event.type': 1 });
analyticsSchema.index({ organizationId: 1, 'event.category': 1 });
analyticsSchema.index({ 'user.sessionId': 1 });
analyticsSchema.index({ 'metrics.timestamp': -1 });
analyticsSchema.index({ 'metadata.processed': 1 });

// TTL 인덱스 (데이터 자동 삭제)
analyticsSchema.index({ 'metrics.timestamp': 1 }, { expireAfterSeconds: 7776000 }); // 90일

// 가상 필드
analyticsSchema.virtual('isConversion').get(function() {
  return this.event.type === 'conversion';
});

analyticsSchema.virtual('isError').get(function() {
  return this.event.type === 'error';
});

// 분석 모델
export const Analytics = mongoose.model<IAnalytics>('Analytics', analyticsSchema); 
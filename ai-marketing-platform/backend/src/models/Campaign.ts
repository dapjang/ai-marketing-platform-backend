import mongoose, { Document, Schema } from 'mongoose';

export interface ICampaign extends Document {
  title: string;
  description: string;
  targetAudience: string;
  budget: number;
  startDate: Date;
  endDate: Date;
  status: 'draft' | 'active' | 'paused' | 'completed';
  platform: string[];
  userId: mongoose.Types.ObjectId;
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
  createdAt: Date;
  updatedAt: Date;
}

const campaignSchema = new Schema<ICampaign>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  targetAudience: {
    type: String,
    required: true
  },
  budget: {
    type: Number,
    required: true,
    min: 0
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'completed'],
    default: 'draft'
  },
  platform: [{
    type: String,
    enum: ['facebook', 'instagram', 'google', 'twitter', 'linkedin', 'tiktok']
  }],
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  aiGeneratedContent: {
    copy: String,
    visuals: [String],
    strategy: String
  },
  metrics: {
    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    conversions: { type: Number, default: 0 },
    spend: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// 캠페인 기간 검증
campaignSchema.pre('save', function(next) {
  if (this.startDate >= this.endDate) {
    return next(new Error('시작일은 종료일보다 이전이어야 합니다.'));
  }
  next();
});

export const Campaign = mongoose.model<ICampaign>('Campaign', campaignSchema); 
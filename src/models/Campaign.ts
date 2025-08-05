import mongoose, { Document, Schema } from 'mongoose';

export interface ICampaign extends Document {
  title: string;
  description: string;
  userId: mongoose.Types.ObjectId;
  status: 'draft' | 'active' | 'paused' | 'completed' | 'archived';
  budget: number;
  targetAudience: {
    ageRange?: string;
    gender?: string;
    interests?: string[];
    location?: string;
  };
  startDate: Date;
  endDate: Date;
  aiContent: {
    generatedContent?: string;
    aiSuggestions?: string[];
    keywords?: string[];
  };
  performance: {
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
    required: true,
    trim: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'completed', 'archived'],
    default: 'draft'
  },
  budget: {
    type: Number,
    required: true,
    min: 0
  },
  targetAudience: {
    ageRange: String,
    gender: String,
    interests: [String],
    location: String
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  aiContent: {
    generatedContent: String,
    aiSuggestions: [String],
    keywords: [String]
  },
  performance: {
    impressions: {
      type: Number,
      default: 0
    },
    clicks: {
      type: Number,
      default: 0
    },
    conversions: {
      type: Number,
      default: 0
    },
    spend: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// 인덱스 설정
campaignSchema.index({ userId: 1, status: 1 });
campaignSchema.index({ startDate: 1, endDate: 1 });

export const Campaign = mongoose.model<ICampaign>('Campaign', campaignSchema); 
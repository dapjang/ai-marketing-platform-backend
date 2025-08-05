import mongoose, { Document, Schema } from 'mongoose';

export interface ICampaign extends Document {
  title: string;
  description: string;
  budget: number;
  targetAudience: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  userId: mongoose.Types.ObjectId;
  aiContent?: {
    copy: string;
    images: string[];
    socialMediaPosts: string[];
  };
  startDate?: Date;
  endDate?: Date;
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
  budget: {
    type: Number,
    required: true,
    min: 0
  },
  targetAudience: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'completed'],
    default: 'draft'
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  aiContent: {
    copy: String,
    images: [String],
    socialMediaPosts: [String]
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  }
}, {
  timestamps: true
});

// 날짜 유효성 검사
campaignSchema.pre('save', function(next) {
  if (this.startDate && this.endDate && this.startDate > this.endDate) {
    return next(new Error('시작일은 종료일보다 이전이어야 합니다.'));
  }
  next();
});

export const Campaign = mongoose.model<ICampaign>('Campaign', campaignSchema); 
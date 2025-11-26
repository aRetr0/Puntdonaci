import mongoose, { Schema, Document } from 'mongoose';

export interface ICampaign extends Document {
  title: string;
  description: string;
  shortDescription: string;
  longDescription: string;
  imageUrl: string;
  status: 'active' | 'upcoming' | 'completed' | 'cancelled';
  startDate: Date;
  endDate: Date;
  targetDonations: number;
  currentDonations: number;
  targetBloodTypes?: ('A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-')[];
  targetDonationType?: 'sang_total' | 'plaquetes' | 'plasma' | 'medul·la';
  priority: 'urgent' | 'high' | 'normal';
  bonusTokens?: number;
  requirements: string[];
  benefits: string[];
  participatingCenters: string[];
  createdAt: Date;
  updatedAt: Date;
}

const CampaignSchema = new Schema<ICampaign>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
      maxlength: 200,
    },
    longDescription: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['active', 'upcoming', 'completed', 'cancelled'],
      default: 'active',
      index: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    targetDonations: {
      type: Number,
      required: true,
      min: 1,
    },
    currentDonations: {
      type: Number,
      default: 0,
      min: 0,
    },
    targetBloodTypes: {
      type: [String],
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    targetDonationType: {
      type: String,
      enum: ['sang_total', 'plaquetes', 'plasma', 'medul·la'],
    },
    priority: {
      type: String,
      required: true,
      enum: ['urgent', 'high', 'normal'],
      default: 'normal',
    },
    bonusTokens: {
      type: Number,
      min: 0,
    },
    requirements: {
      type: [String],
      default: [],
    },
    benefits: {
      type: [String],
      default: [],
    },
    participatingCenters: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Index for active campaigns
CampaignSchema.index({ status: 1, endDate: -1 });

export const Campaign = mongoose.model<ICampaign>('Campaign', CampaignSchema);

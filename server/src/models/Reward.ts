import mongoose, { Schema, Document } from 'mongoose';

export interface IReward extends Document {
  title: string;
  description: string;
  shortDescription: string;
  longDescription: string;
  imageUrl: string;
  category: 'festivals' | 'discounts' | 'exclusive' | 'experiences';
  tokensRequired: number;
  status: 'available' | 'low_stock' | 'out_of_stock' | 'coming_soon';
  stockAvailable?: number;
  totalStock?: number;
  validUntil?: Date;
  termsAndConditions: string[];
  redemptionInstructions?: string;
  features: string[];
  restrictions: string[];
  howToRedeem: string[];
  partnerId?: string;
  partnerName?: string;
  partnerLogo?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RewardSchema = new Schema<IReward>(
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
    category: {
      type: String,
      required: true,
      enum: ['festivals', 'discounts', 'exclusive', 'experiences'],
      index: true,
    },
    tokensRequired: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      required: true,
      enum: ['available', 'low_stock', 'out_of_stock', 'coming_soon'],
      default: 'available',
      index: true,
    },
    stockAvailable: {
      type: Number,
      min: 0,
    },
    totalStock: {
      type: Number,
      min: 0,
    },
    validUntil: {
      type: Date,
    },
    termsAndConditions: {
      type: [String],
      required: true,
    },
    redemptionInstructions: {
      type: String,
    },
    features: {
      type: [String],
      default: [],
    },
    restrictions: {
      type: [String],
      default: [],
    },
    howToRedeem: {
      type: [String],
      default: [],
    },
    partnerId: {
      type: String,
    },
    partnerName: {
      type: String,
    },
    partnerLogo: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for filtering rewards
RewardSchema.index({ category: 1, status: 1 });
RewardSchema.index({ tokensRequired: 1 });

export const Reward = mongoose.model<IReward>('Reward', RewardSchema);

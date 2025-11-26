import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IRewardTransaction extends Document {
  userId: Types.ObjectId;
  rewardId: Types.ObjectId;
  tokensSpent: number;
  redemptionCode: string;
  status: 'pending' | 'confirmed' | 'redeemed' | 'expired' | 'cancelled';
  redeemedAt?: Date;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const RewardTransactionSchema = new Schema<IRewardTransaction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    rewardId: {
      type: Schema.Types.ObjectId,
      ref: 'Reward',
      required: true,
    },
    tokensSpent: {
      type: Number,
      required: true,
      min: 0,
    },
    redemptionCode: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'confirmed', 'redeemed', 'expired', 'cancelled'],
      default: 'pending',
    },
    redeemedAt: {
      type: Date,
    },
    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Generate redemption code before saving
RewardTransactionSchema.pre('save', function (next) {
  if (!this.isNew || this.redemptionCode) {
    return next();
  }

  // Generate unique redemption code
  this.redemptionCode = `RWD${Date.now().toString(36).toUpperCase()}${Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase()}`;

  // Set default expiration (30 days)
  if (!this.expiresAt) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    this.expiresAt = expiryDate;
  }

  next();
});

// Index for user transaction history
RewardTransactionSchema.index({ userId: 1, createdAt: -1 });

export const RewardTransaction = mongoose.model<IRewardTransaction>(
  'RewardTransaction',
  RewardTransactionSchema
);

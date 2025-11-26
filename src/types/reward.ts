export type RewardCategory = 'festivals' | 'discounts' | 'exclusive' | 'experiences';

export type RewardStatus = 'available' | 'low_stock' | 'out_of_stock' | 'coming_soon';

export interface Reward {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  imageUrl: string;
  category: RewardCategory;
  tokensRequired: number;
  status: RewardStatus;
  stockAvailable?: number;
  totalStock?: number;
  validUntil?: string;
  termsAndConditions: string[];
  redemptionInstructions?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RewardDetail extends Reward {
  longDescription: string;
  features: string[];
  restrictions: string[];
  howToRedeem: string[];
  partnerId?: string;
  partnerName?: string;
  partnerLogo?: string;
}

export interface RewardTransaction {
  id: string;
  userId: string;
  rewardId: string;
  tokensSpent: number;
  redemptionCode: string;
  status: 'pending' | 'confirmed' | 'redeemed' | 'expired' | 'cancelled';
  redeemedAt?: string;
  expiresAt?: string;
  createdAt: string;
}

export interface RewardTransactionWithDetails extends RewardTransaction {
  reward: Reward;
}

export interface RedeemRewardRequest {
  rewardId: string;
}

export interface RedeemRewardResponse {
  success: boolean;
  transaction: RewardTransactionWithDetails;
  message?: string;
}

export interface UserRewards {
  availableTokens: number;
  transactions: RewardTransactionWithDetails[];
}

import { apiClient } from './client';
import type {
  Reward,
  RewardDetail,
  RedeemRewardRequest,
  RedeemRewardResponse,
  UserRewards,
  RewardTransaction,
} from '@/types';

/**
 * Rewards API endpoints
 */
export const rewardsApi = {
  /**
   * Get all available rewards
   */
  async getRewards(category?: string): Promise<Reward[]> {
    const response = await apiClient.get<any[]>('/rewards', { category });
    if (response.success && response.data) {
      return response.data.map((item: any) => ({
        ...item,
        id: item._id || item.id,
      }));
    }
    throw new Error(response.error || 'Failed to get rewards');
  },

  /**
   * Get a specific reward by ID
   */
  async getReward(id: string): Promise<RewardDetail> {
    const response = await apiClient.get<any>(`/rewards/${id}`);
    if (response.success && response.data) {
      return {
        ...response.data,
        id: response.data._id || response.data.id,
      };
    }
    throw new Error(response.error || 'Failed to get reward');
  },

  /**
   * Redeem a reward
   */
  async redeemReward(data: RedeemRewardRequest): Promise<RedeemRewardResponse> {
    const response = await apiClient.post<RedeemRewardResponse>('/rewards/redeem', data);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to redeem reward');
  },

  /**
   * Get user's reward transactions
   */
  async getUserRewards(): Promise<UserRewards> {
    const response = await apiClient.get<UserRewards>('/rewards/user');
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to get user rewards');
  },

  /**
   * Get a specific reward transaction
   */
  async getRewardTransaction(id: string): Promise<RewardTransaction> {
    const response = await apiClient.get<RewardTransaction>(`/rewards/transactions/${id}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to get reward transaction');
  },

  /**
   * Cancel a reward transaction (if applicable)
   */
  async cancelRewardTransaction(id: string): Promise<RewardTransaction> {
    const response = await apiClient.patch<RewardTransaction>(`/rewards/transactions/${id}/cancel`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to cancel reward transaction');
  },
};

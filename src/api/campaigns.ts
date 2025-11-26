import { apiClient } from './client';
import type { Campaign, CampaignDetail } from '@/types';

/**
 * Campaigns API endpoints
 */
export const campaignsApi = {
  /**
   * Get all active campaigns
   */
  async getCampaigns(status?: string): Promise<Campaign[]> {
    const response = await apiClient.get<any[]>('/campaigns', { status });
    if (response.success && response.data) {
      return response.data.map((item: any) => ({
        ...item,
        id: item._id || item.id,
      }));
    }
    throw new Error(response.error || 'Failed to get campaigns');
  },

  /**
   * Get a specific campaign by ID
   */
  async getCampaign(id: string): Promise<CampaignDetail> {
    const response = await apiClient.get<any>(`/campaigns/${id}`);
    if (response.success && response.data) {
      return {
        ...response.data,
        id: response.data._id || response.data.id,
      };
    }
    throw new Error(response.error || 'Failed to get campaign');
  },

  /**
   * Get campaigns the user has participated in
   */
  async getUserCampaigns(): Promise<Campaign[]> {
    const response = await apiClient.get<Campaign[]>('/campaigns/user');
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to get user campaigns');
  },
};

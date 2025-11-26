import { apiClient } from './client';
import type { DonationHistory, AnalyticsData, Donation } from '@/types';

/**
 * Donations API endpoints
 */
export const donationsApi = {
  /**
   * Get donation history for the current user
   */
  async getDonationHistory(): Promise<DonationHistory> {
    const response = await apiClient.get<DonationHistory>('/donations/history');
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to get donation history');
  },

  /**
   * Get a specific donation by ID
   */
  async getDonation(id: string): Promise<Donation> {
    const response = await apiClient.get<Donation>(`/donations/${id}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to get donation');
  },

  /**
   * Get analytics data for the current user
   */
  async getAnalytics(): Promise<AnalyticsData> {
    const response = await apiClient.get<AnalyticsData>('/donations/analytics');
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to get analytics');
  },

  /**
   * Get next eligible donation date
   */
  async getNextEligibleDate(): Promise<{ date: string; daysUntil: number }> {
    const response = await apiClient.get<{ date: string; daysUntil: number }>('/donations/next-eligible');
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to get next eligible date');
  },
};

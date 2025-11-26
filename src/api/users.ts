import { apiClient } from './client';
import type {
  User,
  UserProfile,
  NotificationSettings,
  PrivacySettings,
  ApiResponse,
} from '@/types';

/**
 * User API endpoints
 */
export const usersApi = {
  /**
   * Get current user profile
   */
  async getProfile(): Promise<UserProfile> {
    const response = await apiClient.get<UserProfile>('/users/profile');
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to get profile');
  },

  /**
   * Update user profile
   */
  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await apiClient.put<User>('/users/profile', data);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to update profile');
  },

  /**
   * Update notification settings
   */
  async updateNotificationSettings(settings: NotificationSettings): Promise<NotificationSettings> {
    const response = await apiClient.put<NotificationSettings>('/users/settings/notifications', settings);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to update notification settings');
  },

  /**
   * Update privacy settings
   */
  async updatePrivacySettings(settings: PrivacySettings): Promise<PrivacySettings> {
    const response = await apiClient.put<PrivacySettings>('/users/settings/privacy', settings);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to update privacy settings');
  },

  /**
   * Upload user avatar
   */
  async uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await apiClient.post<{ avatarUrl: string }>('/users/avatar', formData);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to upload avatar');
  },

  /**
   * Delete user account
   */
  async deleteAccount(): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete('/users/account');
  },
};

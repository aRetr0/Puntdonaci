import { apiClient } from './client';
import type {
  LoginCredentials,
  SignupData,
  AuthResponse,
  User,
  ApiResponse,
} from '@/types';

/**
 * Authentication API endpoints
 */
export const authApi = {
  /**
   * Login with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    if (response.success && response.data) {
      // Set token in API client
      apiClient.setToken(response.data.token);
      return response.data;
    }
    throw new Error(response.error || 'Login failed');
  },

  /**
   * Register a new user
   */
  async register(data: SignupData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    if (response.success && response.data) {
      // Set token in API client
      apiClient.setToken(response.data.token);
      return response.data;
    }
    throw new Error(response.error || 'Registration failed');
  },

  /**
   * Logout the current user
   */
  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
    apiClient.clearToken();
  },

  /**
   * Get current authenticated user
   */
  async me(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me');
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to get user');
  },

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<{ token: string }> {
    const response = await apiClient.post<{ token: string }>('/auth/refresh');
    if (response.success && response.data) {
      apiClient.setToken(response.data.token);
      return response.data;
    }
    throw new Error(response.error || 'Token refresh failed');
  },

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post('/auth/password-reset/request', { email });
  },

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post('/auth/password-reset/confirm', { token, newPassword });
  },
};

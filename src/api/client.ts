import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { env } from '@/lib/env';
import type { ApiResponse, ApiError } from '@/types';

/**
 * Base API client with authentication and error handling
 */
class ApiClient {
  private client: AxiosInstance;
  private authToken: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: env.apiUrl,
      timeout: env.apiTimeout,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // Enable cookies for httpOnly tokens
    });

    this.setupInterceptors();
  }

  /**
   * Set up request and response interceptors
   */
  private setupInterceptors() {
    // Request interceptor - add auth token to headers
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (this.authToken && config.headers) {
          config.headers.Authorization = `Bearer ${this.authToken}`;
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - handle errors
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ApiError>) => {
        // Handle 401 Unauthorized - token expired or invalid
        const isAuthRequest = error.config?.url?.includes('/auth/');
        
        if (env.isDevelopment) {
          console.log('[API] Error:', error.response?.status, error.config?.url);
        }

        if (error.response?.status === 401 && !isAuthRequest) {
          console.log('[API] 401 Unauthorized - redirecting to login');
          this.clearToken();
          // Redirect to login or refresh token
          window.location.href = '/login';
        }

        // Format error response
        const apiError: ApiError = {
          success: false,
          error: error.response?.data?.error || error.message || 'An error occurred',
          code: error.response?.data?.code,
          field: error.response?.data?.field,
          details: error.response?.data?.details,
        };

        return Promise.reject(apiError);
      }
    );
  }

  /**
   * Set authentication token
   */
  setToken(token: string) {
    this.authToken = token;
    if (env.isDevelopment) {
      console.log('[API] Token set');
    }
  }

  /**
   * Clear authentication token
   */
  clearToken() {
    this.authToken = null;
    if (env.isDevelopment) {
      console.log('[API] Token cleared');
    }
  }

  /**
   * Check if client has authentication token
   */
  hasToken(): boolean {
    return !!this.authToken;
  }

  /**
   * Generic GET request
   */
  async get<T>(url: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
    const response = await this.client.get<ApiResponse<T>>(url, { params });
    return response.data;
  }

  /**
   * Generic POST request
   */
  async post<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(url, data);
    return response.data;
  }

  /**
   * Generic PUT request
   */
  async put<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    const response = await this.client.put<ApiResponse<T>>(url, data);
    return response.data;
  }

  /**
   * Generic PATCH request
   */
  async patch<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    const response = await this.client.patch<ApiResponse<T>>(url, data);
    return response.data;
  }

  /**
   * Generic DELETE request
   */
  async delete<T>(url: string): Promise<ApiResponse<T>> {
    const response = await this.client.delete<ApiResponse<T>>(url);
    return response.data;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

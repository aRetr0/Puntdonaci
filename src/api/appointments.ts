import { apiClient } from './client';
import type {
  Appointment,
  AppointmentWithDetails,
  CreateAppointmentRequest,
  CreateAppointmentResponse,
  AvailabilityQuery,
  AvailabilityResponse,
  DonationCenter,
  DonationTypeInfo,
} from '@/types';

/**
 * Transform GeoJSON coordinates to simple lat/lng format for frontend
 */
function transformDonationCenter(center: any): DonationCenter {
  // Handle both old format (backward compatibility) and new GeoJSON format
  if (center.coordinates?.type === 'Point') {
    // New GeoJSON format
    return {
      ...center,
      coordinates: {
        lat: center.coordinates.coordinates[1],  // latitude is second
        lng: center.coordinates.coordinates[0]   // longitude is first
      }
    };
  }
  // Old format - pass through
  return center;
}

/**
 * Appointments API endpoints
 */
export const appointmentsApi = {
  /**
   * Get all appointments for the current user
   */
  async getAppointments(status?: string): Promise<AppointmentWithDetails[]> {
    const response = await apiClient.get<AppointmentWithDetails[]>('/appointments', { status });
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to get appointments');
  },

  /**
   * Get a specific appointment by ID
   */
  async getAppointment(id: string): Promise<AppointmentWithDetails> {
    const response = await apiClient.get<AppointmentWithDetails>(`/appointments/${id}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to get appointment');
  },

  /**
   * Create a new appointment
   */
  async createAppointment(data: CreateAppointmentRequest): Promise<CreateAppointmentResponse> {
    const response = await apiClient.post<CreateAppointmentResponse>('/appointments', data);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to create appointment');
  },

  /**
   * Cancel an appointment
   */
  async cancelAppointment(id: string, reason?: string): Promise<Appointment> {
    const response = await apiClient.patch<Appointment>(`/appointments/${id}/cancel`, { reason });
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to cancel appointment');
  },

  /**
   * Check availability for a specific donation center and date
   */
  async checkAvailability(query: AvailabilityQuery): Promise<AvailabilityResponse> {
    const response = await apiClient.get<AvailabilityResponse>('/appointments/availability', query as unknown as Record<string, unknown>);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to check availability');
  },

  /**
   * Get all donation centers
   */
  async getDonationCenters(): Promise<DonationCenter[]> {
    const response = await apiClient.get<any[]>('/donation-centers');
    if (response.success && response.data) {
      return response.data.map(transformDonationCenter);
    }
    throw new Error(response.error || 'Failed to get donation centers');
  },

  /**
   * Get a specific donation center by ID
   */
  async getDonationCenter(id: string): Promise<DonationCenter> {
    const response = await apiClient.get<any>(`/donation-centers/${id}`);
    if (response.success && response.data) {
      return transformDonationCenter(response.data);
    }
    throw new Error(response.error || 'Failed to get donation center');
  },

  /**
   * Get donation centers near a location
   */
  async getNearbyDonationCenters(lat: number, lng: number, radius = 10000): Promise<DonationCenter[]> {
    const response = await apiClient.get<any[]>('/donation-centers/nearby', {
      lat,
      lng,
      radius,
    });
    if (response.success && response.data) {
      return response.data.map(transformDonationCenter);
    }
    throw new Error(response.error || 'Failed to get nearby donation centers');
  },

  /**
   * Get information about all donation types
   */
  async getDonationTypes(): Promise<DonationTypeInfo[]> {
    const response = await apiClient.get<DonationTypeInfo[]>('/donation-types');
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.error || 'Failed to get donation types');
  },
};

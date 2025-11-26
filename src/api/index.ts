/**
 * Main API exports
 * Centralized access to all API endpoints
 */

export { apiClient } from './client';
export { authApi } from './auth';
export { usersApi } from './users';
export { appointmentsApi } from './appointments';
export { donationsApi } from './donations';
export { campaignsApi } from './campaigns';
export { rewardsApi } from './rewards';

// Re-export all API methods for convenience
import { authApi } from './auth';
import { usersApi } from './users';
import { appointmentsApi } from './appointments';
import { donationsApi } from './donations';
import { campaignsApi } from './campaigns';
import { rewardsApi } from './rewards';

export const api = {
  auth: authApi,
  users: usersApi,
  appointments: appointmentsApi,
  donations: donationsApi,
  campaigns: campaignsApi,
  rewards: rewardsApi,
};

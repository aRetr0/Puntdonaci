import { useQuery } from '@tanstack/react-query';
import { appointmentsApi } from '@/api';
import type { DonationCenter } from '@/types';

export function useDonationCenters() {
  return useQuery({
    queryKey: ['donation-centers'],
    queryFn: appointmentsApi.getDonationCenters,
  });
}

export function useDonationCenter(id: string) {
  return useQuery({
    queryKey: ['donation-centers', id],
    queryFn: () => appointmentsApi.getDonationCenter(id),
    enabled: !!id,
  });
}

export function useNearbyDonationCenters(lat: number, lng: number, maxDistance = 10000) {
  return useQuery({
    queryKey: ['donation-centers', 'nearby', lat, lng, maxDistance],
    queryFn: () => appointmentsApi.getNearbyDonationCenters(lat, lng, maxDistance),
    enabled: !!(lat && lng),
  });
}

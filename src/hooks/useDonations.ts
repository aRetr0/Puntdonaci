import { useQuery } from '@tanstack/react-query';
import { donationsApi } from '@/api';

export function useDonations() {
  return useQuery({
    queryKey: ['donations'],
    queryFn: donationsApi.getDonationHistory,
  });
}

export function useDonation(id: string) {
  return useQuery({
    queryKey: ['donations', id],
    queryFn: () => donationsApi.getDonation(id),
    enabled: !!id,
  });
}

export function useDonationAnalytics() {
  return useQuery({
    queryKey: ['donations', 'analytics'],
    queryFn: donationsApi.getAnalytics,
  });
}

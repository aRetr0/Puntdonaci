import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rewardsApi } from '@/api';

export function useRewards() {
  return useQuery({
    queryKey: ['rewards'],
    queryFn: () => rewardsApi.getRewards(),
  });
}

export function useReward(id: string) {
  return useQuery({
    queryKey: ['rewards', id],
    queryFn: () => rewardsApi.getReward(id),
    enabled: !!id,
  });
}

export function useRewardTransactions() {
  return useQuery({
    queryKey: ['reward-transactions'],
    queryFn: rewardsApi.getUserRewards,
  });
}

export function useRedeemReward() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (rewardId: string) => rewardsApi.redeemReward({ rewardId }),
    onSuccess: () => {
      // Invalidate rewards and transactions to refresh data
      queryClient.invalidateQueries({ queryKey: ['rewards'] });
      queryClient.invalidateQueries({ queryKey: ['reward-transactions'] });
      queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
    },
  });
}

import { useState, useRef } from 'react';
import { Coins, Music, ShoppingBag, Gift, Sparkles, Check, X, Loader2 } from 'lucide-react';
import { Button } from './ui/button';

import { toast } from 'sonner';
import { useAuthStore } from '@/stores/authStore';
import { useRewards, useRedeemReward } from '@/hooks';
import { Reward } from '@/types';

export function RecompensesPage() {
  const { user } = useAuthStore();
  const { data: rewardsResponse, isLoading: loadingRewards } = useRewards();
  const redeemReward = useRedeemReward();

  const [selectedCategory, setSelectedCategory] = useState<string>('tots');
  const [selectedReward, setSelectedReward] = useState<string | null>(null);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [redeemedCode, setRedeemedCode] = useState<string | null>(null);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const tokens = user?.tokens || 0;
  const rewards = rewardsResponse || [];

  const categories = [
    { id: 'tots', label: 'Tots', icon: Gift },
    { id: 'festivals', label: 'Festivals', icon: Music },
    { id: 'descomptes', label: 'Descomptes', icon: ShoppingBag },
    { id: 'exclusiu', label: 'Exclusiu', icon: Sparkles }
  ];

  const filteredRewards = selectedCategory === 'tots'
    ? rewards
    : rewards.filter((r: Reward) => r.category === selectedCategory);

  const selectedRewardData = rewards.find((r: Reward) => r.id === selectedReward);

  const handleRedeem = async () => {
    if (!selectedRewardData || tokens < selectedRewardData.tokensRequired) {
      toast.error('No tens prou tokens per bescanviar aquesta recompensa');
      return;
    }

    try {
      const result = await redeemReward.mutateAsync(selectedRewardData.id);
      // The redemption code is returned by the API in the transaction object
      setRedeemedCode(result.transaction.redemptionCode || 'BST-CODE');
    } catch {
      toast.error('Error al bescanviar la recompensa');
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      startY.current = e.touches[0].clientY;
      setIsDragging(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !e.touches[0]) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;
    if (diff > 0) {
      setDragY(diff);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (dragY > 150) {
      setShowRedeemModal(false);
      setSelectedReward(null);
      setRedeemedCode(null);
    }
    setDragY(0);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 relative">
      {/* Header with Glass Effect */}
      <div
        className="text-white p-6"
        style={{
          backgroundColor: 'rgba(227, 6, 19, 0.95)',
          backdropFilter: 'saturate(180%) blur(20px)',
          WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        }}
      >
        <h2 className="text-white mb-2">Les teves Recompenses</h2>
        <div className="flex items-center gap-2">
          <Coins className="w-6 h-6" />
          <span className="text-2xl font-medium">{tokens} tokens disponibles</span>
        </div>
      </div>

      {/* Category Filters */}
      <div className="bg-white border-b border-gray-200 p-4 overflow-x-auto">
        <div className="flex gap-2">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${selectedCategory === category.id
                  ? 'bg-[#E30613] text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{category.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Rewards Grid */}
      <div className="flex-1 overflow-y-auto p-4" ref={scrollContainerRef}>
        {loadingRewards ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-[#E30613]" />
          </div>
        ) : filteredRewards.length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            No hi ha recompenses disponibles
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 pb-24">
            {filteredRewards.map((reward: Reward) => {
              const canAfford = tokens >= reward.tokensRequired;

              return (
                <div
                  key={reward.id}
                  onClick={() => {
                    setSelectedReward(reward.id);
                    setShowRedeemModal(true);
                  }}
                  className={`bg-white rounded-2xl overflow-hidden shadow-sm transition-all cursor-pointer ${canAfford ? 'hover-lift' : 'opacity-60'
                    }`}
                >
                  <div
                    className="h-28 bg-cover bg-center"
                    style={{ backgroundImage: `url(${reward.imageUrl})` }}
                  />
                  <div className="p-3">
                    <h4 className="text-sm mb-1 line-clamp-1">{reward.title}</h4>
                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">{reward.description}</p>
                    <div className={`flex items-center gap-1 ${canAfford ? 'text-[#E30613]' : 'text-gray-400'}`}>
                      <Coins className="w-3.5 h-3.5" />
                      <span className="text-sm font-medium">{reward.tokensRequired} tokens</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Reward Detail Modal */}
      {showRedeemModal && selectedRewardData && !redeemedCode && (
        <div
          className="fixed inset-0 glass-overlay z-50"
          onClick={() => {
            setShowRedeemModal(false);
            setSelectedReward(null);
          }}
        >
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl max-w-2xl mx-auto"
            style={{
              height: '80%',
              transform: `translateY(${dragY}px)`,
              transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)'
            }}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Drag Handle */}
            <div className="w-full flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            <div className="h-full overflow-y-auto pb-6">
              <div className="sticky top-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 p-4 flex items-center justify-between z-10">
                <h3>{selectedRewardData.title}</h3>
                <button
                  onClick={() => {
                    setShowRedeemModal(false);
                    setSelectedReward(null);
                  }}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div
                  className="h-48 bg-cover bg-center rounded-2xl"
                  style={{ backgroundImage: `url(${selectedRewardData.imageUrl})` }}
                />

                <div>
                  <h4 className="mb-2">{selectedRewardData.title}</h4>
                  <p className="text-gray-600 mb-4">{selectedRewardData.description}</p>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <h5 className="text-sm font-medium mb-2">Termes i condicions</h5>
                    <ul className="text-sm text-gray-600 list-disc pl-4">
                      {selectedRewardData.termsAndConditions?.map((term, index) => (
                        <li key={index}>{term}</li>
                      )) || <li>No hi ha termes específics</li>}
                    </ul>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-900">Cost</span>
                    <div className="flex items-center gap-2">
                      <Coins className="w-5 h-5 text-blue-700" />
                      <span className="font-medium text-blue-900">{selectedRewardData.tokensRequired} tokens</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-blue-900">Tokens disponibles</span>
                    <span className="font-medium text-blue-900">{tokens} tokens</span>
                  </div>
                </div>

                {tokens >= selectedRewardData.tokensRequired ? (
                  <Button
                    className="w-full bg-[#E30613] hover:bg-[#C00510] text-white h-12 rounded-xl"
                    onClick={handleRedeem}
                    disabled={redeemReward.isPending}
                  >
                    {redeemReward.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Bescanviant...
                      </>
                    ) : (
                      'Bescanviar Recompensa'
                    )}
                  </Button>
                ) : (
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600">
                      Necessites {selectedRewardData.tokensRequired - tokens} tokens més
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {redeemedCode && (
        <div
          className="fixed inset-0 glass-overlay z-50 flex items-center justify-center p-4"
          onClick={() => {
            setRedeemedCode(null);
            setShowRedeemModal(false);
            setSelectedReward(null);
          }}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-sm mx-auto shadow-2xl"
            style={{
              transform: `translateY(${dragY}px) scale(${1 - dragY / 1000})`,
              transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)'
            }}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Drag Handle */}
            <div className="w-full flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="mb-2">Recompensa Bescanviada!</h3>
              <p className="text-gray-600 mb-6">El teu codi de descompte és:</p>

              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <p className="font-mono text-xl font-medium tracking-wider">{redeemedCode}</p>
              </div>

              <p className="text-sm text-gray-600 mb-6">
                Guarda aquest codi. L'hauràs de mostrar quan utilitzis la recompensa.
              </p>

              <Button
                className="w-full bg-[#E30613] hover:bg-[#C00510] text-white h-12 rounded-xl"
                onClick={() => {
                  setRedeemedCode(null);
                  setShowRedeemModal(false);
                  setSelectedReward(null);
                }}
              >
                Tancar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import { useState, useRef } from 'react';
import { Coins, Music, ShoppingBag, Gift, Sparkles, Check, X } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface RecompensesPageProps {
  tokens: number;
  onRedeem: (cost: number) => void;
}

export function RecompensesPage({ tokens, onRedeem }: RecompensesPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('tots');
  const [selectedReward, setSelectedReward] = useState<number | null>(null);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [redeemedCode, setRedeemedCode] = useState<string | null>(null);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const categories = [
    { id: 'tots', label: 'Tots', icon: Gift },
    { id: 'festivals', label: 'Festivals', icon: Music },
    { id: 'descomptes', label: 'Descomptes', icon: ShoppingBag },
    { id: 'exclusiu', label: 'Exclusiu', icon: Sparkles }
  ];

  const rewards = [
    {
      id: 1,
      title: 'Primavera Sound 2025',
      description: 'Prevenda exclusiva per a donants',
      cost: 50,
      category: 'festivals',
      image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&auto=format&fit=crop',
      terms: 'Accés a la prevenda exclusiva del Primavera Sound 2025. Codi vàlid fins 31/12/2024.'
    },
    {
      id: 2,
      title: 'Sónar Barcelona',
      description: '15% de descompte en entrades',
      cost: 35,
      category: 'festivals',
      image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&auto=format&fit=crop',
      terms: '15% de descompte en l\'entrada general. Vàlid per Sónar de Dia i Sónar de Nit.'
    },
    {
      id: 3,
      title: 'Spotify Premium',
      description: '3 mesos gratis',
      cost: 25,
      category: 'exclusiu',
      image: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=400&auto=format&fit=crop',
      terms: '3 mesos de Spotify Premium gratuïts. Només per a nous usuaris o comptes inactius.'
    },
    {
      id: 4,
      title: 'Cinemes Yelmo',
      description: '2x1 en entrades',
      cost: 20,
      category: 'descomptes',
      image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&auto=format&fit=crop',
      terms: '2x1 en entrades de cinema. Vàlid de dilluns a dijous, sessions abans de les 18h.'
    },
    {
      id: 5,
      title: 'Descompte Zara',
      description: '20% en la teva compra',
      cost: 30,
      category: 'descomptes',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&auto=format&fit=crop',
      terms: '20% de descompte en una compra. No acumulable amb altres promocions. Vàlid 30 dies.'
    },
    {
      id: 6,
      title: 'Experiència Culers',
      description: 'Visita Camp Nou + Museu',
      cost: 60,
      category: 'exclusiu',
      image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=400&auto=format&fit=crop',
      terms: 'Entrada gratuïta al Camp Nou i Museu del FC Barcelona. Inclou una persona acompanyant.'
    }
  ];

  const filteredRewards = selectedCategory === 'tots' 
    ? rewards 
    : rewards.filter(r => r.category === selectedCategory);

  const selectedRewardData = rewards.find(r => r.id === selectedReward);

  const handleRedeem = () => {
    if (selectedRewardData && tokens >= selectedRewardData.cost) {
      const code = `BST-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      setRedeemedCode(code);
      onRedeem(selectedRewardData.cost);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;
    if (diff > 0) {
      setDragY(diff);
    }
  };

  const handleTouchEnd = () => {
    if (dragY > 100) {
      setShowRedeemModal(false);
      setSelectedReward(null);
      setRedeemedCode(null);
    }
    setDragY(0);
    setIsDragging(false);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 relative">
      {/* Header with Glass Effect */}
      <div className="glass-header text-white p-6">
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
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
                  selectedCategory === category.id
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
        <div className="grid grid-cols-2 gap-3 pb-24">
          {filteredRewards.map((reward) => {
            const canAfford = tokens >= reward.cost;
            
            return (
              <div
                key={reward.id}
                onClick={() => {
                  setSelectedReward(reward.id);
                  setShowRedeemModal(true);
                }}
                className={`bg-white rounded-2xl overflow-hidden shadow-sm transition-all cursor-pointer ${
                  canAfford ? 'hover-lift' : 'opacity-60'
                }`}
              >
                <div 
                  className="h-28 bg-cover bg-center"
                  style={{ backgroundImage: `url(${reward.image})` }}
                />
                <div className="p-3">
                  <h4 className="text-sm mb-1 line-clamp-1">{reward.title}</h4>
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">{reward.description}</p>
                  <div className={`flex items-center gap-1 ${canAfford ? 'text-[#E30613]' : 'text-gray-400'}`}>
                    <Coins className="w-3.5 h-3.5" />
                    <span className="text-sm font-medium">{reward.cost} tokens</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
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
                  style={{ backgroundImage: `url(${selectedRewardData.image})` }}
                />

                <div>
                  <h4 className="mb-2">{selectedRewardData.title}</h4>
                  <p className="text-gray-600 mb-4">{selectedRewardData.description}</p>
                  
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h5 className="text-sm font-medium mb-2">Termes i condicions</h5>
                    <p className="text-sm text-gray-600">{selectedRewardData.terms}</p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-900">Cost</span>
                    <div className="flex items-center gap-2">
                      <Coins className="w-5 h-5 text-blue-700" />
                      <span className="font-medium text-blue-900">{selectedRewardData.cost} tokens</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-blue-900">Tokens disponibles</span>
                    <span className="font-medium text-blue-900">{tokens} tokens</span>
                  </div>
                </div>

                {tokens >= selectedRewardData.cost ? (
                  <Button 
                    className="w-full bg-[#E30613] hover:bg-[#C00510] text-white h-12 rounded-xl"
                    onClick={handleRedeem}
                  >
                    Bescanviar Recompensa
                  </Button>
                ) : (
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600">
                      Necessites {selectedRewardData.cost - tokens} tokens més
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
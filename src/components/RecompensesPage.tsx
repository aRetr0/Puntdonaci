import { useState } from 'react';
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
      image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&auto=format&fit=crop',
      validity: 'Fins 31 de Desembre',
      available: 15
    },
    {
      id: 2,
      title: 'Descompte 20% Decathlon',
      description: 'En tota la gamma esportiva',
      cost: 25,
      category: 'descomptes',
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&auto=format&fit=crop',
      validity: 'Fins 30 de Gener',
      available: 50
    },
    {
      id: 3,
      title: 'Samarreta BST Edició Limitada',
      description: 'Marxandatge oficial exclusiu',
      cost: 30,
      category: 'exclusiu',
      image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop',
      validity: 'Fins exhaurir existències',
      available: 8
    },
    {
      id: 4,
      title: 'Sónar Festival',
      description: 'Entrada de dia amb descompte',
      cost: 40,
      category: 'festivals',
      image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&auto=format&fit=crop',
      validity: 'Fins 15 de Març',
      available: 25
    },
    {
      id: 5,
      title: 'Visita Camp Nou',
      description: 'Experiència exclusiva al museu',
      cost: 35,
      category: 'exclusiu',
      image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&auto=format&fit=crop',
      validity: 'Fins 31 de Desembre',
      available: 20
    },
    {
      id: 6,
      title: '15% Off Llibreria Ona',
      description: 'En qualsevol compra',
      cost: 20,
      category: 'descomptes',
      image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&auto=format&fit=crop',
      validity: 'Fins 28 de Febrer',
      available: 100
    }
  ];

  const filteredRewards = selectedCategory === 'tots' 
    ? rewards 
    : rewards.filter(r => r.category === selectedCategory);

  const handleRedeem = () => {
    if (selectedReward) {
      const reward = rewards.find(r => r.id === selectedReward);
      if (reward && tokens >= reward.cost) {
        onRedeem(reward.cost);
        setRedeemedCode(`BST${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
        setShowRedeemModal(false);
        setTimeout(() => setRedeemedCode(null), 5000);
      }
    }
  };

  if (redeemedCode) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h2 className="mb-2">Resgatat amb èxit!</h2>
          <p className="text-gray-600 mb-6">
            Aquí està el teu codi per bescanviar
          </p>
          <div className="bg-gray-100 rounded-2xl p-6 mb-4">
            <p className="text-2xl tracking-wider mb-2">{redeemedCode}</p>
            <p className="text-xs text-gray-600">Mostra aquest codi al validar</p>
          </div>
          <p className="text-xs text-gray-500">
            També l'hem enviat al teu correu electrònic
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#E30613] to-[#FF4444] text-white p-6">
        <h2 className="text-white mb-2">Les teves Recompenses</h2>
        <div className="flex items-center gap-2">
          <Coins className="w-6 h-6" />
          <span className="text-2xl">{tokens} tokens disponibles</span>
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
                className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                  selectedCategory === category.id
                    ? 'bg-[#E30613] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{category.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Rewards Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3 mb-20">
          {filteredRewards.map((reward) => {
            const canAfford = tokens >= reward.cost;
            
            return (
              <div
                key={reward.id}
                onClick={() => {
                  setSelectedReward(reward.id);
                  setShowRedeemModal(true);
                }}
                className={`bg-white rounded-2xl overflow-hidden shadow-md transition-all cursor-pointer ${
                  canAfford ? 'hover:shadow-lg hover:scale-105' : 'opacity-60'
                }`}
              >
                <div 
                  className="h-32 bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${reward.image})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  {reward.available < 10 && (
                    <Badge className="absolute top-2 right-2 bg-orange-500 text-white border-0 text-xs">
                      Últimes {reward.available}
                    </Badge>
                  )}
                </div>
                <div className="p-3">
                  <h4 className="text-xs mb-1 line-clamp-1">{reward.title}</h4>
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                    {reward.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[#E30613]">
                      <Coins className="w-4 h-4" />
                      <span className="text-sm">{reward.cost}</span>
                    </div>
                    {!canAfford && (
                      <span className="text-xs text-gray-500">No suficient</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Redeem Modal */}
      {showRedeemModal && selectedReward && (
        <div className="absolute inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-3xl w-full max-h-[80%] overflow-y-auto">
            <div className="p-6">
              {(() => {
                const reward = rewards.find(r => r.id === selectedReward);
                if (!reward) return null;
                const canAfford = tokens >= reward.cost;
                
                return (
                  <>
                    <div className="flex justify-between items-start mb-4">
                      <h3>{reward.title}</h3>
                      <button 
                        onClick={() => setShowRedeemModal(false)}
                        className="text-gray-500"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    <div 
                      className="h-48 bg-cover bg-center rounded-2xl mb-4"
                      style={{ backgroundImage: `url(${reward.image})` }}
                    />

                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-2">{reward.description}</p>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <span className="text-sm text-gray-600">Cost</span>
                        <div className="flex items-center gap-2">
                          <Coins className="w-5 h-5 text-[#E30613]" />
                          <span className="text-lg">{reward.cost} tokens</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <span className="text-sm text-gray-600">Els teus tokens</span>
                        <span className="text-lg">{tokens} tokens</span>
                      </div>

                      <div className="p-4 bg-blue-50 rounded-xl">
                        <p className="text-xs text-blue-900">
                          📅 Validesa: {reward.validity}
                        </p>
                        <p className="text-xs text-blue-900 mt-1">
                          📦 Disponibles: {reward.available} unitats
                        </p>
                      </div>

                      {canAfford ? (
                        <Button 
                          onClick={handleRedeem}
                          className="w-full bg-[#E30613] hover:bg-[#C00510] text-white h-14"
                        >
                          Resgatar ara
                        </Button>
                      ) : (
                        <div className="text-center p-4 bg-red-50 rounded-xl">
                          <p className="text-sm text-red-800">
                            Necessites {reward.cost - tokens} tokens més
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

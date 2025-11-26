
import { Calendar, Coins, ChevronRight, AlertCircle, X, Target, Clock, Activity, Loader2, Gift } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useActiveCampaigns, useRewards } from '@/hooks';
import type { Campaign, Reward } from '@/types';
import { CampaignCard } from './CampaignCard';
import { DonationTypeCard } from './DonationTypeCard';

export function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { data: campaignsResponse, isLoading: loadingCampaigns, error: campaignsError } = useActiveCampaigns();
  const { data: rewardsResponse, isLoading: loadingRewards } = useRewards();

  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [selectedDonationType, setSelectedDonationType] = useState<number | null>(null);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const campaigns = campaignsResponse || [];
  const rewards = rewardsResponse || [];
  const displayedRewards = rewards.slice(0, 2); // Show only first 2 rewards

  const donationTypes = [
    {
      type: 'Sang Total',
      duration: '30-45 min',
      frequency: 'Cada 2 mesos',
      icon: '🩸',
      color: '#E30613',
      longDescription: 'La donació de sang total és la més comuna. Es recull sang completa que després es separa en diferents components (glòbuls vermells, plasma, plaquetes) per ajudar diversos pacients.',
      requirements: [
        'Més de 18 anys i menys de 65',
        'Pesar més de 50kg',
        'No estar embarassada',
        'Bon estat de salut general'
      ],
      benefits: [
        'Una donació salva fins a 3 vides',
        'Essencial per operacions quirúrgiques',
        'Crucial per accidents i emergències'
      ],
      tokens: 15,
      process: 'Registre → Qüestionari → Analítica → Extracció → Refrigeri'
    },
    {
      type: 'Plaquetes',
      duration: '90-120 min',
      frequency: 'Cada 15 dies',
      icon: '💉',
      color: '#F39C12',
      longDescription: 'La donació de plaquetes és un procés més llarg però vital per a pacients amb càncer i malalties de la sang. Les plaquetes s\'obtenen mitjançant un procés anomenat aferesi.',
      requirements: [
        'Més de 18 anys',
        'Haver donat sang abans',
        'Venació adequada',
        'No prendre aspirina (7 dies abans)'
      ],
      benefits: [
        'Vital per a pacients amb càncer',
        'Essencial en tractaments de quimioteràpia',
        'Ajuda en malalties de la sang'
      ],
      tokens: 20,
      process: 'Analítica prèvia → Connexió aferesi → Extracció plaquetes → Retorn sang'
    },
    {
      type: 'Plasma',
      duration: '45-60 min',
      frequency: 'Cada 15 dies',
      icon: '🧪',
      color: '#3498DB',
      longDescription: 'El plasma és la part líquida de la sang que conté proteïnes essencials. És fonamental per a pacients amb cremades greus i trastorns immunitaris.',
      requirements: [
        'Més de 18 anys',
        'Pesar més de 50kg',
        'Bon estat de salut',
        'No haver tingut hepatitis B o C'
      ],
      benefits: [
        'Tracta malalties immunitàries',
        'Essencial per cremats greus',
        'Ajuda en trastorns de coagulació'
      ],
      tokens: 18,
      process: 'Anàlisi previ → Plasmaferesi → Retorn cèl·lules'
    },
    {
      type: 'Medul·la Òssia',
      duration: 'Variable',
      frequency: 'Una vegada',
      icon: '🦴',
      color: '#9B59B6',
      longDescription: 'La donació de medul·la òssia o cèl·lules mare pot salvar la vida de persones amb leucèmia i altres malalties greus de la sang. El registre és senzill amb una mostra de sang.',
      requirements: [
        'Entre 18 i 40 anys',
        'Estar sa',
        'Compromís a llarg termini',
        'Compatible amb el pacient'
      ],
      benefits: [
        'Única esperança per leucèmia',
        'Salva vides directament',
        'Crea nou sistema immunitari'
      ],
      tokens: 50,
      process: 'Registre → Anàlisi compatibilitat → Donació si hi ha match'
    }
  ];

  const selectedCampaignData = campaigns.find((c: Campaign) => c.id === selectedCampaign);
  const selectedDonationData = selectedDonationType !== null ? donationTypes[selectedDonationType] : undefined;

  const handleNavigateToCalendar = () => {
    navigate('/app/calendari');
  };

  const handleNavigateToRewards = () => {
    navigate('/app/recompenses');
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer && scrollContainer.scrollTop > 0) {
      // Si no estem al top, no permetem drag
      return;
    }
    if (e.touches[0]) {
      startY.current = e.touches[0].clientY;
      setIsDragging(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !e.touches[0]) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;
    // Només arrosseguem cap avall
    if (diff > 0) {
      setDragY(diff);
      // Prevenir scroll mentre arrosseguem
      e.preventDefault();
    }
  };

  const handleTouchEnd = () => {
    if (dragY > 100) {
      setSelectedCampaign(null);
      setSelectedDonationType(null);
    }
    setDragY(0);
    setIsDragging(false);
  };

  return (
    <div className="h-full overflow-y-auto bg-background relative">
      {/* Header with Glass Effect */}
      <div
        className="text-white p-6 pb-8 md:py-8 glass-header"
      >
        <div className="max-w-4xl mx-auto md:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-white text-2xl font-medium">Hola, {user?.name?.split(' ')[0] || 'usuari'}!</h2>
              <p className="text-white/90 text-sm mt-1">Estàs apte per donar</p>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-2xl px-4 py-2.5 flex items-center gap-2 border border-white/30">
              <Coins className="w-5 h-5" />
              <span className="font-medium">{user?.tokens || 0} tokens</span>
            </div>
          </div>

          {/* Next Donation Info */}
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5" />
              <span className="text-sm">Propera donació permesa</span>
            </div>
            <p className="text-white font-medium">Ara mateix!</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-5 pb-24 md:py-8 max-w-4xl mx-auto md:px-8">
        {/* CTA Button */}
        <Button
          className="w-full bg-brand-600 hover:bg-brand-700 text-white h-14 rounded-2xl shadow-lg hover:shadow-xl transition-all hover-lift text-base font-medium"
          onClick={handleNavigateToCalendar}
        >
          <Calendar className="w-5 h-5 mr-2" />
          Reservar Cita Ara
        </Button>

        {/* Active Campaigns */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-lg font-medium">Campanyes Actives</h3>
            <button className="text-brand-600 text-sm flex items-center gap-1 font-medium hover:underline">
              Veure tot
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {loadingCampaigns ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
            </div>
          ) : campaignsError ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
              <p className="text-sm text-red-600">Error al carregar les campanyes</p>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="bg-muted/50 rounded-xl p-8 text-center">
              <p className="text-muted-foreground">No hi ha campanyes actives actualment</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {campaigns.map((campaign: Campaign) => (
                <CampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  onClick={setSelectedCampaign}
                />
              ))}
            </div>
          )}
        </section>

        {/* Rewards Section */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-lg font-medium">Recompenses Disponibles</h3>
            <button
              className="text-brand-600 text-sm flex items-center gap-1 font-medium hover:underline"
              onClick={handleNavigateToRewards}
            >
              Veure tot
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {loadingRewards ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
            </div>
          ) : rewards.length === 0 ? (
            <div className="bg-muted/50 rounded-xl p-8 text-center">
              <p className="text-muted-foreground">No hi ha recompenses disponibles</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {displayedRewards.map((reward: Reward) => (
                <div
                  key={reward.id}
                  onClick={handleNavigateToRewards}
                  className="bg-card rounded-2xl p-3 shadow-sm hover-lift cursor-pointer border border-border"
                >
                  <div className="aspect-square rounded-xl bg-muted mb-3 overflow-hidden relative">
                    {reward.imageUrl ? (
                      <img
                        src={reward.imageUrl}
                        alt={reward.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Gift className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1 shadow-sm text-foreground">
                      <Coins className="w-3 h-3 text-brand-600" />
                      {reward.tokensRequired}
                    </div>
                  </div>
                  <h4 className="text-sm font-medium line-clamp-1 mb-1 text-foreground">{reward.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-1">{reward.description}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Donation Types */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-lg font-medium">Tipus de Donacions</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {donationTypes.map((donation, index) => (
              <DonationTypeCard
                key={index}
                type={donation.type}
                duration={donation.duration}
                frequency={donation.frequency}
                icon={donation.icon}
                color={donation.color}
                tokens={donation.tokens}
                onClick={() => setSelectedDonationType(index)}
              />
            ))}
          </div>
        </section>

        {/* Info Banner */}
        <div className="bg-gradient-to-r from-brand-600 to-brand-400 rounded-2xl p-5 text-white shadow-md">
          <h3 className="text-white mb-2 font-medium">Sabies que...?</h3>
          <p className="text-white/90 text-sm leading-relaxed">
            Una sola donació de sang pot salvar fins a 3 vides. El teu gest és imprescindible!
          </p>
        </div>
      </div>

      {/* Campaign Detail Modal */}
      {selectedCampaign && selectedCampaignData && (
        <div
          className="fixed inset-0 glass-overlay z-50 flex items-end justify-center md:items-center"
          onClick={() => setSelectedCampaign(null)}
        >
          <div
            className="bg-background rounded-t-3xl md:rounded-3xl shadow-2xl w-full max-w-2xl mx-auto h-[80%] md:h-auto md:max-h-[85vh] flex flex-col"
            style={{
              transform: window.innerWidth < 768 ? `translateY(${dragY}px)` : 'none',
              transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)'
            }}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Drag Handle (Mobile only) */}
            <div className="w-full flex justify-center pt-3 pb-2 md:hidden">
              <div className="w-10 h-1 bg-muted-foreground/20 rounded-full" />
            </div>

            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
              <div className="sticky top-0 bg-background/95 backdrop-blur-xl border-b border-border p-4 flex items-center justify-between z-10">
                <h3 className="font-medium text-lg">{selectedCampaignData.title}</h3>
                <button
                  onClick={() => setSelectedCampaign(null)}
                  className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div
                  className="h-48 bg-cover bg-center rounded-2xl relative overflow-hidden shadow-sm"
                  style={{ backgroundImage: `url(${selectedCampaignData.imageUrl})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  {selectedCampaignData.priority === 'urgent' && (
                    <Badge className="absolute top-3 right-3 bg-red-500 text-white border-0">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Urgent
                    </Badge>
                  )}
                </div>

                <div>
                  <p className="text-muted-foreground mb-4 leading-relaxed">{selectedCampaignData.description}</p>

                  <div className="bg-muted/30 rounded-xl p-4 space-y-3 border border-border/50">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Objectiu</span>
                      <span className="font-medium">{selectedCampaignData.targetDonations} donacions</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Actual</span>
                      <span className="font-medium">{selectedCampaignData.currentDonations} donacions</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Finalitza</span>
                      <span className="font-medium">{new Date(selectedCampaignData.endDate).toLocaleDateString('ca-ES', { day: 'numeric', month: 'long' })}</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Progrés</span>
                      <span className="text-sm font-medium">{Math.round((selectedCampaignData.currentDonations / selectedCampaignData.targetDonations) * 100)}%</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-brand-600 to-brand-400 rounded-full transition-all duration-500"
                        style={{ width: `${Math.round((selectedCampaignData.currentDonations / selectedCampaignData.targetDonations) * 100)}% ` }}
                      />
                    </div>
                  </div>
                </div>

                {(selectedCampaignData.bonusTokens || 0) > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Coins className="w-5 h-5 text-green-700" />
                      <span className="font-medium text-green-900">Bonus especial</span>
                    </div>
                    <p className="text-sm text-green-800">
                      +{selectedCampaignData.bonusTokens} tokens extra per donar durant aquesta campanya
                    </p>
                  </div>
                )}

                <Button
                  className="w-full bg-brand-600 hover:bg-brand-700 text-white h-12 rounded-xl text-base font-medium shadow-md hover:shadow-lg transition-all"
                  onClick={() => {
                    setSelectedCampaign(null);
                    handleNavigateToCalendar();
                  }}
                >
                  Reservar Cita Ara
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Donation Type Detail Modal */}
      {selectedDonationType !== null && selectedDonationData && (
        <div
          className="fixed inset-0 glass-overlay z-50 flex items-end justify-center md:items-center"
          onClick={() => setSelectedDonationType(null)}
        >
          <div
            className="bg-background rounded-t-3xl md:rounded-3xl shadow-2xl w-full max-w-2xl mx-auto h-[80%] md:h-auto md:max-h-[85vh] flex flex-col"
            style={{
              transform: window.innerWidth < 768 ? `translateY(${dragY}px)` : 'none',
              transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)'
            }}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Drag Handle (Mobile only) */}
            <div className="w-full flex justify-center pt-3 pb-2 md:hidden">
              <div className="w-10 h-1 bg-muted-foreground/20 rounded-full" />
            </div>

            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
              <div className="sticky top-0 bg-background/95 backdrop-blur-xl border-b border-border p-4 flex items-center justify-between z-10">
                <h3 className="font-medium text-lg">{selectedDonationData.type}</h3>
                <button
                  onClick={() => setSelectedDonationType(null)}
                  className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div
                  className="rounded-2xl p-8 text-center"
                  style={{ backgroundColor: `${selectedDonationData.color}15` }}
                >
                  <div className="text-6xl mb-3">{selectedDonationData.icon}</div>
                  <h3 className="mb-2 font-medium text-xl">{selectedDonationData.type}</h3>
                  <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {selectedDonationData.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {selectedDonationData.frequency}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-muted-foreground mb-4 leading-relaxed">{selectedDonationData.longDescription}</p>
                </div>

                <div>
                  <h4 className="mb-3 flex items-center gap-2 font-medium">
                    <AlertCircle className="w-5 h-5 text-brand-600" />
                    Requisits
                  </h4>
                  <ul className="space-y-2">
                    {selectedDonationData.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-600 mt-1.5 shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="mb-3 flex items-center gap-2 font-medium">
                    <Target className="w-5 h-5 text-brand-600" />
                    Beneficis
                  </h4>
                  <ul className="space-y-2">
                    {selectedDonationData.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="mb-3 flex items-center gap-2 font-medium">
                    <Activity className="w-5 h-5 text-brand-600" />
                    Procés
                  </h4>
                  <p className="text-sm text-muted-foreground bg-muted/30 rounded-xl p-4 border border-border/50">
                    {selectedDonationData.process}
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-green-900">Recompensa</span>
                    <div className="flex items-center gap-2">
                      <Coins className="w-5 h-5 text-green-700" />
                      <span className="font-medium text-green-900">+{selectedDonationData.tokens} tokens</span>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full bg-brand-600 hover:bg-brand-700 text-white h-12 rounded-xl text-base font-medium shadow-md hover:shadow-lg transition-all"
                  onClick={() => {
                    setSelectedDonationType(null);
                    handleNavigateToCalendar();
                  }}
                >
                  Reservar Cita Ara
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

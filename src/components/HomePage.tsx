import { Droplet, Calendar, Coins, ChevronRight, AlertCircle, X, Users, Target, Clock, Activity } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useState, useRef } from 'react';

interface HomePageProps {
  tokens: number;
  onNavigateToCalendar: () => void;
}

export function HomePage({ tokens, onNavigateToCalendar }: HomePageProps) {
  const [selectedCampaign, setSelectedCampaign] = useState<number | null>(null);
  const [selectedDonationType, setSelectedDonationType] = useState<number | null>(null);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const campaigns = [
    {
      id: 1,
      title: 'Campanya de Sant Jordi',
      description: 'Ajuda\'ns a arribar a 500 donacions',
      longDescription: 'Aquest Sant Jordi, necessitem la teva col·laboració per arribar a 500 donacions de sang. Cada rosa que regales pot anar acompanyada d\'un gest que salva vides.',
      progress: 73,
      current: 365,
      goal: 500,
      urgent: false,
      image: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800&auto=format&fit=crop',
      bonusTokens: 5,
      endDate: '23 d\'Abril'
    },
    {
      id: 2,
      title: 'Reserves baixes de O-',
      description: 'Necessitem la teva ajuda urgentment',
      longDescription: 'Les reserves de sang del tipus O negatiu estan en nivells crítics. Aquest tipus de sang és universal i pot salvar qualsevol persona en una emergència.',
      progress: 34,
      current: 68,
      goal: 200,
      urgent: true,
      image: 'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=800&auto=format&fit=crop',
      bonusTokens: 10,
      endDate: 'Urgent'
    }
  ];

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

  const selectedCampaignData = campaigns.find(c => c.id === selectedCampaign);
  const selectedDonationData = donationTypes[selectedDonationType !== null ? selectedDonationType : -1];

  const handleTouchStart = (e: React.TouchEvent) => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer && scrollContainer.scrollTop > 0) {
      // Si no estem al top, no permetem drag
      return;
    }
    startY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
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
    <div className="h-full overflow-y-auto bg-gray-50 relative">
      {/* Header with Glass Effect */}
      <div className="glass-header text-white p-6 pb-8 md:py-8">
        <div className="max-w-4xl mx-auto md:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-white">Hola, Maria!</h2>
              <p className="text-white/90 text-sm mt-1">Estàs apte per donar</p>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-2xl px-4 py-2.5 flex items-center gap-2 border border-white/30">
              <Coins className="w-5 h-5" />
              <span className="font-medium">{tokens} tokens</span>
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
          className="w-full bg-[#E30613] hover:bg-[#C00510] text-white h-14 rounded-2xl shadow-lg hover:shadow-xl transition-all hover-lift"
          onClick={onNavigateToCalendar}
        >
          <Calendar className="w-5 h-5 mr-2" />
          Reservar Cita Ara
        </Button>

        {/* Active Campaigns */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3>Campanyes Actives</h3>
            <button className="text-[#E30613] text-sm flex items-center gap-1">
              Veure tot
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {campaigns.map((campaign) => (
              <div 
                key={campaign.id}
                onClick={() => setSelectedCampaign(campaign.id)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover-lift cursor-pointer"
              >
                <div 
                  className="h-36 bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${campaign.image})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  {campaign.urgent && (
                    <Badge className="absolute top-3 right-3 bg-red-500 text-white border-0">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Urgent
                    </Badge>
                  )}
                </div>
                <div className="p-4">
                  <h4 className="mb-1">{campaign.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{campaign.description}</p>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Progrés</span>
                    <span className="text-sm font-medium">{campaign.current}/{campaign.goal}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#E30613] rounded-full transition-all duration-500"
                      style={{ width: `${campaign.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Donation Types */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3>Tipus de Donacions</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {donationTypes.map((donation, index) => (
              <div
                key={index}
                onClick={() => setSelectedDonationType(index)}
                className="bg-white rounded-2xl p-4 cursor-pointer hover-lift"
              >
                <div className="text-4xl mb-3">{donation.icon}</div>
                <h4 className="text-sm mb-1">{donation.type}</h4>
                <p className="text-xs text-gray-600 mb-2">{donation.duration}</p>
                <div className="flex items-center gap-1 text-[#E30613]">
                  <Coins className="w-3 h-3" />
                  <span className="text-xs font-medium">+{donation.tokens} tokens</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Info Banner */}
        <div className="bg-gradient-to-r from-[#E30613] to-[#FF4444] rounded-2xl p-5 text-white">
          <h3 className="text-white mb-2">Sabies que...?</h3>
          <p className="text-white/90 text-sm">
            Una sola donació de sang pot salvar fins a 3 vides. El teu gest és imprescindible!
          </p>
        </div>
      </div>

      {/* Campaign Detail Modal */}
      {selectedCampaign && selectedCampaignData && (
        <div 
          className="fixed inset-0 glass-overlay z-50"
          onClick={() => setSelectedCampaign(null)}
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

            <div ref={scrollContainerRef} className="h-full overflow-y-auto pb-6">
              <div className="sticky top-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 p-4 flex items-center justify-between z-10">
                <h3>{selectedCampaignData.title}</h3>
                <button 
                  onClick={() => setSelectedCampaign(null)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div 
                  className="h-48 bg-cover bg-center rounded-2xl relative overflow-hidden"
                  style={{ backgroundImage: `url(${selectedCampaignData.image})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  {selectedCampaignData.urgent && (
                    <Badge className="absolute top-3 right-3 bg-red-500 text-white border-0">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Urgent
                    </Badge>
                  )}
                </div>

                <div>
                  <p className="text-gray-600 mb-4">{selectedCampaignData.longDescription}</p>
                  
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Objectiu</span>
                      <span className="font-medium">{selectedCampaignData.goal} donacions</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Actual</span>
                      <span className="font-medium">{selectedCampaignData.current} donacions</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Finalitza</span>
                      <span className="font-medium">{selectedCampaignData.endDate}</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Progrés</span>
                      <span className="text-sm font-medium">{selectedCampaignData.progress}%</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#E30613] to-[#FF4444] rounded-full transition-all duration-500"
                        style={{ width: `${selectedCampaignData.progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Coins className="w-5 h-5 text-green-700" />
                    <span className="font-medium text-green-900">Bonus especial</span>
                  </div>
                  <p className="text-sm text-green-800">
                    +{selectedCampaignData.bonusTokens} tokens extra per donar durant aquesta campanya
                  </p>
                </div>

                <Button 
                  className="w-full bg-[#E30613] hover:bg-[#C00510] text-white h-12 rounded-xl"
                  onClick={() => {
                    setSelectedCampaign(null);
                    onNavigateToCalendar();
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
          className="fixed inset-0 glass-overlay z-50"
          onClick={() => setSelectedDonationType(null)}
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

            <div ref={scrollContainerRef} className="h-full overflow-y-auto pb-6">
              <div className="sticky top-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 p-4 flex items-center justify-between z-10">
                <h3>{selectedDonationData.type}</h3>
                <button 
                  onClick={() => setSelectedDonationType(null)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div 
                  className="rounded-2xl p-8 text-center"
                  style={{ backgroundColor: `${selectedDonationData.color}15` }}
                >
                  <div className="text-6xl mb-3">{selectedDonationData.icon}</div>
                  <h3 className="mb-2">{selectedDonationData.type}</h3>
                  <div className="flex items-center justify-center gap-4 text-sm">
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
                  <p className="text-gray-600 mb-4">{selectedDonationData.longDescription}</p>
                </div>

                <div>
                  <h4 className="mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-[#E30613]" />
                    Requisits
                  </h4>
                  <ul className="space-y-2">
                    {selectedDonationData.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#E30613] mt-1.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-[#E30613]" />
                    Beneficis
                  </h4>
                  <ul className="space-y-2">
                    {selectedDonationData.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="mb-3 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-[#E30613]" />
                    Procés
                  </h4>
                  <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-4">
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
                  className="w-full bg-[#E30613] hover:bg-[#C00510] text-white h-12 rounded-xl"
                  onClick={() => {
                    setSelectedDonationType(null);
                    onNavigateToCalendar();
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
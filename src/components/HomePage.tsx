import { Droplet, Calendar, Coins, ChevronRight, AlertCircle, X, Users, Target, Clock, Activity } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useState } from 'react';

interface HomePageProps {
  tokens: number;
  onNavigateToCalendar: () => void;
}

export function HomePage({ tokens, onNavigateToCalendar }: HomePageProps) {
  const [selectedCampaign, setSelectedCampaign] = useState<number | null>(null);
  const [selectedDonationType, setSelectedDonationType] = useState<number | null>(null);

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
      longDescription: 'La donació de sang total és la més comuna. Es recull aproximadament 450 ml de sang que posteriorment es separa en diferents components: glòbuls vermells, plasma i plaquetes.',
      requirements: [
        'Pesar més de 50 kg',
        'Tenir entre 18 i 65 anys',
        'Estar en bon estat de salut',
        'No haver donat en els últims 2 mesos'
      ],
      benefits: [
        'Ajudes a persones amb anèmia',
        'Essencial per cirurgies',
        'Crucial en accidents i emergències'
      ],
      tokens: 15,
      process: 'Entrevista mèdica → Extracció (10 min) → Refrigeri'
    },
    {
      type: 'Plaquetes',
      duration: '90 min',
      frequency: 'Cada 15 dies',
      icon: '💉',
      color: '#FF6B6B',
      longDescription: 'La donació de plaquetes és un procés anomenat afèresi. Només es recullen les plaquetes i la resta de components de la sang retornen al donant.',
      requirements: [
        'Pesar més de 50 kg',
        'Haver donat sang prèviament',
        'Bon recompte plaquetari',
        'Disponibilitat de temps'
      ],
      benefits: [
        'Vital per pacients amb càncer',
        'Tracta malalties de la sang',
        'Essencial en quimioteràpia'
      ],
      tokens: 20,
      process: 'Valoració → Connexió màquina afèresi → Extracció selectiva'
    },
    {
      type: 'Plasma',
      duration: '60 min',
      frequency: 'Cada 15 dies',
      icon: '💧',
      color: '#FFA500',
      longDescription: 'El plasma és la part líquida de la sang. Conté proteïnes, anticossos i factors de coagulació essencials per molts tractaments.',
      requirements: [
        'Pesar més de 50 kg',
        'Bon nivell de proteïnes',
        'Estar ben hidratat',
        'No haver donat plasma en 15 dies'
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

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="bg-[#E30613] text-white p-6 pb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white">Hola, Maria!</h2>
            <p className="text-white/90 text-sm mt-1">Estàs apte per donar</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2 flex items-center gap-2">
            <Coins className="w-5 h-5" />
            <span>{tokens} tokens</span>
          </div>
        </div>

        {/* Next Donation Info */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5" />
            <span className="text-sm">Propera donació permesa</span>
          </div>
          <p className="text-white">Ara mateix!</p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* CTA Button */}
        <Button 
          className="w-full bg-[#E30613] hover:bg-[#C00510] text-white h-14 shadow-lg"
          onClick={onNavigateToCalendar}
        >
          <Calendar className="w-5 h-5 mr-2" />
          Reservar Cita Ara
        </Button>

        {/* Active Campaigns */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3>Campanyes Actives</h3>
            <button className="text-[#E30613] text-sm flex items-center gap-1">
              Veure tot
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {campaigns.map((campaign) => (
              <div 
                key={campaign.id}
                onClick={() => setSelectedCampaign(campaign.id)}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div 
                  className="h-32 bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${campaign.image})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
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
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Progrés</span>
                      <span>{campaign.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#E30613] transition-all"
                        style={{ width: `${campaign.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What Can I Donate */}
        <section>
          <h3 className="mb-4">Què puc donar?</h3>
          <div className="grid grid-cols-2 gap-3">
            {donationTypes.map((donation, index) => (
              <div
                key={index}
                onClick={() => setSelectedDonationType(index)}
                className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-[#E30613]"
              >
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 text-2xl"
                  style={{ backgroundColor: `${donation.color}15` }}
                >
                  {donation.icon}
                </div>
                <h4 className="text-sm mb-2">{donation.type}</h4>
                <p className="text-xs text-gray-600 mb-1">
                  <Droplet className="w-3 h-3 inline mr-1" />
                  {donation.duration}
                </p>
                <p className="text-xs text-gray-600">
                  <Calendar className="w-3 h-3 inline mr-1" />
                  {donation.frequency}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Info Banner */}
        <div className="bg-gradient-to-r from-[#E30613] to-[#FF4444] rounded-2xl p-6 text-white">
          <h3 className="text-white mb-2">Sabies que...?</h3>
          <p className="text-white/90 text-sm">
            Cada donació de sang pot salvar fins a <strong>3 vides</strong>. 
            Amb les teves donacions, has ajudat a salvar 12 persones! 🎉
          </p>
        </div>
      </div>

      {/* Campaign Detail Modal */}
      {selectedCampaign && selectedCampaignData && (
        <div className="absolute inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-3xl w-full max-h-[85%] overflow-y-auto">
            <div className="relative">
              <div 
                className="h-56 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${selectedCampaignData.image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <button 
                  onClick={() => setSelectedCampaign(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                {selectedCampaignData.urgent && (
                  <Badge className="absolute top-4 left-4 bg-red-500 text-white border-0">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Campanya Urgent
                  </Badge>
                )}
                <div className="absolute bottom-4 left-4 right-4">
                  <h2 className="text-white mb-2">{selectedCampaignData.title}</h2>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Progress Card */}
                <div className="bg-gradient-to-br from-[#E30613]/10 to-[#FF4444]/10 rounded-2xl p-5 border-2 border-[#E30613]/20">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Progrés actual</p>
                      <p className="text-3xl text-[#E30613]">{selectedCampaignData.progress}%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">Objectiu</p>
                      <p className="text-xl">{selectedCampaignData.current}/{selectedCampaignData.goal}</p>
                    </div>
                  </div>
                  <div className="h-3 bg-white rounded-full overflow-hidden mb-3">
                    <div 
                      className="h-full bg-gradient-to-r from-[#E30613] to-[#FF4444] transition-all"
                      style={{ width: `${selectedCampaignData.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>Encara necessitem {selectedCampaignData.goal - selectedCampaignData.current} donacions més!</span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="mb-3">Sobre aquesta campanya</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedCampaignData.longDescription}
                  </p>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                    <Coins className="w-6 h-6 text-green-600 mb-2" />
                    <p className="text-xs text-green-800 mb-1">Bonus tokens</p>
                    <p className="text-lg text-green-900">+{selectedCampaignData.bonusTokens} extra</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <Target className="w-6 h-6 text-blue-600 mb-2" />
                    <p className="text-xs text-blue-800 mb-1">Finalitza</p>
                    <p className="text-lg text-blue-900">{selectedCampaignData.endDate}</p>
                  </div>
                </div>

                {/* Important Info */}
                <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                  <h4 className="text-sm text-yellow-900 mb-2">💡 Informació important</h4>
                  <ul className="text-xs text-yellow-800 space-y-1">
                    <li>• Tots els tipus de sang són benvinguts</li>
                    <li>• Rebràs {15 + selectedCampaignData.bonusTokens} tokens per aquesta donació</li>
                    <li>• Durada aproximada: 30-45 minuts</li>
                  </ul>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3 pt-2">
                  <Button 
                    className="w-full bg-[#E30613] hover:bg-[#C00510] text-white h-14"
                    onClick={() => {
                      setSelectedCampaign(null);
                      onNavigateToCalendar();
                    }}
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Reservar Cita per aquesta Campanya
                  </Button>
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={() => setSelectedCampaign(null)}
                  >
                    Tancar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Donation Type Detail Modal */}
      {selectedDonationType !== null && selectedDonationData && (
        <div className="absolute inset-0 bg-black/50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-3xl w-full max-h-[90%] overflow-y-auto">
            <div className="relative">
              {/* Header */}
              <div 
                className="p-6 pb-8 relative"
                style={{ backgroundColor: `${selectedDonationData.color}15` }}
              >
                <button 
                  onClick={() => setSelectedDonationType(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                
                <div className="flex items-center gap-4 mb-4">
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                    style={{ backgroundColor: `${selectedDonationData.color}30` }}
                  >
                    {selectedDonationData.icon}
                  </div>
                  <div>
                    <h2 style={{ color: selectedDonationData.color }}>{selectedDonationData.type}</h2>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {selectedDonationData.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Activity className="w-4 h-4" />
                        {selectedDonationData.frequency}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Description */}
                <div>
                  <h3 className="mb-3">Què és?</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedDonationData.longDescription}
                  </p>
                </div>

                {/* Tokens Card */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-5 border-2 border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-800 mb-1">Guanyaràs per donació</p>
                      <div className="flex items-center gap-2">
                        <Coins className="w-6 h-6 text-green-600" />
                        <p className="text-3xl text-green-900">{selectedDonationData.tokens}</p>
                        <span className="text-green-700">tokens</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Requirements */}
                <div>
                  <h3 className="mb-3">Requisits</h3>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                    {selectedDonationData.requirements.map((req, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-[#E30613] flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <p className="text-sm text-gray-700">{req}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                <div>
                  <h3 className="mb-3">A qui ajudes?</h3>
                  <div className="space-y-3">
                    {selectedDonationData.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-3 bg-blue-50 rounded-xl p-4 border border-blue-100">
                        <span className="text-2xl">💙</span>
                        <p className="text-sm text-blue-900">{benefit}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Process */}
                <div>
                  <h3 className="mb-3">Com és el procés?</h3>
                  <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                    <p className="text-sm text-purple-900">{selectedDonationData.process}</p>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3 pt-2">
                  <Button 
                    className="w-full h-14 text-white"
                    style={{ backgroundColor: selectedDonationData.color }}
                    onClick={() => {
                      setSelectedDonationType(null);
                      onNavigateToCalendar();
                    }}
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Reservar Donació de {selectedDonationData.type}
                  </Button>
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={() => setSelectedDonationType(null)}
                  >
                    Tancar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
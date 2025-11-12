import { useState } from 'react';
import { 
  User, 
  Calendar, 
  Heart, 
  Award, 
  Settings, 
  Bell, 
  Shield, 
  FileText,
  Share2,
  ChevronRight,
  Trophy,
  Droplet
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface PerfilPageProps {
  tokens: number;
}

export function PerfilPage({ tokens }: PerfilPageProps) {
  const [activeSection, setActiveSection] = useState<'overview' | 'history' | 'settings'>('overview');

  const donationHistory = [
    {
      id: 1,
      date: '2025-10-15',
      type: 'Sang Total',
      location: 'Hospital Clínic',
      tokens: 15,
      status: 'completed'
    },
    {
      id: 2,
      date: '2025-08-20',
      type: 'Sang Total',
      location: 'Universitat UB',
      tokens: 15,
      status: 'completed'
    },
    {
      id: 3,
      date: '2025-06-10',
      type: 'Plasma',
      location: 'Hospital Clínic',
      tokens: 20,
      status: 'completed'
    },
    {
      id: 4,
      date: '2025-04-05',
      type: 'Sang Total',
      location: 'Banc de Sang Gràcia',
      tokens: 15,
      status: 'completed'
    }
  ];

  const achievements = [
    { id: 1, name: 'Primera Donació', icon: '🏆', unlocked: true },
    { id: 2, name: '5 Donacions', icon: '⭐', unlocked: false },
    { id: 3, name: 'Donant Regular', icon: '💎', unlocked: true },
    { id: 4, name: 'Heroi de Platí', icon: '👑', unlocked: false }
  ];

  const totalDonations = donationHistory.length;
  const livesSaved = totalDonations * 3;
  const totalTokensEarned = donationHistory.reduce((sum, d) => sum + d.tokens, 0);

  if (activeSection === 'history') {
    return (
      <div className="h-full overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center gap-3 z-10">
          <button onClick={() => setActiveSection('overview')} className="text-gray-600">
            ← Tornar
          </button>
          <h3>Historial de Donacions</h3>
        </div>

        <div className="p-6 space-y-4">
          {donationHistory.map((donation, index) => (
            <div key={donation.id} className="bg-white rounded-2xl p-4 shadow-md">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-sm mb-1">{donation.type}</h4>
                  <p className="text-xs text-gray-600">{donation.location}</p>
                </div>
                <Badge className="bg-green-100 text-green-700 border-0">
                  +{donation.tokens} tokens
                </Badge>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(donation.date).toLocaleDateString('ca-ES', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </span>
                <span>Donació #{totalDonations - index}</span>
              </div>
            </div>
          ))}

          <div className="bg-gradient-to-r from-[#E30613] to-[#FF4444] rounded-2xl p-6 text-white text-center">
            <Heart className="w-12 h-12 mx-auto mb-3 text-white" />
            <h3 className="text-white mb-2">Gràcies pel teu compromís!</h3>
            <p className="text-white/90 text-sm">
              Les teves {totalDonations} donacions han ajudat a salvar {livesSaved} vides
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (activeSection === 'settings') {
    return (
      <div className="h-full overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center gap-3 z-10">
          <button onClick={() => setActiveSection('overview')} className="text-gray-600">
            ← Tornar
          </button>
          <h3>Configuració</h3>
        </div>

        <div className="p-6 space-y-6">
          <section>
            <h4 className="text-sm text-gray-600 mb-3">Notificacions</h4>
            <div className="bg-white rounded-2xl divide-y divide-gray-100 shadow-md overflow-hidden">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="text-sm">Recordatoris de cita</span>
                </div>
                <div className="w-12 h-6 bg-[#E30613] rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="text-sm">Campanyes urgents</span>
                </div>
                <div className="w-12 h-6 bg-[#E30613] rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="text-sm">Noves recompenses</span>
                </div>
                <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
            </div>
          </section>

          <section>
            <h4 className="text-sm text-gray-600 mb-3">Compte</h4>
            <div className="bg-white rounded-2xl divide-y divide-gray-100 shadow-md overflow-hidden">
              <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-gray-600" />
                  <span className="text-sm">Privacitat i dades</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
              <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <span className="text-sm">Termes i condicions</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </section>

          <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
            Tancar sessió
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-[#E30613] to-[#FF4444] text-white p-6 pb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-white mb-1">Maria García</h2>
            <p className="text-white/90 text-sm">maria.garcia@email.com</p>
            <Badge className="bg-white/20 text-white border-0 mt-2">
              <Trophy className="w-3 h-3 mr-1" />
              Donant de Bronze
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <Droplet className="w-5 h-5 mx-auto mb-1 text-white" />
            <p className="text-2xl text-white mb-1">{totalDonations}</p>
            <p className="text-xs text-white/80">Donacions</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <Heart className="w-5 h-5 mx-auto mb-1 text-white" />
            <p className="text-2xl text-white mb-1">{livesSaved}</p>
            <p className="text-xs text-white/80">Vides salvades</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
            <Award className="w-5 h-5 mx-auto mb-1 text-white" />
            <p className="text-2xl text-white mb-1">{tokens}</p>
            <p className="text-xs text-white/80">Tokens</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Quick Actions */}
        <section>
          <div className="bg-white rounded-2xl divide-y divide-gray-100 shadow-md overflow-hidden">
            <button 
              onClick={() => setActiveSection('history')}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[#E30613]" />
                <span className="text-sm">Historial de donacions</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-[#E30613]" />
                <span className="text-sm">Resultats d'analítiques</span>
              </div>
              <Badge className="bg-green-100 text-green-700 border-0">Disponible</Badge>
            </button>
            <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <Share2 className="w-5 h-5 text-[#E30613]" />
                <span className="text-sm">Compartir el meu impacte</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <button 
              onClick={() => setActiveSection('settings')}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-[#E30613]" />
                <span className="text-sm">Configuració</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </section>

        {/* Achievements */}
        <section>
          <h3 className="mb-4">Els teus assoliments</h3>
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`rounded-2xl p-4 text-center transition-all ${
                  achievement.unlocked
                    ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200'
                    : 'bg-gray-100 opacity-50'
                }`}
              >
                <div className="text-4xl mb-2">{achievement.icon}</div>
                <p className="text-xs">{achievement.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Next Donation Info */}
        <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
          <h4 className="text-sm mb-3 text-blue-900">Propera donació permesa</h4>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-800 mb-1">Ara mateix!</p>
              <p className="text-xs text-blue-700">Ja pots reservar una nova cita</p>
            </div>
            <Button className="bg-[#E30613] hover:bg-[#C00510] text-white">
              Reservar
            </Button>
          </div>
        </div>

        {/* Total Impact */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white text-center">
          <h3 className="text-white mb-2">El teu impacte total</h3>
          <p className="text-4xl mb-2 text-white">{totalTokensEarned}</p>
          <p className="text-white/90 text-sm">Tokens guanyats en total</p>
        </div>
      </div>
    </div>
  );
}

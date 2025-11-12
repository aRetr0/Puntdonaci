import { useState } from 'react';
import { Heart, Calendar, Award, Settings, ChevronRight, Bell, Lock, HelpCircle, LogOut, User, Share2, Instagram, Twitter, MessageCircle, Copy, Download, TrendingUp, Activity } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { toast } from 'sonner@2.0.3';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PerfilPageProps {
  tokens: number;
  userEmail?: string;
  userData?: any;
  onLogout?: () => void;
}

export function PerfilPage({ tokens, userEmail, userData, onLogout }: PerfilPageProps) {
  const [activeSection, setActiveSection] = useState<'overview' | 'history' | 'settings'>('overview');
  const [notifications, setNotifications] = useState({
    appointments: true,
    urgent: true,
    rewards: false
  });
  const [showShareDialog, setShowShareDialog] = useState(false);

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

  // Data per gràfics
  const donationTrendData = [
    { month: 'Abr', donations: 1, lives: 3, tokens: 15 },
    { month: 'Jun', donations: 2, lives: 6, tokens: 30 },
    { month: 'Ago', donations: 3, lives: 9, tokens: 45 },
    { month: 'Oct', donations: 4, lives: 12, tokens: 65 },
  ];

  const donationTypeData = [
    { name: 'Sang Total', value: 3, color: '#E30613' },
    { name: 'Plasma', value: 1, color: '#FF6B6B' },
  ];

  const monthlyTokensData = [
    { month: 'Abr', tokens: 15 },
    { month: 'Mai', tokens: 0 },
    { month: 'Jun', tokens: 15 },
    { month: 'Jul', tokens: 0 },
    { month: 'Ago', tokens: 20 },
    { month: 'Set', tokens: 0 },
    { month: 'Oct', tokens: 15 },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-md px-4 py-3 rounded-xl shadow-xl border border-gray-100">
          <p className="text-xs text-gray-500 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
              <span className="text-gray-600">{entry.name}:</span> {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (activeSection === 'history') {
    return (
      <div className="h-full overflow-y-auto bg-gray-50">
        <div className="sticky top-0 bg-white/95 backdrop-blur-xl border-b border-gray-200 p-4 flex items-center gap-3 z-10">
          <button onClick={() => setActiveSection('overview')} className="text-gray-600">
            ← Tornar
          </button>
          <h3>Historial de Donacions</h3>
        </div>

        <div className="p-4 space-y-3 pb-24">
          {donationHistory.map((donation, index) => (
            <div key={donation.id} className="bg-white rounded-2xl p-4 shadow-sm">
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
      <div className="h-full overflow-y-auto bg-gray-50">
        <div className="sticky top-0 bg-white/95 backdrop-blur-xl border-b border-gray-200 p-4 flex items-center gap-3 z-10">
          <button onClick={() => setActiveSection('overview')} className="text-gray-600">
            ← Tornar
          </button>
          <h3>Configuració</h3>
        </div>

        <div className="p-4 space-y-5 pb-24">
          <section>
            <h4 className="text-sm text-gray-600 mb-3 px-1">Notificacions</h4>
            <div className="bg-white rounded-2xl divide-y divide-gray-100 shadow-sm overflow-hidden">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="text-sm">Recordatoris de cita</span>
                </div>
                <button 
                  type="button"
                  className={`w-12 h-6 rounded-full relative transition-all ${
                    notifications.appointments ? 'bg-[#E30613]' : 'bg-gray-300'
                  }`}
                  onClick={() => setNotifications({ ...notifications, appointments: !notifications.appointments })}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                    notifications.appointments ? 'right-1' : 'left-1'
                  }`} />
                </button>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="text-sm">Campanyes urgents</span>
                </div>
                <button 
                  type="button"
                  className={`w-12 h-6 rounded-full relative transition-all ${
                    notifications.urgent ? 'bg-[#E30613]' : 'bg-gray-300'
                  }`}
                  onClick={() => setNotifications({ ...notifications, urgent: !notifications.urgent })}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                    notifications.urgent ? 'right-1' : 'left-1'
                  }`} />
                </button>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="text-sm">Noves recompenses</span>
                </div>
                <button 
                  type="button"
                  className={`w-12 h-6 rounded-full relative transition-all ${
                    notifications.rewards ? 'bg-[#E30613]' : 'bg-gray-300'
                  }`}
                  onClick={() => setNotifications({ ...notifications, rewards: !notifications.rewards })}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                    notifications.rewards ? 'right-1' : 'left-1'
                  }`} />
                </button>
              </div>
            </div>
          </section>

          <section>
            <h4 className="text-sm text-gray-600 mb-3 px-1">Compte</h4>
            <div className="bg-white rounded-2xl divide-y divide-gray-100 shadow-sm overflow-hidden">
              <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-gray-600" />
                  <span className="text-sm">Privacitat i dades</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
              <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-gray-600" />
                  <span className="text-sm">Termes i condicions</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </section>

          <Button 
            variant="outline" 
            className="w-full text-red-600 border-red-200 hover:bg-red-50 h-12 rounded-xl" 
            onClick={onLogout}
          >
            Tancar sessió
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      {/* Profile Header with Glass Effect */}
      <div className="glass-header text-white p-6 pb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
            <User className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-white mb-1">{userData?.name || 'Maria García'}</h2>
            <p className="text-white/90 text-sm">{userEmail || 'maria.garcia@email.com'}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                <Award className="w-3 h-3 mr-1" />
                Donant de Bronze
              </Badge>
              {userData?.bloodType && (
                <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                  {userData.bloodType}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/15 backdrop-blur-md rounded-xl p-3 text-center border border-white/20">
            <Heart className="w-5 h-5 mx-auto mb-1 text-white" />
            <p className="text-2xl text-white mb-1">{totalDonations}</p>
            <p className="text-xs text-white/80">Donacions</p>
          </div>
          <div className="bg-white/15 backdrop-blur-md rounded-xl p-3 text-center border border-white/20">
            <Heart className="w-5 h-5 mx-auto mb-1 text-white" />
            <p className="text-2xl text-white mb-1">{livesSaved}</p>
            <p className="text-xs text-white/80">Vides salvades</p>
          </div>
          <div className="bg-white/15 backdrop-blur-md rounded-xl p-3 text-center border border-white/20">
            <Award className="w-5 h-5 mx-auto mb-1 text-white" />
            <p className="text-2xl text-white mb-1">{tokens}</p>
            <p className="text-xs text-white/80">Tokens</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-5 pb-24">
        {/* Quick Actions */}
        <section>
          <div className="bg-white rounded-2xl divide-y divide-gray-100 shadow-sm overflow-hidden">
            <button 
              onClick={() => setActiveSection('history')}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[#E30613]" />
                <span className="text-sm">Historial de donacions</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-[#E30613]" />
                <span className="text-sm">Resultats d'analítiques</span>
              </div>
              <Badge className="bg-green-100 text-green-700 border-0">Disponible</Badge>
            </button>
            <button 
              onClick={() => setShowShareDialog(true)}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-[#E30613]" />
                <span className="text-sm">Compartir el meu impacte</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <button 
              onClick={() => setActiveSection('settings')}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
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
          <h3 className="mb-3 px-1">Els teus assoliments</h3>
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`rounded-2xl p-4 text-center transition-all ${
                  achievement.unlocked
                    ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200'
                    : 'bg-white opacity-50 border border-gray-200'
                }`}
              >
                <div className="text-4xl mb-2">{achievement.icon}</div>
                <p className="text-xs">{achievement.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Next Donation Info */}
        <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
          <h4 className="text-sm mb-3 text-blue-900">Propera donació permesa</h4>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-800 mb-1 font-medium">Ara mateix!</p>
              <p className="text-xs text-blue-700">Ja pots reservar una nova cita</p>
            </div>
            <Button className="bg-[#E30613] hover:bg-[#C00510] text-white rounded-xl">
              Reservar
            </Button>
          </div>
        </div>

        {/* Gràfic: Evolució de Donacions */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="mb-4">
            <h4 className="text-sm text-gray-900 mb-1">Evolució de donacions</h4>
            <p className="text-xs text-gray-500">Seguiment mensual del teu progrés</p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={donationTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12, fill: '#6B7280' }}
                stroke="#E5E7EB"
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#6B7280' }}
                stroke="#E5E7EB"
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="donations" 
                name="Donacions"
                stroke="#E30613" 
                strokeWidth={3}
                dot={{ r: 5, fill: '#E30613' }}
                activeDot={{ r: 7 }}
              />
              <Line 
                type="monotone" 
                dataKey="lives" 
                name="Vides"
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ r: 5, fill: '#10B981' }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Gràfic: Tokens Mensuals */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="mb-4">
            <h4 className="text-sm text-gray-900 mb-1">Tokens guanyats</h4>
            <p className="text-xs text-gray-500">Recompenses mensuals acumulades</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyTokensData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12, fill: '#6B7280' }}
                stroke="#E5E7EB"
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#6B7280' }}
                stroke="#E5E7EB"
              />
              <Tooltip 
                content={<CustomTooltip />}
                cursor={{ fill: 'rgba(227, 6, 19, 0.1)' }}
              />
              <Bar 
                dataKey="tokens" 
                name="Tokens"
                fill="#E30613"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Comparteix el teu impacte</DialogTitle>
            <DialogDescription>
              Inspira altres persones compartint les teves donacions de sang.
            </DialogDescription>
          </DialogHeader>
          
          {/* Impact Preview Card */}
          <div className="bg-gradient-to-r from-[#E30613] to-[#FF4444] rounded-2xl p-6 text-white text-center my-4">
            <Heart className="w-12 h-12 mx-auto mb-3 text-white" />
            <h3 className="text-white mb-2">He salvat {livesSaved} vides</h3>
            <p className="text-white/90 text-sm">
              {totalDonations} donacions amb el Banc de Sang
            </p>
            <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-white/20">
              <div>
                <p className="text-2xl text-white">{totalDonations}</p>
                <p className="text-xs text-white/80">Donacions</p>
              </div>
              <div>
                <p className="text-2xl text-white">{tokens}</p>
                <p className="text-xs text-white/80">Tokens</p>
              </div>
            </div>
          </div>

          {/* Share Options */}
          <div className="space-y-3">
            <button
              onClick={() => {
                window.open(`https://www.instagram.com/`, '_blank');
                toast.success('Obrint Instagram...');
              }}
              className="w-full p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Instagram className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm">Instagram Stories</p>
                <p className="text-xs text-gray-500">Compartir a Stories</p>
              </div>
            </button>

            <button
              onClick={() => {
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`He salvat ${livesSaved} vides donant sang amb @BancSangTeixits! 💪❤️ #DonantDeSang`)}`, '_blank');
                toast.success('Obrint Twitter...');
              }}
              className="w-full p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-blue-400 rounded-lg flex items-center justify-center">
                <Twitter className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm">Twitter/X</p>
                <p className="text-xs text-gray-500">Compartir com a tweet</p>
              </div>
            </button>

            <button
              onClick={() => {
                const message = `He salvat ${livesSaved} vides donant sang! 🩸❤️ Uneix-te a mi i dona sang amb el Banc de Sang i Teixits de Catalunya.`;
                window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
                toast.success('Obrint WhatsApp...');
              }}
              className="w-full p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm">WhatsApp</p>
                <p className="text-xs text-gray-500">Enviar missatge</p>
              </div>
            </button>

            <button
              onClick={async () => {
                const shareUrl = 'https://donarsang.gencat.cat';
                try {
                  await navigator.clipboard.writeText(shareUrl);
                  toast.success('Enllaç copiat al portapapers!');
                } catch (error) {
                  // Fallback si el clipboard API no està disponible
                  toast.success('Enllaç: donarsang.gencat.cat');
                }
              }}
              className="w-full p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
                <Copy className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm">Copiar enllaç</p>
                <p className="text-xs text-gray-500">Compartir enllaç directe</p>
              </div>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
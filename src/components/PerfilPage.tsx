import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  User, Award, Heart, Calendar, Settings, ChevronRight,
  Bell, Lock, HelpCircle, Loader2, Instagram, Twitter,
  MessageCircle, Copy, ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/authStore';
import { useDonations, useDonationAnalytics } from '@/hooks';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Donation, AnalyticsData } from '@/types';

interface TooltipPayload {
  name: string;
  value: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-xl text-xs">
        <p className="text-xs text-gray-500 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
            <span className="text-gray-600">{entry.name}:</span> {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function PerfilPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { data: donationsResponse, isLoading: loadingDonations } = useDonations();
  const { data: analyticsResponse, isLoading: loadingAnalytics } = useDonationAnalytics();

  const [activeSection, setActiveSection] = useState<'overview' | 'history' | 'settings'>('overview');
  const [showPrivacyDialog, setShowPrivacyDialog] = useState(false);
  const [showTermsDialog, setShowTermsDialog] = useState(false);
  const [notifications, setNotifications] = useState({
    appointments: true,
    urgent: true,
    rewards: false
  });
  const [showShareDialog, setShowShareDialog] = useState(false);

  const tokens = user?.tokens || 0;
  const donationHistory = donationsResponse?.donations || [];
  const analyticsData = analyticsResponse || {} as AnalyticsData;

  const totalDonations = user?.donationCount || 0;
  const livesSaved = Math.floor(totalDonations * 3);
  const donationTrendData = analyticsData.donationEvolution || [];
  const monthlyTokensData = analyticsData.monthlyTokens || [];

  const achievements = [
    { id: 1, name: 'Primera Donació', icon: '🏆', unlocked: user?.donationCount && user.donationCount >= 1 },
    { id: 2, name: '5 Donacions', icon: '⭐', unlocked: user?.donationCount && user.donationCount >= 5 },
    { id: 3, name: 'Donant Regular', icon: '💎', unlocked: user?.donationCount && user.donationCount >= 3 },
    { id: 4, name: 'Heroi de Platí', icon: '👑', unlocked: user?.donationCount && user.donationCount >= 10 }
  ];

  const renderContent = () => {
    if (activeSection === 'history') {
      return (
        <>
          <div className="sticky top-0 bg-white/95 backdrop-blur-xl border-b border-gray-200 p-4 flex items-center gap-3 z-10">
            <button type="button" onClick={() => setActiveSection('overview')} className="text-gray-600">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h3>Historial de Donacions</h3>
          </div>

          <div className="p-4 space-y-3 pb-24">
            {loadingDonations ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin text-[#E30613]" />
              </div>
            ) : donationHistory.length === 0 ? (
              <div className="text-center p-8 text-gray-500">
                <p>Encara no tens donacions registrades</p>
              </div>
            ) : (
              donationHistory.map((donation: Donation, index: number) => (
                <div key={donation.id} className="bg-white rounded-2xl p-4 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-sm mb-1">{donation.donationType || 'Donació de sang'}</h4>
                      <p className="text-xs text-gray-600">{donation.donationCenterName || 'Centre de donació'}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-700 border-0">
                      +{donation.tokensEarned || 0} tokens
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
              ))
            )}

            <div className="bg-gradient-to-r from-[#E30613] to-[#FF4444] rounded-2xl p-6 text-white text-center">
              <Heart className="w-12 h-12 mx-auto mb-3 text-white" />
              <h3 className="text-white mb-2">Gràcies pel teu compromís!</h3>
              <p className="text-white/90 text-sm">
                Les teves {totalDonations} donacions han ajudat a salvar {livesSaved} vides
              </p>
            </div>
          </div>
        </>
      );
    }

    if (activeSection === 'settings') {
      return (
        <>
          <div className="sticky top-0 bg-white/95 backdrop-blur-xl border-b border-gray-200 p-4 flex items-center gap-3 z-10">
            <button type="button" onClick={() => setActiveSection('overview')} className="text-gray-600">
              <ArrowLeft className="w-5 h-5" />
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
                    className={`w-12 h-6 rounded-full relative transition-all ${notifications.appointments ? 'bg-[#E30613]' : 'bg-gray-300'
                      }`}
                    onClick={() => setNotifications({ ...notifications, appointments: !notifications.appointments })}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifications.appointments ? 'right-1' : 'left-1'
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
                    className={`w-12 h-6 rounded-full relative transition-all ${notifications.urgent ? 'bg-[#E30613]' : 'bg-gray-300'
                      }`}
                    onClick={() => setNotifications({ ...notifications, urgent: !notifications.urgent })}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifications.urgent ? 'right-1' : 'left-1'
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
                    className={`w-12 h-6 rounded-full relative transition-all ${notifications.rewards ? 'bg-[#E30613]' : 'bg-gray-300'
                      }`}
                    onClick={() => setNotifications({ ...notifications, rewards: !notifications.rewards })}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifications.rewards ? 'right-1' : 'left-1'
                      }`} />
                  </button>
                </div>
              </div>
            </section>

            <section>
              <h4 className="text-sm text-gray-600 mb-3 px-1">Compte</h4>
              <div className="bg-white rounded-2xl divide-y divide-gray-100 shadow-sm overflow-hidden">
                <button
                  type="button"
                  className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  onClick={() => setShowPrivacyDialog(true)}
                >
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-gray-600" />
                    <span className="text-sm">Privacitat i dades</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
                <button
                  type="button"
                  className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  onClick={() => setShowTermsDialog(true)}
                >
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
              onClick={() => {
                logout();
                navigate('/login');
                toast.success('Sessió tancada correctament');
              }}
            >
              Tancar sessió
            </Button>
          </div>
        </>
      );
    }

    // Default: Overview
    return (
      <>
        {/* Profile Header with Glass Effect */}
        <div
          className="text-white p-6 pb-8"
          style={{
            backgroundColor: 'rgba(227, 6, 19, 0.95)',
            backdropFilter: 'saturate(180%) blur(20px)',
            WebkitBackdropFilter: 'saturate(180%) blur(20px)',
          }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-white mb-1">{user?.name || 'Usuari'}</h2>
              <p className="text-white/90 text-sm">{user?.email || ''}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                  <Award className="w-3 h-3 mr-1" />
                  {totalDonations >= 10 ? 'Donant de Platí' : totalDonations >= 5 ? 'Donant de Plata' : 'Donant de Bronze'}
                </Badge>
                {user?.bloodType && (
                  <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                    {user.bloodType}
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
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setActiveSection('history')}
                className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-all text-left"
              >
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mb-3">
                  <Calendar className="w-5 h-5 text-[#E30613]" />
                </div>
                <h3 className="font-medium text-sm">Historial</h3>
                <p className="text-xs text-gray-500">Veure donacions</p>
              </button>
              <button
                type="button"
                onClick={() => setShowShareDialog(true)}
                className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-all text-left"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-medium text-sm">Convidar amics</h3>
                <p className="text-xs text-gray-500">Guanya tokens</p>
              </button>
            </div>
          </section>

          {/* Analytics Charts */}
          <section>
            <h3 className="font-medium mb-3 px-1">Estadístiques</h3>
            {loadingAnalytics ? (
              <div className="flex items-center justify-center p-8 bg-white rounded-2xl shadow-sm">
                <Loader2 className="w-8 h-8 animate-spin text-[#E30613]" />
              </div>
            ) : (
              <div className="bg-white p-4 rounded-2xl shadow-sm space-y-6">
                <div>
                  <h4 className="text-xs text-gray-500 mb-4 uppercase tracking-wider">Evolució de donacions</h4>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={donationTrendData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis
                          dataKey="month"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 10, fill: '#9CA3AF' }}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 10, fill: '#9CA3AF' }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                          type="monotone"
                          dataKey="donations"
                          stroke="#E30613"
                          strokeWidth={3}
                          dot={{ fill: '#E30613', strokeWidth: 2, r: 4, stroke: '#fff' }}
                          activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs text-gray-500 mb-4 uppercase tracking-wider">Tokens guanyats</h4>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyTokensData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis
                          dataKey="month"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 10, fill: '#9CA3AF' }}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 10, fill: '#9CA3AF' }}
                        />
                        <Tooltip
                          content={<CustomTooltip />}
                          cursor={{ fill: 'rgba(227, 6, 19, 0.1)' }}
                        />
                        <Bar
                          dataKey="tokens"
                          fill="#E30613"
                          radius={[4, 4, 0, 0]}
                          barSize={20}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Achievements */}
          <section>
            <h3 className="font-medium mb-3 px-1">Assoliments</h3>
            <div className="grid grid-cols-2 gap-3">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-4 rounded-2xl border-2 transition-all ${achievement.unlocked
                    ? 'bg-white border-[#E30613]/10 shadow-sm'
                    : 'bg-gray-50 border-transparent opacity-60 grayscale'
                    }`}
                >
                  <div className="text-3xl mb-2">{achievement.icon}</div>
                  <h4 className="text-sm font-medium mb-1">{achievement.name}</h4>
                  <p className="text-xs text-gray-500">
                    {achievement.unlocked ? 'Desbloquejat!' : 'Bloquejat'}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <Button
            variant="ghost"
            className="w-full text-gray-500 hover:text-gray-700 h-12"
            onClick={() => setActiveSection('settings')}
          >
            <Settings className="w-4 h-4 mr-2" />
            Més opcions
          </Button>
        </div>
      </>
    );
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      {renderContent()}

      {/* Privacy Dialog */}
      <Dialog open={showPrivacyDialog} onOpenChange={setShowPrivacyDialog}>
        <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Privacitat i Dades</DialogTitle>
            <DialogDescription>
              Informació sobre com tractem les teves dades personals.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm text-gray-600 mt-4">
            <p>
              A PuntDonació, ens prenem molt seriosament la teva privacitat. Aquesta política descriu com recollim, utilitzem i protegim les teves dades personals.
            </p>

            <h4 className="font-medium text-gray-900 text-base">1. Dades que recollim</h4>
            <p>
              Recollim informació bàsica de perfil (nom, correu electrònic), dades de salut rellevants per a la donació (grup sanguini, pes, edat) i l'historial de les teves donacions.
            </p>

            <h4 className="font-medium text-gray-900 text-base">2. Ús de les dades</h4>
            <p>
              Utilitzem les teves dades per gestionar les teves cites, mantenir el teu historial mèdic de donant i comunicar-te informació rellevant sobre campanyes i necessitats urgents.
            </p>

            <h4 className="font-medium text-gray-900 text-base">3. Protecció de dades</h4>
            <p>
              Les teves dades estan encriptades i emmagatzemades en servidors segures. No compartim la teva informació amb tercers sense el teu consentiment explícit, excepte amb les autoritats sanitàries quan sigui requerit per llei.
            </p>

            <h4 className="font-medium text-gray-900 text-base">4. Els teus drets</h4>
            <p>
              Tens dret a accedir, rectificar i suprimir les teves dades en qualsevol moment. Pots exercir aquests drets contactant amb el nostre equip de suport o directament des d'aquesta aplicació.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Terms Dialog */}
      <Dialog open={showTermsDialog} onOpenChange={setShowTermsDialog}>
        <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Termes i Condicions</DialogTitle>
            <DialogDescription>
              Condicions d'ús de l'aplicació PuntDonació.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm text-gray-600 mt-4">
            <p>
              Benvingut a PuntDonació. En utilitzar la nostra aplicació, acceptes els següents termes i condicions.
            </p>

            <h4 className="font-medium text-gray-900 text-base">1. Ús de l'aplicació</h4>
            <p>
              L'aplicació està destinada a facilitar el procés de donació de sang. L'usuari es compromet a utilitzar-la de manera responsable i a proporcionar informació veraç.
            </p>

            <h4 className="font-medium text-gray-900 text-base">2. Requisits per donar</h4>
            <p>
              L'ús de l'aplicació no garanteix l'aptitud per donar. L'aptitud final serà determinada pel personal sanitari en el moment de la donació, seguint els protocols mèdics vigents.
            </p>

            <h4 className="font-medium text-gray-900 text-base">3. Sistema de Tokens i Recompenses</h4>
            <p>
              Els tokens són una gratificació simbòlica i no tenen valor monetari real. PuntDonació es reserva el dret de modificar el sistema de recompenses o el valor dels tokens en qualsevol moment.
            </p>

            <h4 className="font-medium text-gray-900 text-base">4. Responsabilitat</h4>
            <p>
              PuntDonació no es fa responsable de les conseqüències derivades de l'ús indegut de l'aplicació o de la informació proporcionada pels usuaris.
            </p>

            <h4 className="font-medium text-gray-900 text-base">5. Modificacions</h4>
            <p>
              Ens reservem el dret de modificar aquests termes en qualsevol moment. Les modificacions seran efectives immediatament després de la seva publicació a l'aplicació.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Convida amics</DialogTitle>
            <DialogDescription>
              Comparteix el teu codi i guanya 50 tokens per cada amic que faci la seva primera donació.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 mt-4">
            <div className="grid flex-1 gap-2">
              <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
                <code className="text-sm font-mono font-bold text-[#E30613]">DONA-{user?.name?.substring(0, 3).toUpperCase() || 'USR'}2024</code>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    navigator.clipboard.writeText(`DONA-${user?.name?.substring(0, 3).toUpperCase() || 'USR'}2024`);
                    toast.success('Codi copiat!');
                  }}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            <button type="button" className="p-3 bg-pink-100 text-pink-600 rounded-full hover:bg-pink-200 transition-colors">
              <Instagram className="w-5 h-5" />
            </button>
            <button type="button" className="p-3 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors">
              <Twitter className="w-5 h-5" />
            </button>
            <button type="button" className="p-3 bg-green-100 text-green-600 rounded-full hover:bg-green-200 transition-colors">
              <MessageCircle className="w-5 h-5" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
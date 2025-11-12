import { useState } from 'react';
import { Home, Calendar, Gift, User } from 'lucide-react';
import { HomePage } from './components/HomePage';
import { CalendariPage } from './components/CalendariPage';
import { RecompensesPage } from './components/RecompensesPage';
import { PerfilPage } from './components/PerfilPage';
import { OnboardingFlow } from './components/OnboardingFlow';

type TabType = 'home' | 'calendari' | 'recompenses' | 'perfil';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [userTokens, setUserTokens] = useState(45);

  if (!hasCompletedOnboarding) {
    return <OnboardingFlow onComplete={() => setHasCompletedOnboarding(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Mobile Frame */}
      <div className="w-full max-w-md h-[812px] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col relative border-8 border-gray-900">
        {/* Status Bar */}
        <div className="h-11 bg-white flex items-center justify-between px-8 pt-2">
          <span className="text-xs">9:41</span>
          <div className="flex gap-1 items-center">
            <div className="w-4 h-3 border border-black rounded-sm" />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden bg-gray-50">
          {activeTab === 'home' && <HomePage tokens={userTokens} onNavigateToCalendar={() => setActiveTab('calendari')} />}
          {activeTab === 'calendari' && <CalendariPage />}
          {activeTab === 'recompenses' && (
            <RecompensesPage 
              tokens={userTokens} 
              onRedeem={(cost) => setUserTokens(prev => prev - cost)}
            />
          )}
          {activeTab === 'perfil' && <PerfilPage tokens={userTokens} />}
        </div>

        {/* Bottom Navigation */}
        <nav className="bg-white border-t border-gray-200 pb-6 pt-2">
          <div className="flex justify-around items-center px-4">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'home' ? 'text-[#E30613]' : 'text-gray-500'
              }`}
            >
              <Home className="w-6 h-6" />
              <span className="text-xs">Inici</span>
            </button>
            <button
              onClick={() => setActiveTab('calendari')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'calendari' ? 'text-[#E30613]' : 'text-gray-500'
              }`}
            >
              <Calendar className="w-6 h-6" />
              <span className="text-xs">Calendari</span>
            </button>
            <button
              onClick={() => setActiveTab('recompenses')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'recompenses' ? 'text-[#E30613]' : 'text-gray-500'
              }`}
            >
              <Gift className="w-6 h-6" />
              <span className="text-xs">Recompenses</span>
            </button>
            <button
              onClick={() => setActiveTab('perfil')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'perfil' ? 'text-[#E30613]' : 'text-gray-500'
              }`}
            >
              <User className="w-6 h-6" />
              <span className="text-xs">Perfil</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}
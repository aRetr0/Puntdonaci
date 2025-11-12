import { useState } from 'react';
import { Home, Calendar, Gift, User } from 'lucide-react';
import { HomePage } from './components/HomePage';
import { CalendariPage } from './components/CalendariPage';
import { RecompensesPage } from './components/RecompensesPage';
import { PerfilPage } from './components/PerfilPage';
import { OnboardingFlow } from './components/OnboardingFlow';
import { LoginPage } from './components/LoginPage';

type TabType = 'home' | 'calendari' | 'recompenses' | 'perfil';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userData, setUserData] = useState<any>(null);
  const [userTokens, setUserTokens] = useState(45);

  const handleLogin = (email: string, data?: any) => {
    setUserEmail(email);
    setUserData(data);
    setIsLoggedIn(true);
  };

  // Show login page if not logged in
  if (!isLoggedIn) {
    return (
      <div className="h-screen flex flex-col bg-white md:bg-gray-50">
        {/* Status Bar - Only on mobile */}
        <div className="h-11 bg-white flex items-center justify-between px-6 pt-2 md:hidden">
          <span className="text-xs">9:41</span>
          <div className="flex gap-1 items-center">
            <div className="w-4 h-3 border border-black rounded-sm" />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden bg-white md:bg-transparent md:flex md:items-center md:justify-center w-full">
          <LoginPage onLogin={handleLogin} />
        </div>
      </div>
    );
  }

  // Show onboarding if logged in but hasn't completed it
  if (!hasCompletedOnboarding) {
    return <OnboardingFlow onComplete={() => setHasCompletedOnboarding(true)} />;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Status Bar - Only on mobile */}
      <div className="h-11 bg-white flex items-center justify-between px-6 pt-2 md:hidden">
        <span className="text-xs">9:41</span>
        <div className="flex gap-1 items-center">
          <div className="w-4 h-3 border border-black rounded-sm" />
        </div>
      </div>

      {/* Mobile version - Full screen */}
      <div className="md:hidden flex-1 overflow-hidden bg-gray-50">
        {activeTab === 'home' && <HomePage tokens={userTokens} onNavigateToCalendar={() => setActiveTab('calendari')} />}
        {activeTab === 'calendari' && <CalendariPage />}
        {activeTab === 'recompenses' && (
          <RecompensesPage 
            tokens={userTokens} 
            onRedeem={(cost) => setUserTokens(prev => prev - cost)}
          />
        )}
        {activeTab === 'perfil' && (
          <PerfilPage 
            tokens={userTokens} 
            userEmail={userEmail}
            userData={userData}
            onLogout={() => {
              setIsLoggedIn(false);
              setUserEmail('');
              setUserData(null);
              setHasCompletedOnboarding(false);
            }}
          />
        )}
      </div>

      {/* Desktop version - Full screen with sidebar */}
      <div className="hidden md:flex md:flex-1 md:overflow-hidden">
        {/* Sidebar Navigation */}
        <nav className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-[#E30613] to-[#FF4444] rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l-1 8h-3l8 12 1-8h3L12 2z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">PuntDonació</h3>
                <p className="text-xs text-gray-500">BST Catalunya</p>
              </div>
            </div>

            <div className="space-y-1">
              <button
                onClick={() => setActiveTab('home')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === 'home' 
                    ? 'bg-[#E30613]/10 text-[#E30613]' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Home className="w-5 h-5" />
                <span className="text-sm">Inici</span>
              </button>
              <button
                onClick={() => setActiveTab('calendari')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === 'calendari' 
                    ? 'bg-[#E30613]/10 text-[#E30613]' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Calendar className="w-5 h-5" />
                <span className="text-sm">Calendari</span>
              </button>
              <button
                onClick={() => setActiveTab('recompenses')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === 'recompenses' 
                    ? 'bg-[#E30613]/10 text-[#E30613]' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Gift className="w-5 h-5" />
                <span className="text-sm">Recompenses</span>
              </button>
              <button
                onClick={() => setActiveTab('perfil')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === 'perfil' 
                    ? 'bg-[#E30613]/10 text-[#E30613]' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <User className="w-5 h-5" />
                <span className="text-sm">Perfil</span>
              </button>
            </div>
          </div>

          {/* Tokens at bottom */}
          <div className="mt-auto p-6 border-t border-gray-200">
            <div className="bg-gradient-to-br from-[#E30613] to-[#FF4444] rounded-2xl p-4 text-white">
              <p className="text-xs opacity-90 mb-1">Els teus tokens</p>
              <p className="text-2xl">{userTokens}</p>
            </div>
          </div>
        </nav>

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
          {activeTab === 'perfil' && (
            <PerfilPage 
              tokens={userTokens} 
              userEmail={userEmail}
              userData={userData}
              onLogout={() => {
                setIsLoggedIn(false);
                setUserEmail('');
                setUserData(null);
                setHasCompletedOnboarding(false);
              }}
            />
          )}
        </div>
      </div>

      {/* Bottom Navigation - Mobile */}
      <nav className="md:hidden bg-white border-t border-gray-200 pb-safe pt-2">
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
  );
}
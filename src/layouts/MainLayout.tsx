import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, Calendar, Gift, User } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

/**
 * Main application layout with navigation
 */
export function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/home')) return 'home';
    if (path.includes('/calendari')) return 'calendari';
    if (path.includes('/recompenses')) return 'recompenses';
    if (path.includes('/perfil')) return 'perfil';
    return 'home';
  };

  const activeTab = getActiveTab();

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
        <Outlet />
      </div>

      {/* Desktop version - Full screen with sidebar */}
      <div className="hidden md:flex md:flex-1 md:overflow-hidden">
        {/* Sidebar Navigation */}
        <nav className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-[#E30613] to-[#FF4444] rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l-1 8h-3l8 12 1-8h3L12 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">PuntDonació</h3>
                <p className="text-xs text-gray-500">BST Catalunya</p>
              </div>
            </div>

            <div className="space-y-1">
              <button
                onClick={() => navigate('/app/home')}
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
                onClick={() => navigate('/app/calendari')}
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
                onClick={() => navigate('/app/recompenses')}
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
                onClick={() => navigate('/app/perfil')}
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
              <p className="text-2xl font-bold">{user?.tokens || 0}</p>
            </div>
          </div>
        </nav>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden bg-gray-50">
          <Outlet />
        </div>
      </div>

      {/* Bottom Navigation - Mobile */}
      <nav className="md:hidden bg-white border-t border-gray-200 pb-safe pt-2">
        <div className="flex justify-around items-center px-4">
          <button
            onClick={() => navigate('/app/home')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'home' ? 'text-[#E30613]' : 'text-gray-500'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs">Inici</span>
          </button>
          <button
            onClick={() => navigate('/app/calendari')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'calendari' ? 'text-[#E30613]' : 'text-gray-500'
            }`}
          >
            <Calendar className="w-6 h-6" />
            <span className="text-xs">Calendari</span>
          </button>
          <button
            onClick={() => navigate('/app/recompenses')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'recompenses' ? 'text-[#E30613]' : 'text-gray-500'
            }`}
          >
            <Gift className="w-6 h-6" />
            <span className="text-xs">Recompenses</span>
          </button>
          <button
            onClick={() => navigate('/app/perfil')}
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

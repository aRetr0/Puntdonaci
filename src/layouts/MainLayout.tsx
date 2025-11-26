import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, Calendar, Gift, User, LogOut } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';

/**
 * Main application layout with navigation
 */
export function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/home')) return 'home';
    if (path.includes('/calendari')) return 'calendari';
    if (path.includes('/recompenses')) return 'recompenses';
    if (path.includes('/perfil')) return 'perfil';
    return 'home';
  };

  const activeTab = getActiveTab();

  const navItems = [
    { id: 'home', label: 'Inici', icon: Home, path: '/app/home' },
    { id: 'calendari', label: 'Calendari', icon: Calendar, path: '/app/calendari' },
    { id: 'recompenses', label: 'Recompenses', icon: Gift, path: '/app/recompenses' },
    { id: 'perfil', label: 'Perfil', icon: User, path: '/app/perfil' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Sessió tancada correctament');
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Status Bar - Only on mobile */}
      <div className="h-11 bg-white flex items-center justify-between px-6 pt-2 md:hidden">
        <span className="text-xs font-medium">9:41</span>
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
              <div className="w-10 h-10 bg-gradient-to-br from-brand-600 to-brand-500 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-500/20">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l-1 8h-3l8 12 1-8h3L12 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">PuntDonació</h3>
                <p className="text-xs text-gray-500">BST Catalunya</p>
              </div>
            </div>

            <div className="space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${activeTab === item.id
                      ? 'bg-brand-50 text-brand-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                  <item.icon className={`w-5 h-5 transition-colors ${activeTab === item.id ? 'text-brand-600' : 'text-gray-500 group-hover:text-gray-700'
                    }`} />
                  <span className="text-sm">{item.label}</span>
                  {activeTab === item.id && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-600" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="mt-auto p-6 border-t border-gray-100 space-y-4">
            <div className="bg-gradient-to-br from-brand-600 to-brand-500 rounded-2xl p-4 text-white shadow-lg shadow-brand-500/20 relative overflow-hidden group cursor-default">
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                <Gift className="w-12 h-12" />
              </div>
              <p className="text-xs opacity-90 mb-1">Els teus tokens</p>
              <p className="text-2xl font-bold">{user?.tokens || 0}</p>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Tancar sessió</span>
            </button>
          </div>
        </nav>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden bg-gray-50 relative">
          <Outlet />
        </div>
      </div>

      {/* Bottom Navigation - Mobile */}
      <nav className="md:hidden bg-white border-t border-gray-200 pb-safe pt-2 px-6 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
        <div className="flex justify-between items-center">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 ${activeTab === item.id ? 'text-brand-600' : 'text-gray-400 hover:text-gray-600'
                }`}
            >
              <div className={`p-1.5 rounded-xl transition-all duration-300 ${activeTab === item.id ? 'bg-brand-50' : 'bg-transparent'
                }`}>
                <item.icon className={`w-6 h-6 ${activeTab === item.id ? 'fill-current' : 'stroke-[1.5px]'
                  }`} />
              </div>
              <span className={`text-[10px] font-medium transition-all duration-300 ${activeTab === item.id ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1 hidden'
                }`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

/**
 * Authentication layout for login/signup pages
 */
export function AuthLayout({ children }: AuthLayoutProps) {
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
        {children}
      </div>
    </div>
  );
}

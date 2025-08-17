import React from 'react';
import { useAuthenticationStatus, useSignOut } from '@nhost/react';
import { Bars3Icon, PlusIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

interface LayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  onToggleSidebar?: () => void;
  onNewChat?: () => void;
  sidebarOpen?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  sidebar, 
  onToggleSidebar, 
  onNewChat,
  sidebarOpen = false 
}) => {
  const { isAuthenticated } = useAuthenticationStatus();
  const { signOut } = useSignOut();

  if (!isAuthenticated) {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">ChatBot</h1>
          <button
            onClick={onNewChat}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="New Chat"
          >
            <PlusIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {sidebar}
        </div>
        <div className="border-t border-gray-200 p-4">
          <button
            onClick={signOut}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onToggleSidebar}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        <header className="bg-white border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={onToggleSidebar}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">ChatBot</h1>
            <div className="w-10" />
          </div>
        </header>
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
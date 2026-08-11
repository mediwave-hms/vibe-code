import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster as SonnerToaster } from 'sonner';
import { cn } from '../../lib/cn';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { RequireAuth } from './RequireAuth';
import { useStore } from '../../store';
import { Role } from '../../types/enums';

export interface AppLayoutProps {
  className?: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ className }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const currentUser = useStore((s) => s.currentUser);

  // Build a safe display user from the Zustand store — never undefined
  const user = {
    name: currentUser
      ? `${currentUser.firstName} ${currentUser.lastName}`.trim() || currentUser.email
      : 'User',
    role: currentUser?.role ?? Role.ADMIN,
  };

  const defaultWave = {
    number: 3,
    startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
  };

  return (
    <RequireAuth>
      <div className={cn('min-h-screen bg-slate-50/70', className)}>
        <TopBar
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          notificationCount={4}
          activeWave={defaultWave}
          user={user}
        />

        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          userRole={user.role}
        />

        <main className="pt-24 pl-0 md:pl-64 px-4 md:px-8 pb-12 min-h-screen">
          <div className="max-w-7xl mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>

        <SonnerToaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            classNames: {
              toast:
                'group toast group-[.toaster]:bg-white group-[.toaster]:text-slate-900 group-[.toaster]:border-slate-200 group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl',
              description: 'group-[.toast]:text-slate-500',
              actionButton:
                'group-[.toast]:bg-brand-500 group-[.toast]:text-white group-[.toast]:rounded-lg group-[.toast]:text-sm',
              cancelButton:
                'group-[.toast]:bg-slate-100 group-[.toast]:text-slate-700 group-[.toast]:rounded-lg group-[.toast]:text-sm',
            },
          }}
        />
      </div>
    </RequireAuth>
  );
};

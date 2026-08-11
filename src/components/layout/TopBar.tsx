import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Stethoscope,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  UserCheck,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../../lib/cn';
import { WaveProgressBadge } from './WaveProgressBadge';
import { Badge } from '../ui/Badge';
import { toast } from 'sonner';
import { Role } from '../../types/enums';

interface UserMenuProps {
  user: {
    name: string;
    role: Role;
  };
  onRoleChange: (newRole: Role) => void;
  onSettings?: () => void;
  onLogout: () => void;
}

const ROLES: { id: Role; label: string }[] = [
  { id: Role.ADMIN, label: 'Admin' },
  { id: Role.DOCTOR, label: 'Doctor / Clinician' },
  { id: Role.NURSE, label: 'Nurse' },
  { id: Role.PHARMACIST, label: 'Pharmacist' },
  { id: Role.LAB_TECHNICIAN, label: 'Lab Technician' },
  { id: Role.RECEPTIONIST, label: 'Receptionist' },
  { id: Role.ACCOUNTANT, label: 'Accountant' },
];

const UserMenu: React.FC<UserMenuProps> = ({
  user,
  onRoleChange,
  onSettings,
  onLogout,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsRoleDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initials = (user.name ?? 'U')
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  return (
    <div ref={menuRef} className="relative flex items-center gap-2">
      {/* Role Switcher Pill */}
      <div className="relative hidden md:block">
        <button
          onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <UserCheck className="w-3.5 h-3.5 text-brand-600" />
          <span className="capitalize">{user.role}</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>

        {isRoleDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50 animate-fade-in">
            <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Switch Role View
            </div>
            {ROLES.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  onRoleChange(r.id);
                  setIsRoleDropdownOpen(false);
                }}
                className={cn(
                  'w-full text-left px-3 py-2 text-xs transition-colors flex items-center justify-between',
                  user.role.toLowerCase() === r.id.toLowerCase()
                    ? 'bg-brand-50 text-brand-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                )}
              >
                {r.label}
                {user.role.toLowerCase() === r.id.toLowerCase() && (
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-600" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1 pr-3 rounded-xl hover:bg-slate-100 transition-colors"
      >
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white font-semibold text-sm">
          {initials}
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-slate-900 leading-tight">
            {user.name}
          </p>
          <p className="text-xs text-slate-500 capitalize">{user.role}</p>
        </div>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-slate-400 transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-64 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50 animate-fade-in">
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="text-sm font-semibold text-slate-900">{user.name}</p>
            <p className="text-xs text-slate-500 capitalize mt-0.5">
              {user.role} Perspective
            </p>
          </div>

          <div className="py-1">
            <button
              onClick={() => {
                onSettings?.();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              Settings
            </button>
          </div>

          <div className="border-t border-slate-100 pt-1 mt-1">
            <button
              onClick={() => {
                onLogout();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export interface TopBarProps {
  onMenuClick?: () => void;
  notificationCount?: number;
  activeWave?: {
    number: number;
    startDate: string;
    endDate: string;
  };
  user?: {
    name: string;
    role: Role;
  };
  className?: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  onMenuClick,
  notificationCount = 0,
  activeWave,
  user = { name: 'John Doe', role: Role.ADMIN },
  className,
}) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(user);

  const handleRoleChange = (newRole: Role) => {
    const updated = { ...currentUser, role: newRole };
    setCurrentUser(updated);
    localStorage.setItem('mediwave_user', JSON.stringify(updated));
    toast.info(`Switched role view to ${newRole.toUpperCase()}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('mediwave_user');
    navigate('/auth/login');
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b border-slate-200 backdrop-blur-md bg-white/80',
        className
      )}
    >
      <div className="h-16 flex items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-sm">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-xl font-bold text-brand-700 tracking-tight">
              MediWave
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          {activeWave && (
            <div className="hidden lg:block">
              <WaveProgressBadge wave={activeWave} />
            </div>
          )}

          <button
            className="relative p-2.5 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <Badge
                variant="danger"
                className="absolute -top-1 -right-1 min-w-[20px] h-5 justify-center px-1.5"
              >
                {notificationCount > 99 ? '99+' : notificationCount}
              </Badge>
            )}
          </button>

          <UserMenu
            user={currentUser}
            onRoleChange={handleRoleChange}
            onSettings={() => navigate('/settings')}
            onLogout={handleLogout}
          />
        </div>
      </div>
    </header>
  );
};

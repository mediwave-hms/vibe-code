import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users as UsersIcon,
  Calendar,
  Bed,
  Clipboard,
  Stethoscope,
  Home,
  Pill,
  ClipboardList,
  FlaskConical,
  TestTube,
  FileText,
  CreditCard,
  BarChart3,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '../../lib/cn';
import { Role } from '../../types/enums';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  roles?: Role[];
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const getNavGroups = (): NavGroup[] => [
  {
    label: 'Overview',
    items: [
      {
        icon: <LayoutDashboard className="w-5 h-5" />,
        label: 'Dashboard',
        path: '/',
      },
    ],
  },
  {
    label: 'Patient Care',
    items: [
      {
        icon: <UsersIcon className="w-5 h-5" />,
        label: 'Patients',
        path: '/patients',
      },
      {
        icon: <Calendar className="w-5 h-5" />,
        label: 'Appointments',
        path: '/appointments',
      },
      {
        icon: <Bed className="w-5 h-5" />,
        label: 'Admissions',
        path: '/admissions',
      },
      {
        icon: <Clipboard className="w-5 h-5" />,
        label: 'Clinical Notes',
        path: '/clinical-notes',
      },
    ],
  },
  {
    label: 'Departments',
    items: [
      {
        icon: <UsersIcon className="w-5 h-5" />,
        label: 'Staff',
        path: '/staff',
        roles: [Role.ADMIN, Role.DEPT_HEAD, Role.DOCTOR, Role.NURSE],
      },
      {
        icon: <Stethoscope className="w-5 h-5" />,
        label: 'Doctors',
        path: '/staff?filter=doctors',
        roles: [Role.ADMIN, Role.DEPT_HEAD, Role.DOCTOR, Role.NURSE, Role.RECEPTIONIST],
      },
      {
        icon: <Home className="w-5 h-5" />,
        label: 'Rooms',
        path: '/rooms',
        roles: [Role.ADMIN, Role.DEPT_HEAD, Role.DOCTOR, Role.NURSE],
      },
    ],
  },
  {
    label: 'Pharmacy',
    items: [
      {
        icon: <Pill className="w-5 h-5" />,
        label: 'Inventory',
        path: '/pharmacy/inventory',
        roles: [Role.ADMIN, Role.PHARMACIST],
      },
      {
        icon: <ClipboardList className="w-5 h-5" />,
        label: 'Prescriptions',
        path: '/pharmacy/prescriptions',
        roles: [Role.ADMIN, Role.PHARMACIST, Role.DOCTOR, Role.CLINICIAN],
      },
    ],
  },
  {
    label: 'Laboratory',
    items: [
      {
        icon: <FlaskConical className="w-5 h-5" />,
        label: 'Tests',
        path: '/lab/tests',
        roles: [Role.ADMIN, Role.LAB_TECHNICIAN, Role.DOCTOR, Role.CLINICIAN],
      },
      {
        icon: <TestTube className="w-5 h-5" />,
        label: 'Orders',
        path: '/lab/orders',
        roles: [Role.ADMIN, Role.LAB_TECHNICIAN, Role.DOCTOR, Role.NURSE, Role.CLINICIAN],
      },
    ],
  },
  {
    label: 'Billing',
    items: [
      {
        icon: <FileText className="w-5 h-5" />,
        label: 'Invoices',
        path: '/billing/invoices',
        roles: [Role.ADMIN, Role.ACCOUNTANT],
      },
      {
        icon: <CreditCard className="w-5 h-5" />,
        label: 'Payments',
        path: '/billing/payments',
        roles: [Role.ADMIN, Role.ACCOUNTANT],
      },
    ],
  },
  {
    label: 'Administration',
    items: [
      {
        icon: <ShieldCheck className="w-5 h-5" />,
        label: 'Onboarding',
        path: '/onboarding',
        roles: [Role.ADMIN, Role.DEPT_HEAD, Role.PROGRAM_MANAGER],
      },
      {
        icon: <ClipboardList className="w-5 h-5" />,
        label: 'Appeals',
        path: '/appeals',
        roles: [Role.ADMIN, Role.DEPT_HEAD, Role.PROGRAM_MANAGER],
      },
    ],
  },
  {
    label: 'Reports',
    items: [
      {
        icon: <BarChart3 className="w-5 h-5" />,
        label: 'Reports',
        path: '/reports',
        roles: [Role.ADMIN, Role.DEPT_HEAD, Role.DOCTOR, Role.ACCOUNTANT, Role.PROGRAM_MANAGER, Role.CLINICIAN],
      },
    ],
  },
];

export interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  userRole?: Role;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen = false,
  onClose,
  userRole = Role.ADMIN,
  className,
}) => {
  const navGroups = getNavGroups();

  const filteredGroups = navGroups
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (item) => !item.roles || item.roles.includes(userRole)
      ),
    }))
    .filter((group) => group.items.length > 0);

  const sidebarContent = (
    <aside
      className={cn(
        'w-full md:w-64 h-full bg-white md:border-r md:border-slate-200 flex flex-col',
        className
      )}
    >
      <nav className="flex-1 py-6 px-3 overflow-y-auto scrollbar-thin">
        <div className="space-y-6 animate-staggered">
          {filteredGroups.map((group) => (
            <div key={group.label} className="animate-fade-in opacity-0">
              <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                {group.label}
              </p>
              <ul className="space-y-1">
                {group.items.map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      end={item.path === '/'}
                      onClick={onClose}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                          isActive
                            ? 'bg-brand-50 text-brand-700 shadow-sm'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        )
                      }
                    >
                      <span
                        className={cn(
                          'transition-colors',
                          'text-current'
                        )}
                      >
                        {item.icon}
                      </span>
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="p-4 rounded-xl bg-gradient-to-br from-brand-50 to-brand-100/50 border border-brand-100">
          <p className="text-sm font-semibold text-brand-800">MediWave HMS Enterprise</p>
          <p className="text-xs text-brand-700/70 mt-1 mb-3">
            Upgrade for advanced analytics and unlimited staff accounts.
          </p>
          <button className="w-full text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white py-2 rounded-lg transition-colors">
            Upgrade Plan
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 md:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      <div
        className={cn(
          'fixed left-0 top-16 bottom-0 z-50 md:z-30 md:flex flex-col transition-transform duration-300 ease-in-out',
          'hidden md:flex',
          isOpen && 'flex !translate-x-0',
          !isOpen && '-translate-x-full md:translate-x-0'
        )}
      >
        {sidebarContent}
      </div>
    </>
  );
};

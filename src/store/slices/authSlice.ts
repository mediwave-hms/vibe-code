import { StateCreator } from 'zustand';
import { User } from '../../types/models';
import { Role, Permission } from '../../types/enums';
import { ROLE_PERMISSIONS, SESSION_DURATION_HOURS } from '../../data/constants';

type StoredUser = Omit<User, 'password'>;

function isStoredUser(value: unknown): value is StoredUser {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === 'string' &&
    typeof v.email === 'string' &&
    typeof v.firstName === 'string' &&
    typeof v.lastName === 'string' &&
    typeof v.role === 'string' &&
    typeof v.isActive === 'boolean'
  );
}

function restoreStoredSession(): StoredUser | null {
  if (typeof window === 'undefined') return null;

  const raw = window.localStorage.getItem('mediwave_user');
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    if (isStoredUser(parsed)) return parsed;
    window.localStorage.removeItem('mediwave_user');
    return null;
  } catch {
    window.localStorage.removeItem('mediwave_user');
    return null;
  }
}

export type AuthSlice = {
  users: User[];
  currentUser: User | null;
  isAuthenticated: boolean;
  sessionExpiresAt: number | null;
  login: (email: string, password: string) => { success: boolean; message?: string };
  logout: () => void;
  setCurrentUser: (user: User | null) => void;
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  getCurrentUserPermissions: () => Permission[];
};

export const createAuthSlice: StateCreator<AuthSlice> = (set, get) => {
  const restoredSession = restoreStoredSession();

  return {
    users: [],
    currentUser: restoredSession ? (restoredSession as unknown as User) : null,
    isAuthenticated: !!restoredSession,
    sessionExpiresAt: null,

    login: (email, password) => {
      const user = get().users.find(
        (u: User) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      if (!user) return { success: false, message: 'Invalid credentials' };
      if (!user.isActive) return { success: false, message: 'Account is inactive' };

      const { password: _pw, ...storedUser } = user;
      set({
        currentUser: user,
        isAuthenticated: true,
        sessionExpiresAt: Date.now() + SESSION_DURATION_HOURS * 60 * 60 * 1000,
      });
      localStorage.setItem('mediwave_user', JSON.stringify(storedUser));
      return { success: true };
    },

    logout: () => {
      localStorage.removeItem('mediwave_user');
      set({ currentUser: null, isAuthenticated: false, sessionExpiresAt: null });
    },

    setCurrentUser: (user) =>
      set({ currentUser: user, isAuthenticated: !!user }),

    getCurrentUserPermissions: () => {
      const user = get().currentUser;
      if (!user) return [];
      return ROLE_PERMISSIONS[user.role as Role] || [];
    },

    hasPermission: (permission) => {
      return get().getCurrentUserPermissions().includes(permission);
    },

    hasAnyPermission: (permissions) => {
      const userPerms = get().getCurrentUserPermissions();
      return permissions.some((p) => userPerms.includes(p));
    },

    hasAllPermissions: (permissions) => {
      const userPerms = get().getCurrentUserPermissions();
      return permissions.every((p) => userPerms.includes(p));
    },
  };
};

import { useEffect } from 'react';
import { useStore } from '../store';

export function useAuth() {
  const user = useStore((state) => state.currentUser);
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const login = useStore((state) => state.login);
  const logout = useStore((state) => state.logout);
  // `switchRole` removed from store API; omit to avoid type errors
  const sessionExpiresAt = useStore((state) => state.sessionExpiresAt);

  useEffect(() => {
    if (!isAuthenticated || !sessionExpiresAt) return;
    const msLeft = new Date(sessionExpiresAt).getTime() - Date.now();
    if (msLeft <= 0) {
      logout();
      return;
    }
    const timer = setTimeout(() => {
      logout();
    }, msLeft);
    return () => clearTimeout(timer);
  }, [isAuthenticated, sessionExpiresAt, logout]);

  return {
    user,
    isAuthenticated,
    login,
    logout,
    sessionExpiresAt,
  };
}

export default useAuth;

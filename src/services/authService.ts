import { useStore } from '../store';
import { User } from '../types/models';

export const authService = {
  login(email: string, password: string): { success: boolean; message?: string } {
    return useStore.getState().login(email, password);
  },

  logout(): void {
    useStore.getState().logout();
  },

  getCurrentUser(): User | null {
    return useStore.getState().currentUser;
  },

  isAuthenticated(): boolean {
    return useStore.getState().isAuthenticated;
  },

  getSessionExpiry(): number | null {
    return useStore.getState().sessionExpiresAt;
  },

  isSessionValid(): boolean {
    const state = useStore.getState();
    if (!state.isAuthenticated || !state.sessionExpiresAt) return false;
    return state.sessionExpiresAt > Date.now();
  },
};

export default authService;

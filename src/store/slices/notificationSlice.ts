import { StateCreator } from 'zustand';
import { Notification } from '../../types/models';
import { NotificationType } from '../../types/enums';

export type NotificationSlice = {
  notifications: Notification[];
  selectedNotificationId: string | null;
  addNotification: (
    data: Omit<Notification, 'id' | 'read' | 'createdAt' | 'updatedAt' | 'readAt'>
  ) => Notification;
  addBulkNotifications: (
    items: Omit<Notification, 'id' | 'read' | 'createdAt' | 'updatedAt' | 'readAt'>[]
  ) => Notification[];
  updateNotification: (id: string, patch: Partial<Notification>) => Notification | null;
  deleteNotification: (id: string) => boolean;
  deleteAllNotifications: (userId: string) => void;
  getNotificationById: (id: string) => Notification | undefined;
  getUserNotifications: (userId: string) => Notification[];
  getUnreadNotifications: (userId: string) => Notification[];
  getUnreadCount: (userId: string) => number;
  getNotificationsByType: (userId: string, type: NotificationType) => Notification[];
  markAsRead: (id: string) => Notification | null;
  markAsUnread: (id: string) => Notification | null;
  markAllRead: (userId: string) => void;
  clearOldNotifications: (userId: string, olderThanDays?: number) => void;
  setSelectedNotificationId: (id: string | null) => void;
};

export const createNotificationSlice: StateCreator<NotificationSlice> = (set, get) => ({
  notifications: [],
  selectedNotificationId: null,

  addNotification: (data) => {
    const now = new Date();
    const notif: Notification = {
      ...data,
      id: `n_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      read: false,
      createdAt: now,
      updatedAt: now,
    };
    set((state) => ({ notifications: [notif, ...state.notifications] }));
    return notif;
  },

  addBulkNotifications: (items) => {
    const now = new Date();
    const newItems: Notification[] = items.map((data: Omit<Notification, 'id' | 'read' | 'createdAt' | 'updatedAt' | 'readAt'>, idx: number) => ({
      ...data,
      id: `n_${Date.now()}_${idx}_${Math.random().toString(36).slice(2, 6)}`,
      read: false,
      createdAt: now,
      updatedAt: now,
    }));
    set((state) => ({ notifications: [...newItems, ...state.notifications] }));
    return newItems;
  },

  updateNotification: (id, patch) => {
    const state = get();
    const notif = state.notifications.find((n: Notification) => n.id === id);
    if (!notif) return null;
    const updated: Notification = { ...notif, ...patch, updatedAt: new Date() };
    set((s) => ({
      notifications: s.notifications.map((n: Notification) => (n.id === id ? updated : n)),
    }));
    return updated;
  },

  deleteNotification: (id) => {
    const state = get();
    const exists = state.notifications.some((n: Notification) => n.id === id);
    if (!exists) return false;
    set((s) => ({
      notifications: s.notifications.filter((n: Notification) => n.id !== id),
      selectedNotificationId: s.selectedNotificationId === id ? null : s.selectedNotificationId,
    }));
    return true;
  },

  deleteAllNotifications: (userId) => {
    set((state) => ({
      notifications: state.notifications.filter((n: Notification) => n.userId !== userId),
    }));
  },

  getNotificationById: (id) => {
    return get().notifications.find((n: Notification) => n.id === id);
  },

  getUserNotifications: (userId) => {
    return get()
      .notifications.filter((n: Notification) => n.userId === userId)
      .sort(
        (a: Notification, b: Notification) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  },

  getUnreadNotifications: (userId) => {
    return get()
      .notifications.filter((n: Notification) => n.userId === userId && !n.read)
      .sort(
        (a: Notification, b: Notification) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  },

  getUnreadCount: (userId) => {
    return get().notifications.filter((n: Notification) => n.userId === userId && !n.read).length;
  },

  getNotificationsByType: (userId, type) => {
    return get()
      .notifications.filter((n: Notification) => n.userId === userId && n.type === type)
      .sort(
        (a: Notification, b: Notification) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  },

  markAsRead: (id) => {
    const now = new Date();
    return get().updateNotification(id, { read: true, readAt: now });
  },

  markAsUnread: (id) => {
    return get().updateNotification(id, { read: false, readAt: undefined });
  },

  markAllRead: (userId) => {
    const now = new Date();
    set((state) => ({
      notifications: state.notifications.map((n: Notification) =>
        n.userId === userId && !n.read ? { ...n, read: true, readAt: now, updatedAt: now } : n
      ),
    }));
  },

  clearOldNotifications: (userId, olderThanDays = 30) => {
    const cutoff = new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000);
    set((state) => ({
      notifications: state.notifications.filter(
        (n: Notification) => !(n.userId === userId && new Date(n.createdAt) < cutoff)
      ),
    }));
  },

  setSelectedNotificationId: (id) => set({ selectedNotificationId: id }),
});

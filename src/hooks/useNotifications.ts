import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

export type NotificationType = 'new_order' | 'shipment_update' | 'message' | 'promo' | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  socket: Socket | null;
  connect: (userId: string) => void;
  disconnect: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Notification) => void;
}

export const useNotifications = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  socket: null,

  connect: (userId: string) => {
    if (get().socket) return; // already connected

    // Use existing backend or fallback
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'https://korddyfirebase.imlinkey.store';
    
    const socket = io(socketUrl, {
      query: { userId },
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('Connected to notification service');
    });

    socket.on('notification', (notification: Notification) => {
      get().addNotification(notification);
    });

    set({ socket });
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },

  addNotification: (notification: Notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));

    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new window.Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
      });
    }
  },

  markAsRead: (id: string) => {
    set((state) => {
      const updated = state.notifications.map((n) => {
        if (n.id === id && !n.read) {
          return { ...n, read: true };
        }
        return n;
      });
      return {
        notifications: updated,
        unreadCount: Math.max(0, state.unreadCount - 1),
      };
    });
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },
}));

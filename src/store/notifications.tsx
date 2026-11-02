import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import { notifications as initialNotifications } from '@/mock/notifications';
import type { AppNotification } from '@/types/notification';

/**
 * Notification read state, shared by the Home bell (08) and Notifications (15).
 * Mock: starts from fictional data and lives in memory.
 */
type NotificationsContextValue = {
  notifications: AppNotification[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
};

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markRead = useCallback((id: string) => {
    setNotifications((previous) =>
      previous.map((item) => (item.id === id && !item.read ? { ...item, read: true } : item))
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((previous) =>
      previous.map((item) => (item.read ? item : { ...item, read: true }))
    );
  }, []);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount: notifications.filter((item) => !item.read).length,
      markRead,
      markAllRead,
    }),
    [notifications, markRead, markAllRead]
  );

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export function useNotifications() {
  const value = useContext(NotificationsContext);
  if (!value) throw new Error('useNotifications must be used inside <NotificationsProvider>');
  return value;
}

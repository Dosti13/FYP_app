import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";

export type NotificationType =
  | "geofencing"
  | "report_update"
  | "emergency"
  | "general"
  | "success"
  | "warning";

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  type: NotificationType;
  timestamp: string;
  read: boolean;
  data?: Record<string, any>;
}

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (
    n: Omit<AppNotification, "id" | "timestamp" | "read">,
  ) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
}

const STORAGE_KEY = "app_notifications_v2";
const MAX_NOTIFICATIONS = 100;

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

function generateId(): string {
  return `notif_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const isLoaded = useRef(false);

  // Load from storage on mount
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed: AppNotification[] = JSON.parse(raw);
          setNotifications(parsed);
        }
      } catch (e) {
        console.error("Failed to load notifications:", e);
      } finally {
        isLoaded.current = true;
      }
    })();
  }, []);

  // Persist whenever notifications change (skip initial empty load)
  const persist = useCallback(async (data: AppNotification[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Failed to persist notifications:", e);
    }
  }, []);

  const addNotification = useCallback(
    async (n: Omit<AppNotification, "id" | "timestamp" | "read">) => {
      const newNotif: AppNotification = {
        ...n,
        id: generateId(),
        timestamp: new Date().toISOString(),
        read: false,
      };

      setNotifications((prev) => {
        const updated = [newNotif, ...prev].slice(0, MAX_NOTIFICATIONS);
        persist(updated);
        return updated;
      });
    },
    [persist],
  );

  const markAsRead = useCallback(
    async (id: string) => {
      setNotifications((prev) => {
        const updated = prev.map((n) =>
          n.id === id ? { ...n, read: true } : n,
        );
        persist(updated);
        return updated;
      });
    },
    [persist],
  );

  const markAllAsRead = useCallback(async () => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      persist(updated);
      return updated;
    });
  }, [persist]);

  const deleteNotification = useCallback(
    async (id: string) => {
      setNotifications((prev) => {
        const updated = prev.filter((n) => n.id !== id);
        persist(updated);
        return updated;
      });
    },
    [persist],
  );

  const clearAll = useCallback(async () => {
    setNotifications([]);
    await AsyncStorage.removeItem(STORAGE_KEY);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications(): NotificationContextType {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error(
      "useNotifications must be used within NotificationProvider",
    );
  return ctx;
}

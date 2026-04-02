import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { AppNotification, NotificationType } from '../../hooks/Notificationcontext ';
import { NotificationToast } from './Notificationtoast ';

interface ToastManagerContextType {
  showToast: (notification: AppNotification, onPress?: () => void) => void;
}

const ToastManagerContext = createContext<ToastManagerContextType | undefined>(undefined);

export function ToastManagerProvider({ children }: { children: React.ReactNode }) {
  const [current, setCurrent] = useState<AppNotification | null>(null);
  const [onPressCallback, setOnPressCallback] = useState<(() => void) | undefined>(undefined);
  const queue = useRef<Array<{ notif: AppNotification; onPress?: () => void }>>([]);
  const isShowing = useRef(false);

  const processQueue = useCallback(() => {
    if (queue.current.length === 0) {
      isShowing.current = false;
      setCurrent(null);
      return;
    }
    const next = queue.current.shift()!;
    isShowing.current = true;
    setCurrent(next.notif);
    setOnPressCallback(() => next.onPress);
  }, []);

  const showToast = useCallback((notification: AppNotification, onPress?: () => void) => {
    if (isShowing.current) {
      queue.current.push({ notif: notification, onPress });
    } else {
      isShowing.current = true;
      setCurrent(notification);
      setOnPressCallback(() => onPress);
    }
  }, []);

  const handleDismiss = useCallback(() => {
    isShowing.current = false;
    setCurrent(null);
    // Small delay between toasts
    setTimeout(processQueue, 300);
  }, [processQueue]);

  return (
    <ToastManagerContext.Provider value={{ showToast }}>
      {children}
      <NotificationToast
        notification={current}
        onDismiss={handleDismiss}
        onPress={onPressCallback}
      />
    </ToastManagerContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastManagerContext);
  if (!ctx) throw new Error('useToast must be used within ToastManagerProvider');
  return ctx;
}
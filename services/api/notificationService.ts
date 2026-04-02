import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export type NotificationType =
  | 'geofencing'
  | 'report_update'
  | 'emergency'
  | 'general'
  | 'success'
  | 'warning';

export interface StoredNotification {
  id: string;
  title: string;
  body: string;
  type: NotificationType;
  timestamp: string;
  read: boolean;
  location?: string;
  risk?: string;
  data?: any;
}

type AddNotificationFn = (n: {
  title: string;
  body: string;
  type: NotificationType;
  data?: any;
}) => Promise<void>;

const STORAGE_KEY = "app_notifications_v2";
const OLD_STORAGE_KEY = "USER_NOTIFICATIONS";
const MAX_NOTIFICATIONS = 100;

function generateId(): string {
  return `notif_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

class NotificationService {
  private addToContext: AddNotificationFn | null = null;

  setContextHandler(fn: AddNotificationFn) {
    this.addToContext = fn;
  }

  async requestPermissions(): Promise<boolean> {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === "granted";
  }

  private async saveToStorage(
    title: string,
    body: string,
    type: NotificationType,
    extra?: { location?: string; risk?: string; data?: any }
  ) {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const list: StoredNotification[] = raw ? JSON.parse(raw) : [];

      const newNotif: StoredNotification = {
        id: generateId(),
        title,
        body,
        type,
        timestamp: new Date().toISOString(),
        read: false,
        ...extra,
      };

      const updated = [newNotif, ...list].slice(0, MAX_NOTIFICATIONS);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save notification:', e);
    }
  }

  private async send(
    title: string,
    body: string,
    type: NotificationType,
    extra?: { location?: string; risk?: string; data?: any }
  ) {
    await Notifications.scheduleNotificationAsync({
      content: { title, body, data: extra?.data ,sound: 'default'},
      trigger: null,
    });

    if (this.addToContext) {
      await this.addToContext({ title, body, type, data: extra?.data });
    } else {
      await this.saveToStorage(title, body, type, extra);
    }
  }

  async migrateOldNotifications() {
    try {
      const old = await AsyncStorage.getItem(OLD_STORAGE_KEY);
      if (!old) return;

      const oldList: StoredNotification[] = JSON.parse(old);
      if (!oldList.length) return;

      const already = await AsyncStorage.getItem('notif_migrated');
      if (already) return;

      const newRaw = await AsyncStorage.getItem(STORAGE_KEY);
      const newList: StoredNotification[] = newRaw ? JSON.parse(newRaw) : [];

      const existingIds = new Set(newList.map(n => n.id));
      const toAdd = oldList.filter(n => !existingIds.has(n.id));

      const merged = [...newList, ...toAdd].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      await AsyncStorage.setItem('notif_migrated', 'true');
      await AsyncStorage.removeItem(OLD_STORAGE_KEY);

      console.log(`✅ Migrated ${toAdd.length} old notifications`);
    } catch (e) {
      console.error('Migration failed:', e);
    }
  }

  async sendGeofencingAlert(
    location: string,
    risk: string,
    message: string,
    data?: any
  ) {
    await this.send(
      `${risk} Risk Area`,
      message,
      'geofencing',
      { location, risk, data }
    );
  }

  async sendReportUpdate(reportId: string, status: string, data?: any) {
    await this.send(
      'Report Updated',
      `Your report #${reportId} is now ${status}`,
      'report_update',
      { data }
    );
  }

  async sendEmergencyAlert(message: string, data?: any) {
    await this.send('🚨 Emergency Alert', message, 'emergency', { data });
  }

  async sendSuccessNotification(title: string, message: string, data?: any) {
    await this.send(title, message, 'success', { data });
  }

  async sendWarning(title: string, message: string, data?: any) {
    await this.send(title, message, 'warning', { data });
  }

  async sendGeneral(title: string, message: string, data?: any) {
    await this.send(title, message, 'general', { data });
  }

  async getNotifications(): Promise<StoredNotification[]> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  async clearAll() {
    await AsyncStorage.multiRemove([
      OLD_STORAGE_KEY,
      STORAGE_KEY,
      'notif_migrated'
    ]);
  }
}

export const notificationService = new NotificationService();
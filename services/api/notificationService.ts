import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "USER_NOTIFICATIONS";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,

    // ✅ NEW REQUIRED PROPERTIES
    shouldShowBanner: true, // iOS
    shouldShowList: true,   // iOS notification list
  }),
});

class NotificationService {
  async requestPermissions() {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === "granted";
  }

  async sendGeofencingAlert(
    location: string,
    risk: string,
    message: string,
    data?: any
  ) {
    const id = Date.now().toString();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `${risk} Risk Area`,
        body: message,
        data,
      },
      trigger: null,
    });

    await this.storeNotification({
      id,
      title: `${risk} Risk Area`,
      body: message,
      location,
      risk,
      timestamp: new Date().toISOString(),
      read: false,
    });
  }

  private async storeNotification(notification: any) {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    const list = stored ? JSON.parse(stored) : [];
    list.unshift(notification);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  async getNotifications() {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }
}

export const notificationService = new NotificationService();

// services/api/notificationService.ts - Notification management

import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface NotificationData {
  id: string;
  title: string;
  body: string;
  data?: any;
  timestamp: string;
  type: 'geofencing' | 'report_update' | 'emergency' | 'general';
  priority: 'low' | 'normal' | 'high' | 'critical';
  read: boolean;
}

class NotificationService {
  private storageKey = 'app_notifications';
  
  constructor() {
    this.setupNotificationHandler();
  }

  private setupNotificationHandler() {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,  
        shouldShowList: true,
      }),
    });
  }

  // Request permissions
  async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Notification permission error:', error);
      return false;
    }
  }

  // Schedule local notification
  async scheduleNotification(
    title: string,
    body: string,
    data?: any,
    options?: {
      trigger?: Notifications.NotificationTriggerInput;
      priority?: 'low' | 'normal' | 'high' | 'critical';
      categoryIdentifier?: string;
    }
  ): Promise<string> {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: data || {},
          sound: 'default',
          priority: this.mapPriorityToExpo(options?.priority || 'normal'),
          categoryIdentifier: options?.categoryIdentifier,
        },
        trigger: options?.trigger || null,
      });

      // Store notification in local history
      await this.storeNotificationLocally({
        id: notificationId,
        title,
        body,
        data,
        timestamp: new Date().toISOString(),
        type: data?.type || 'general',
        priority: options?.priority || 'normal',
        read: false,
      });

      return notificationId;
    } catch (error) {
      console.error('Schedule notification error:', error);
      throw error;
    }
  }

  // Geofencing notification
  async sendGeofencingAlert(
    areaName: string,
    riskLevel: 'HIGH' | 'MEDIUM' | 'LOW',
    message: string,
    areaData?: any
  ): Promise<string> {
    const title = `⚠️ ${riskLevel} Risk Area Alert`;
    const body = message;
    
    return this.scheduleNotification(title, body, {
      type: 'geofencing',
      areaName,
      riskLevel,
      ...areaData,
    }, {
      priority: riskLevel === 'HIGH' ? 'critical' : 'high',
      categoryIdentifier: 'geofencing-alert',
    });
  }

  // Report update notification
  async sendReportUpdateNotification(
    reportId: number,
    status: string,
    message: string
  ): Promise<string> {
    return this.scheduleNotification(
      'Report Update',
      message,
      {
        type: 'report_update',
        reportId,
        status,
      },
      { priority: 'normal' }
    );
  }

  // Emergency notification
  async sendEmergencyAlert(message: string, data?: any): Promise<string> {
    return this.scheduleNotification(
      '🚨 Emergency Alert',
      message,
      {
        type: 'emergency',
        ...data,
      },
      { 
        priority: 'critical',
        categoryIdentifier: 'emergency-alert',
      }
    );
  }

  // Get notification history
  async getNotificationHistory(): Promise<NotificationData[]> {
    try {
      const stored = await AsyncStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Get notification history error:', error);
      return [];
    }
  }

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<void> {
    try {
      const history = await this.getNotificationHistory();
      const updated = history.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      );
      await AsyncStorage.setItem(this.storageKey, JSON.stringify(updated));
    } catch (error) {
      console.error('Mark notification read error:', error);
    }
  }

  // Mark all as read
  async markAllAsRead(): Promise<void> {
    try {
      const history = await this.getNotificationHistory();
      const updated = history.map(notif => ({ ...notif, read: true }));
      await AsyncStorage.setItem(this.storageKey, JSON.stringify(updated));
    } catch (error) {
      console.error('Mark all notifications read error:', error);
    }
  }

  // Clear notification history
  async clearHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error('Clear notification history error:', error);
    }
  }

  // Get unread count
  async getUnreadCount(): Promise<number> {
    try {
      const history = await this.getNotificationHistory();
      return history.filter(notif => !notif.read).length;
    } catch (error) {
      console.error('Get unread count error:', error);
      return 0;
    }
  }

  // Store notification locally
  private async storeNotificationLocally(notification: NotificationData): Promise<void> {
    try {
      const history = await this.getNotificationHistory();
      const updated = [notification, ...history].slice(0, 100); // Keep last 100
      await AsyncStorage.setItem(this.storageKey, JSON.stringify(updated));
    } catch (error) {
      console.error('Store notification locally error:', error);
    }
  }

  // Map priority to Expo notification priority
  private mapPriorityToExpo(priority: string): Notifications.AndroidNotificationPriority {
    switch (priority) {
      case 'low': return Notifications.AndroidNotificationPriority.LOW;
      case 'normal': return Notifications.AndroidNotificationPriority.DEFAULT;
      case 'high': return Notifications.AndroidNotificationPriority.HIGH;
      case 'critical': return Notifications.AndroidNotificationPriority.MAX;
      default: return Notifications.AndroidNotificationPriority.DEFAULT;
    }
  }

  // Cancel notification
  async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error('Cancel notification error:', error);
    }
  }

  // Cancel all notifications
  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Cancel all notifications error:', error);
    }
  }
}

export const notificationService = new NotificationService();
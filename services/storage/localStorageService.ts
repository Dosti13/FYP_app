
import AsyncStorage from '@react-native-async-storage/async-storage';

class LocalStorageService {
  // Generic storage methods
  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Failed to store ${key}:`, error);
      throw error;
    }
  }

  async getItem<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`Failed to retrieve ${key}:`, error);
      return null;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove ${key}:`, error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Failed to clear storage:', error);
      throw error;
    }
  }

async getAllKeys(): Promise<string[]> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    return [...keys]; // makes it a mutable string[]
  } catch (error) {
    console.error("Failed to get all keys:", error);
    return [];
  }
}

  async multiSet(keyValuePairs: [string, any][]): Promise<void> {
    try {
      const stringPairs: [string, string][] = keyValuePairs.map(([key, value]) => [
        key,
        JSON.stringify(value),
      ]);
      await AsyncStorage.multiSet(stringPairs);
    } catch (error) {
      console.error('Failed to set multiple items:', error);
      throw error;
    }
  }

  async multiGet(keys: string[]): Promise<Record<string, any>> {
    try {
      const values = await AsyncStorage.multiGet(keys);
      return values.reduce((acc, [key, value]) => {
        acc[key] = value ? JSON.parse(value) : null;
        return acc;
      }, {} as Record<string, any>);
    } catch (error) {
      console.error('Failed to get multiple items:', error);
      return {};
    }
  }

  async multiRemove(keys: string[]): Promise<void> {
    try {
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.error('Failed to remove multiple items:', error);
      throw error;
    }
  }

  // App-specific storage methods
  async storeDraftReport(draft: any): Promise<void> {
    const drafts = await this.getItem<any[]>('report_drafts') || [];
    const updatedDrafts = [...drafts, { ...draft, id: Date.now(), createdAt: new Date().toISOString() }];
    await this.setItem('report_drafts', updatedDrafts);
  }

  async getDraftReports(): Promise<any[]> {
    return await this.getItem<any[]>('report_drafts') || [];
  }

  async deleteDraftReport(id: number): Promise<void> {
    const drafts = await this.getItem<any[]>('report_drafts') || [];
    const updated = drafts.filter(draft => draft.id !== id);
    await this.setItem('report_drafts', updated);
  }

  async storeUserPreferences(preferences: any): Promise<void> {
    await this.setItem('user_preferences', preferences);
  }

  async getUserPreferences(): Promise<any> {
    return await this.getItem('user_preferences') || {};
  }

  async storeAppSettings(settings: any): Promise<void> {
    await this.setItem('app_settings', settings);
  }

  async getAppSettings(): Promise<any> {
    return await this.getItem('app_settings') || {};
  }

  // Cache management
  async setCacheItem(key: string, data: any, ttl: number = 300000): Promise<void> {
    const cacheData = {
      data,
      timestamp: Date.now(),
      ttl,
    };
    await this.setItem(`cache_${key}`, cacheData);
  }

  async getCacheItem<T>(key: string): Promise<T | null> {
    const cached = await this.getItem<{
      data: T;
      timestamp: number;
      ttl: number;
    }>(`cache_${key}`);

    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > cached.ttl;
    if (isExpired) {
      await this.removeItem(`cache_${key}`);
      return null;
    }

    return cached.data;
  }

  async clearCache(): Promise<void> {
    try {
      const keys = await this.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith('cache_'));
      await this.multiRemove(cacheKeys);
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }

  // Get storage usage info
  async getStorageInfo(): Promise<{
    totalKeys: number;
    cacheKeys: number;
    estimatedSize: number;
  }> {
    try {
      const keys = await this.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith('cache_'));
      
      // Rough estimation of storage size
      const sampleData = await this.multiGet(keys.slice(0, 10));
      const avgSize = Object.values(sampleData).reduce((acc, val) => 
        acc + JSON.stringify(val).length, 0
      ) / Object.keys(sampleData).length;

      return {
        totalKeys: keys.length,
        cacheKeys: cacheKeys.length,
        estimatedSize: Math.round(avgSize * keys.length),
      };
    } catch (error) {
      console.error('Failed to get storage info:', error);
      return { totalKeys: 0, cacheKeys: 0, estimatedSize: 0 };
    }
  }
}

export const localStorageService = new LocalStorageService();
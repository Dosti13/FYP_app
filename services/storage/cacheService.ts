// services/storage/cacheService.ts - Advanced caching with TTL and strategies
import { localStorageService } from "./localStorageService";
class CacheService {
  private memoryCache = new Map<string, {
    data: any;
    timestamp: number;
    ttl: number;
    accessCount: number;
    lastAccessed: number;
  }>();

  private maxMemoryItems = 100;

  // Set cache with TTL
  async set(
    key: string, 
    data: any, 
    ttl: number = 300000, 
    persistToDisk: boolean = true
  ): Promise<void> {
    const cacheEntry = {
      data,
      timestamp: Date.now(),
      ttl,
      accessCount: 0,
      lastAccessed: Date.now(),
    };

    // Store in memory
    this.memoryCache.set(key, cacheEntry);
    this.cleanupMemoryCache();

    // Store on disk if requested
    if (persistToDisk) {
      await localStorageService.setCacheItem(key, data, ttl);
    }
  }

  // Get from cache
  async get<T>(key: string): Promise<T | null> {
    // Try memory first
    const memoryEntry = this.memoryCache.get(key);
    if (memoryEntry && !this.isExpired(memoryEntry)) {
      memoryEntry.accessCount++;
      memoryEntry.lastAccessed = Date.now();
      return memoryEntry.data as T;
    }

    // Try disk cache
    const diskData = await localStorageService.getCacheItem<T>(key);
    if (diskData) {
      // Restore to memory cache
      await this.set(key, diskData, 300000, false);
      return diskData;
    }

    return null;
  }

  // Check if item exists and is valid
  async has(key: string): Promise<boolean> {
    const data = await this.get(key);
    return data !== null;
  }

  // Remove from cache
  async remove(key: string): Promise<void> {
    this.memoryCache.delete(key);
    await localStorageService.removeItem(`cache_${key}`);
  }

  // Clear all cache
  async clear(): Promise<void> {
    this.memoryCache.clear();
    await localStorageService.clearCache();
  }

  // Get or set pattern
  async getOrSet<T>(
    key: string, 
    fetchFn: () => Promise<T>, 
    ttl: number = 300000
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const fresh = await fetchFn();
    await this.set(key, fresh, ttl);
    return fresh;
  }

  // Bulk operations
  async setMany(items: Array<{
    key: string;
    data: any;
    ttl?: number;
  }>): Promise<void> {
    const promises = items.map(item => 
      this.set(item.key, item.data, item.ttl)
    );
    await Promise.all(promises);
  }

  async getMany<T>(keys: string[]): Promise<Record<string, T | null>> {
    const promises = keys.map(async key => [key, await this.get<T>(key)] as const);
    const results = await Promise.all(promises);
    return Object.fromEntries(results);
  }

  // Cache statistics
  getMemoryStats(): {
    size: number;
    maxSize: number;
    hitRate: number;
    items: Array<{
      key: string;
      accessCount: number;
      age: number;
    }>;
  } {
    const items = Array.from(this.memoryCache.entries()).map(([key, entry]) => ({
      key,
      accessCount: entry.accessCount,
      age: Date.now() - entry.timestamp,
    }));

    const totalAccess = items.reduce((sum, item) => sum + item.accessCount, 0);
    const hitRate = totalAccess > 0 ? (items.length / totalAccess) * 100 : 0;

    return {
      size: this.memoryCache.size,
      maxSize: this.maxMemoryItems,
      hitRate: Math.round(hitRate * 100) / 100,
      items: items.sort((a, b) => b.accessCount - a.accessCount),
    };
  }

  // Private helpers
  private isExpired(entry: { timestamp: number; ttl: number }): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  private cleanupMemoryCache(): void {
    if (this.memoryCache.size <= this.maxMemoryItems) return;

    // Remove expired items first
    for (const [key, entry] of this.memoryCache.entries()) {
      if (this.isExpired(entry)) {
        this.memoryCache.delete(key);
      }
    }

    // If still over limit, remove least recently used
    if (this.memoryCache.size > this.maxMemoryItems) {
      const entries = Array.from(this.memoryCache.entries());
      entries.sort((a, b) => a[1].lastAccessed - b[1].lastAccessed);
      
      const toRemove = entries.slice(0, entries.length - this.maxMemoryItems);
      toRemove.forEach(([key]) => this.memoryCache.delete(key));
    }
  }

  // Preload strategy
  async preload(keys: string[], fetchFn: (key: string) => Promise<any>): Promise<void> {
    const missing = [];
    
    for (const key of keys) {
      const exists = await this.has(key);
      if (!exists) {
        missing.push(key);
      }
    }

    const promises = missing.map(async key => {
      try {
        const data = await fetchFn(key);
        await this.set(key, data);
      } catch (error) {
        console.warn(`Failed to preload ${key}:`, error);
      }
    });

    await Promise.all(promises);
  }
}

export const cacheService = new CacheService();
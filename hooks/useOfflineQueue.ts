import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import { useNetworkStatus } from './useNetworkStatus';
import { apiService } from '../services/api/apiSerivce';
interface QueuedRequest {
  id: string;
  data: any;
  timestamp: number;
  retryCount: number;
}

export function useOfflineQueue() {
  const [queue, setQueue] = useState<QueuedRequest[]>([]);
  const [processing, setProcessing] = useState(false);
  const { isOnline } = useNetworkStatus();

  const STORAGE_KEY = 'offline_queue';
  const MAX_RETRIES = 3;

  // Load queue from storage on mount
  useEffect(() => {
    const loadQueue = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setQueue(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Failed to load offline queue:', error);
      }
    };
    loadQueue();
  }, []);

  // Save queue to storage
  const saveQueue = useCallback(async (newQueue: QueuedRequest[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newQueue));
      setQueue(newQueue);
    } catch (error) {
      console.error('Failed to save offline queue:', error);
    }
  }, []);

  // Add request to queue
  const addToQueue = useCallback(async (data: any) => {
    const request: QueuedRequest = {
      id: Date.now().toString(),
      data,
      timestamp: Date.now(),
      retryCount: 0,
    };
    
    const newQueue = [...queue, request];
    await saveQueue(newQueue);
    return request.id;
  }, [queue, saveQueue]);

  // Remove request from queue
  const removeFromQueue = useCallback(async (id: string) => {
    const newQueue = queue.filter(req => req.id !== id);
    await saveQueue(newQueue);
  }, [queue, saveQueue]);

  // Process queue when online
  const processQueue = useCallback(async () => {
    if (!isOnline || processing || queue.length === 0) return;

    setProcessing(true);

    for (const request of queue) {
      try {
        // Attempt to submit the request
        const result = await apiService.submitReport(request.data);
        
        if (result.success) {
          await removeFromQueue(request.id);
          console.log('Queued request processed successfully:', request.id);
        } else {
          throw new Error(result.message);
        }
      } catch (error) {
        console.error('Failed to process queued request:', error);
        
        // Increment retry count
        if (request.retryCount < MAX_RETRIES) {
          const updatedQueue = queue.map(req =>
            req.id === request.id 
              ? { ...req, retryCount: req.retryCount + 1 }
              : req
          );
          await saveQueue(updatedQueue);
        } else {
          // Remove failed request after max retries
          await removeFromQueue(request.id);
          console.log('Removed failed request after max retries:', request.id);
        }
      }
    }

    setProcessing(false);
  }, [isOnline, processing, queue, removeFromQueue, saveQueue]);

  // Auto-process when coming online
  useEffect(() => {
    if (isOnline) {
      processQueue();
    }
  }, [isOnline, processQueue]);

  // Clear queue
  const clearQueue = useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setQueue([]);
  }, []);

  return {
    queue,
    queueLength: queue.length,
    processing,
    addToQueue,
    removeFromQueue,
    processQueue,
    clearQueue,
  };
}
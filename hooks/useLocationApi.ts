import * as Location from 'expo-location';
import { useState, useCallback } from 'react';

export function useLocationPermissions() {
  const [permissionStatus, setPermissionStatus] = useState<Location.LocationPermissionResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const requestPermissions = useCallback(async () => {
    setLoading(true);
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(permission);
      return permission;
    } catch (error) {
      console.error('Location permission error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkPermissions = useCallback(async () => {
    setLoading(true);
    try {
      const permission = await Location.getForegroundPermissionsAsync();
      setPermissionStatus(permission);
      return permission;
    } catch (error) {
      console.error('Check location permission error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    permissionStatus,
    loading,
    requestPermissions,
    checkPermissions,
    isGranted: permissionStatus?.status === Location.PermissionStatus.GRANTED,
  };
}

export function useCurrentLocation() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = useCallback(async (options?: Location.LocationOptions) => {
    setLoading(true);
    setError(null);
    
    try {
      // Check permissions first
      const { status } = await Location.getForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        const permission = await Location.requestForegroundPermissionsAsync();
        if (permission.status !== 'granted') {
          throw new Error('Location permission denied');
        }
      }

      const locationResult = await Location.getCurrentPositionAsync(
        options || {
          accuracy: Location.Accuracy.High,
          timeout: 15000,
          maximumAge: 10000,
        }
      );
      
      setLocation(locationResult);
      return locationResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get location';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const watchLocation = useCallback(async (callback: (location: Location.LocationObject) => void) => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Location permission denied');
      }

      return await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 10,
        },
        callback
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to watch location';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  return {
    location,
    loading,
    error,
    getCurrentLocation,
    watchLocation,
    coordinates: location ? {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    } : null,
  };
}
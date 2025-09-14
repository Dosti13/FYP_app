import { useState } from 'react';
import * as Location from 'expo-location';

export function useLocation() {
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const getCurrentLocation = async () => {
    setIsLoadingLocation(true);
    
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Location permission denied');
      }

      const location = await Location.getCurrentPositionAsync({});
      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (error) {
      console.log('Error getting location:', error);
      return null;
    } finally {
      setIsLoadingLocation(false);
    }
  };

  return {
    getCurrentLocation,
    isLoadingLocation,
  };
}
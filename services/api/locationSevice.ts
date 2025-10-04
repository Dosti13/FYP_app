// services/api/locationService.ts - Location-specific API service
import * as Location from 'expo-location';

class LocationService {
  private googleApiKey: string;

  constructor() {
    this.googleApiKey = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY || '';
    console.log('Google Places API Key:', this.googleApiKey ? 'Loaded' : 'Not Set');
  }

  // Google Places Autocomplete

  // Reverse Geocoding
 async reverseGeocode(latitude: number, longitude: number): Promise<{
  street_address: string;
  neighborhood: string;
  district: string;
  city: string;
  province: string;
  country: string;
  latitude: number;
  longitude: number;
}> {
  try {
    const addresses = await Location.reverseGeocodeAsync({ latitude, longitude });

    if (!addresses || addresses.length === 0) {
      throw new Error('Geocoding failed: no address found');
    }

    const result = addresses[0];
console.log(result,"reverse geocode result");

    return {
        
      street_address: result.formattedAddress || result.street || result.name || '',
      neighborhood: result.subregion || '',
      district: result.district || '',
      city: result.city || '',
      province: result.region || '',
      country: result.country || '',
      latitude,
      longitude,
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    throw error;
  }
}


  // Get Place Details

  // Current Location with Expo Location
  async getCurrentLocation(options?: Location.LocationOptions): Promise<Location.LocationObject> {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        const permission = await Location.requestForegroundPermissionsAsync();
        if (permission.status !== 'granted') {
          throw new Error('Location permission denied');
        }
      }

      return await Location.getCurrentPositionAsync(
        options || {
          accuracy: Location.Accuracy.High,
          mayShowUserSettingsDialog: true,
        }
      );
    } catch (error) {
      console.error('Get location error:', error);
      throw error;
    }
  }

  // Watch Location


  // Calculate Distance (Haversine formula)
  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

 
}


export const locationService = new LocationService();
// services/api/locationService.ts - Location-specific API service
import * as Location from 'expo-location';

class LocationService {
  private googleApiKey: string;

  constructor() {
    this.googleApiKey = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY || '';
    console.log('Google Places API Key:', this.googleApiKey ? 'Loaded' : 'Not Set');
  }

  // Google Places Autocomplete
  async getPlacePredictions(
    input: string,
    location?: { latitude: number; longitude: number },
    radius: number = 50000
  ): Promise<any[]> {
    try {
      if (input.length < 2) return [];

      let url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${this.googleApiKey}&types=geocode`;
      
      if (location) {
        url += `&location=${location.latitude},${location.longitude}&radius=${radius}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK') {
        return data.predictions || [];
      } else {
        throw new Error(data.error_message || 'Places API error');
      }
    } catch (error) {
      console.error('Places prediction error:', error);
      throw error;
    }
  }

  // Reverse Geocoding
  async reverseGeocode(latitude: number, longitude: number): Promise<{
    formatted_address: string;
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
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${this.googleApiKey}`
      );
      const data = await response.json();
      
      if (data.status === 'OK' && data.results.length > 0) {
        const result = data.results[0];
        const addressComponents = result.address_components;
        
        const getComponent = (types: string[]) => {
          const component = addressComponents.find((comp: any) =>
            comp.types.some((type: string) => types.includes(type))
          );
          return component?.long_name || '';
        };

        return {
          formatted_address: result.formatted_address,
          street_address: result.formatted_address,
          neighborhood: getComponent(['sublocality_level_1', 'neighborhood']),
          district: getComponent(['administrative_area_level_2']),
          city: getComponent(['locality', 'administrative_area_level_3']),
          province: getComponent(['administrative_area_level_1']),
          country: getComponent(['country']),
          latitude,
          longitude,
        };
      } else {
        throw new Error(data.error_message || 'Geocoding failed');
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      throw error;
    }
  }

  // Get Place Details
  async getPlaceDetails(placeId: string): Promise<any> {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${this.googleApiKey}&fields=name,geometry,formatted_address,address_components`
      );
      const data = await response.json();
      
      if (data.status === 'OK') {
        return data.result;
      } else {
        throw new Error(data.error_message || 'Place details error');
      }
    } catch (error) {
      console.error('Place details error:', error);
      throw error;
    }
  }

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
  async watchLocation(
    callback: (location: Location.LocationObject) => void,
    options?: Location.LocationOptions
  ): Promise<Location.LocationSubscription> {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Location permission denied');
      }

      return await Location.watchPositionAsync(
        options || {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 10,
        },
        callback
      );
    } catch (error) {
      console.error('Watch location error:', error);
      throw error;
    }
  }

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

  // Get Location Name (simplified reverse geocoding)
  async getLocationName(latitude: number, longitude: number): Promise<string> {
    try {
      const result = await this.reverseGeocode(latitude, longitude);
      return result.formatted_address;
    } catch (error) {
      return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
    }
  }
}

export const locationService = new LocationService();
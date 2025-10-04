// components/forms/LocationForm.tsx (Enhanced with Map)
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity,ScrollView} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MapLocationPicker } from './MapLocationPicker';
import { LocationData } from '../../constants/types/report';
import { colors } from '../../constants/theme';
import { locationService } from '../../services/api/locationSevice';
interface LocationFormProps {
  data: LocationData;
  onUpdate: (data: Partial<LocationData>) => void;
}

export function LocationForm({ data, onUpdate }: LocationFormProps) {
  const [locationMethod, setLocationMethod] = useState<'form' | 'map' | 'current'>('form');
  const [showMapPicker, setShowMapPicker] = useState(false);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);



  const handleCurrentLocation = async () => {
    setIsLoadingLocation(true);
    setLocationMethod('current');
    const location = await locationService.getCurrentLocation();
    if (location) {
      onUpdate({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        street_address: `${location.coords.latitude.toFixed(6)}, ${location.coords.longitude.toFixed(6)}`,
      });
     

      // Reverse geocode to get address details
      try {
        const addressInfo = await locationService.reverseGeocode(location.coords.latitude, location.coords.longitude);
        
        if (addressInfo) {
          onUpdate(addressInfo);
        }
      } catch (error) {
        console.log('Reverse geocoding failed:', error);
      }
      finally {
        setIsLoadingLocation(false);  
      }
    }
  };

  const handleMapSelection =async (locationData: Partial<LocationData>) => {

    setLocationMethod('map');
 

    onUpdate(locationData);     
    console.log(locationData,"location data from map picker");
    
    setShowMapPicker(false);

  }



  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Where did this happen?</Text>
      <Text style={styles.subtitle}>Choose how you want to set the location</Text>

      {/* Location Method Selector */}
      <View style={styles.methodSelector}>
        <TouchableOpacity
          style={[
            styles.methodOption,
            locationMethod === 'current' && styles.selectedMethod
          ]}
          onPress={handleCurrentLocation}
          disabled={isLoadingLocation}
        >
          <Ionicons 
            name="navigate" 
            size={20} 
            color={locationMethod === 'current' ? '#fff' : colors.primary} 
          />
          <Text style={[
            styles.methodText,
            locationMethod === 'current' && styles.selectedMethodText
          ]}>
            {isLoadingLocation ? 'Getting Location...' : 'Current Location'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.methodOption,
            locationMethod === 'map' && styles.selectedMethod
          ]}
          onPress={() => setShowMapPicker(true)}
        >
          <Ionicons 
            name="map" 
            size={20} 
            color={locationMethod === 'map' ? '#fff' : colors.primary} 
          />
          <Text style={[
            styles.methodText,
            locationMethod === 'map' && styles.selectedMethodText
          ]}>
            Select on Map
          </Text>
        </TouchableOpacity>

      
      </View>

      {/* Show selected location info if map or current location used */}
      {(locationMethod === 'map' || locationMethod === 'current') && data.latitude && data.longitude && (
        <View style={styles.selectedLocationInfo}>
          <View style={styles.locationHeader}>
            <Ionicons name="location" size={16} color={colors.primary} />
            <Text style={styles.locationHeaderText}>Selected Location</Text>
          </View>
          <Text style={styles.addressText}>{data.street_address}</Text>
          <Text style={styles.coordinatesText}>
            {data.latitude.toFixed(6)}, {data.longitude.toFixed(6)}
          </Text>
        </View>
      )}

      
      {/* Map Picker Modal */}
      {showMapPicker && (
        <MapLocationPicker
          initialLocation={data.latitude && data.longitude ? {
            latitude: data.latitude,
            longitude: data.longitude
          } : null}
          onLocationSelect={handleMapSelection}
          onCancel={() => setShowMapPicker(false)}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.mutedText,
    marginBottom: 24,
  },
  methodSelector: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 8,
  },
  methodOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    gap: 6,
  },
  selectedMethod: {
    backgroundColor: colors.primary,
  },
  methodText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.primary,
  },
  selectedMethodText: {
    color: '#fff',
  },
  selectedLocationInfo: {
    backgroundColor: '#f0f9ff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dbeafe',
    marginBottom: 20,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 6,
    flex: 1,
  },

  addressText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  coordinatesText: {
    fontSize: 12,
    color: colors.mutedText,
    fontFamily: 'monospace',
  },
});

// components/forms/MapLocationPicker.tsx

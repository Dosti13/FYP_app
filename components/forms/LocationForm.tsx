// components/forms/LocationForm.tsx (Enhanced with Map)
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { LocationPicker } from './LocationPicker';
import { MapLocationPicker } from './MapLocationPicker';
import { useLocation } from '../../hooks/useLocation';
import { LocationData } from '../../constants/types/report';
import { colors } from '../../constants/theme';

interface LocationFormProps {
  data: LocationData;
  onUpdate: (data: Partial<LocationData>) => void;
}

export function LocationForm({ data, onUpdate }: LocationFormProps) {
  const [locationMethod, setLocationMethod] = useState<'form' | 'map' | 'current'>('form');
  const [showMapPicker, setShowMapPicker] = useState(false);
  const { getCurrentLocation, isLoadingLocation } = useLocation();

  const handleCurrentLocation = async () => {
    setLocationMethod('current');
    const location = await getCurrentLocation();
    if (location) {
      onUpdate({
        latitude: location.latitude,
        longitude: location.longitude,
        street_address: `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`,
      });
      
      // Reverse geocode to get address details
      try {
        const addressInfo = await reverseGeocode(location.latitude, location.longitude);
        if (addressInfo) {
          onUpdate(addressInfo);
        }
      } catch (error) {
        console.log('Reverse geocoding failed:', error);
      }
    }
  };

  const handleMapSelection = (locationData: Partial<LocationData>) => {
    setLocationMethod('map');
    onUpdate(locationData);
    setShowMapPicker(false);
  };

  const handleFormInput = () => {
    setLocationMethod('form');
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY}`
      );
      const data = await response.json();
      
      if (data.status === 'OK' && data.results.length > 0) {
        const result = data.results[0];
        const addressComponents = result.address_components;
        
        // Parse address components
        const getComponent = (types: string[]) => {
          const component = addressComponents.find((comp: any) =>
            comp.types.some((type: string) => types.includes(type))
          );
          return component?.long_name || '';
        };

        return {
          street_address: result.formatted_address,
          neighborhood: getComponent(['sublocality_level_1', 'neighborhood']),
          district: getComponent(['administrative_area_level_2']),
          city: getComponent(['locality', 'administrative_area_level_3']),
          province: getComponent(['administrative_area_level_1']),
          latitude: lat,
          longitude: lng,
        };
      }
      return null;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return null;
    }
  };

  return (
    <View style={styles.container}>
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

        <TouchableOpacity
          style={[
            styles.methodOption,
            locationMethod === 'form' && styles.selectedMethod
          ]}
          onPress={handleFormInput}
        >
          <Ionicons 
            name="create" 
            size={20} 
            color={locationMethod === 'form' ? '#fff' : colors.primary} 
          />
          <Text style={[
            styles.methodText,
            locationMethod === 'form' && styles.selectedMethodText
          ]}>
            Enter Manually
          </Text>
        </TouchableOpacity>
      </View>

      {/* Show selected location info if map or current location used */}
      {(locationMethod === 'map' || locationMethod === 'current') && data.latitude && data.longitude && (
        <View style={styles.selectedLocationInfo}>
          <View style={styles.locationHeader}>
            <Ionicons name="location" size={16} color={colors.primary} />
            <Text style={styles.locationHeaderText}>Selected Location</Text>
            <TouchableOpacity onPress={() => setLocationMethod('form')}>
              <Text style={styles.editText}>Edit manually</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.addressText}>{data.street_address}</Text>
          <Text style={styles.coordinatesText}>
            {data.latitude.toFixed(6)}, {data.longitude.toFixed(6)}
          </Text>
        </View>
      )}

      {/* Form fields - show based on method or if editing */}
      {locationMethod === 'form' && (
        <>
          <LocationPicker
            selectedProvince={data.province}
            selectedCity={data.city}
            onProvinceChange={(province) => onUpdate({ province, city: '' })}
            onCityChange={(city) => onUpdate({ city })}
          />

          <Input
            label="District"
            placeholder="e.g., Karachi Central"
            value={data.district}
            onChangeText={(district) => onUpdate({ district })}
          />

          <Input
            label="Neighborhood/Area"
            placeholder="e.g., Gulshan-e-Iqbal"
            value={data.neighborhood}
            onChangeText={(neighborhood) => onUpdate({ neighborhood })}
            required
          />

          <Input
            label="Street Address"
            placeholder="e.g., Block 13-D, Main University Road"
            value={data.street_address}
            onChangeText={(street_address) => onUpdate({ street_address })}
            multiline
          />
        </>
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
    </View>
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
  editText: {
    fontSize: 12,
    color: colors.primary,
    textDecorationLine: 'underline',
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

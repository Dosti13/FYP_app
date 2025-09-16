import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../common/Button';
import { colors } from '../../constants/theme';
import { locationService } from '../../services/api/locationSevice';
import { locationValidationService } from '@/services';

interface LocationData {
  latitude: number;
  longitude: number;
  street_address?: string;
  neighborhood?: string;
  district?: string;
  city?: string;
  province?: string;
}

interface MapLocationPickerProps {
  initialLocation?: {
    latitude: number;
    longitude: number;
  } | null;
  onLocationSelect: (locationData: LocationData) => void;
  onCancel: () => void;
}

export function MapLocationPicker({ 
  initialLocation, 
  onLocationSelect, 
  onCancel 
}: MapLocationPickerProps) {
  const [selectedLocation, setSelectedLocation] = useState(
    initialLocation || {
      latitude: 24.8607, // Karachi coordinates as default
      longitude: 67.0011,
    }
  );
  const [isLoading, setIsLoading] = useState(false);
  const mapRef = useRef<MapView>(null);

  const [region, setRegion] = useState<Region>({
    ...selectedLocation,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const handleMapPress = (event: any) => {
    const coordinate = event.nativeEvent.coordinate;
    setSelectedLocation(coordinate);
  };

  const handleConfirmLocation = async () => {
    setIsLoading(true);
    
    try {
      // Use the location service for reverse geocoding
       const isValid = locationValidationService.isWithinPakistan(
      selectedLocation.latitude,
      selectedLocation.longitude
    );

    if (!isValid) {
      Alert.alert(
        "Invalid Location",
        "The selected location appears to be outside Pakistan. Please select a valid location inside Pakistan."
      );
      setIsLoading(false);
      return; // ⛔ stop execution
    }

      const geocodedData = await locationService.reverseGeocode(
        selectedLocation.latitude,
        selectedLocation.longitude
      );

      const locationData: LocationData = {
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        street_address: geocodedData.formatted_address,
        neighborhood: geocodedData.neighborhood,
        district: geocodedData.district,
        city: geocodedData.city,
        province: geocodedData.province,
      };

      onLocationSelect(locationData);
    } catch (error) {
      console.error('Error getting address:', error);
      Alert.alert('Error', 'Could not get address for selected location');
      // Still allow selection with just coordinates
      const fallbackLocationData: LocationData = {
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        street_address: `${selectedLocation.latitude.toFixed(6)}, ${selectedLocation.longitude.toFixed(6)}`,
      };
      onLocationSelect(fallbackLocationData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMyLocation = async () => {
    try {
      setIsLoading(true);
      const location = await locationService.getCurrentLocation();
      const newLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      
      setSelectedLocation(newLocation);
      
      const newRegion = {
        ...newLocation,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      
      setRegion(newRegion);
      mapRef.current?.animateToRegion(newRegion, 1000);
    } catch (error) {
      console.error('Error getting current location:', error);
      Alert.alert('Error', 'Could not get your current location. Please ensure location permissions are granted.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={true}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onCancel}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Location</Text>
          <TouchableOpacity onPress={handleMyLocation} disabled={isLoading}>
            <Ionicons 
              name="locate" 
              size={24} 
              color={isLoading ? colors.mutedText : colors.primary} 
            />
          </TouchableOpacity>
        </View>

        {/* Instructions */}
        <View style={styles.instructions}>
          <Text style={styles.instructionText}>
            Tap on the map to select the incident location
          </Text>
        </View>

        {/* Map */}
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={region}
            onRegionChangeComplete={setRegion}
            onPress={handleMapPress}
            showsUserLocation={true}
            showsMyLocationButton={false}
          >
            <Marker
              coordinate={selectedLocation}
              draggable
              onDragEnd={(e) => setSelectedLocation(e.nativeEvent.coordinate)}
            >
              <View style={styles.markerContainer}>
                <Ionicons name="location" size={30} color={colors.error} />
              </View>
            </Marker>
          </MapView>
        </View>

        {/* Selected Location Info */}
        <View style={styles.locationInfo}>
          <Text style={styles.locationTitle}>Selected Location:</Text>
          <Text style={styles.coordinates}>
            {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button
            title="Cancel"
            variant="outline"
            onPress={onCancel}
            style={styles.actionButton}
          />
          <Button
            title="Confirm Location"
            onPress={handleConfirmLocation}
            loading={isLoading}
            style={styles.actionButton}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  instructions: {
    backgroundColor: '#fffbeb',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#fde68a',
  },
  instructionText: {
    fontSize: 14,
    color: '#92400e',
    textAlign: 'center',
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    alignItems: 'center',
  },
  locationInfo: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  locationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  coordinates: {
    fontSize: 14,
    color: colors.mutedText,
    fontFamily: 'monospace',
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
});
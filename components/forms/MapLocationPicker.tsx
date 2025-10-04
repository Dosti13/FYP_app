import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../common/Button';
import { colors } from '../../constants/theme';
import { locationService } from '../../services/api/locationSevice';
import { locationValidationService } from '@/services';
import { searchPlaces, PlaceFeature } from '../../services/api/searchService';

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

const DEFAULT_LOCATION = { latitude: 24.8607, longitude: 67.0011 }; // Karachi
const SEARCH_MIN_LENGTH = 3;
const SEARCH_DEBOUNCE_MS = 400;
const LOCATION_DELTA = 0.01;

export function MapLocationPicker({ 
  initialLocation, 
  onLocationSelect, 
  onCancel 
}: MapLocationPickerProps) {
  const [selectedLocation, setSelectedLocation] = useState(initialLocation || DEFAULT_LOCATION);
  const [region, setRegion] = useState<Region>({
    ...selectedLocation,
    latitudeDelta: LOCATION_DELTA,
    longitudeDelta: LOCATION_DELTA,
  });
  const [placeName, setPlaceName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PlaceFeature[]>([]);
  const mapRef = useRef<MapView>(null);

  // ✅ Memoized search function to prevent recreation
  const fetchSearchResults = useCallback(async (query: string) => {
    try {
      const results = await searchPlaces(query, 5);
      setSearchResults(results);
    } catch (err) {
      console.error('Search error:', err);
      setSearchResults([]);
    }
  }, []);

  // ✅ Debounced search with cleanup
  useEffect(() => {
    if (searchQuery.length < SEARCH_MIN_LENGTH) {
      setSearchResults([]);
      return;
    }

    const timeout = setTimeout(() => {
      fetchSearchResults(searchQuery);
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [searchQuery, fetchSearchResults]);

  // ✅ Memoized reverse geocoding function
  const reverseGeocode = useCallback(async (latitude: number, longitude: number) => {
    try {
      const geocodedData = await locationService.reverseGeocode(latitude, longitude);
      const name = geocodedData.street_address || 
                   geocodedData.neighborhood || 
                   geocodedData.city || 
                   'Unknown location';
      setPlaceName(name);
      return geocodedData;
    } catch (error) {
      console.error('Reverse geocode error:', error);
      setPlaceName('Unknown location');
      return null;
    }
  }, []);

  // ✅ Optimized place selection
  const handleSelectPlace = useCallback(async (place: PlaceFeature) => {
    const [longitude, latitude] = place.geometry.coordinates;
    const newLocation = { latitude, longitude };
   
    setSelectedLocation(newLocation);
    setSearchQuery(place.properties.name?.trim() || '');
    setSearchResults([]);

    // Animate map
    const newRegion = { 
      ...newLocation, 
      latitudeDelta: LOCATION_DELTA, 
      longitudeDelta: LOCATION_DELTA 
    };
    setRegion(newRegion);
    mapRef.current?.animateToRegion(newRegion, 1000);

    // Fetch full location data
    await reverseGeocode(latitude, longitude);
  }, [reverseGeocode]);

  // ✅ Optimized map press handler
  const handleMapPress = useCallback(async (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
 const pak = locationValidationService.isWithinPakistan(latitude, longitude);
    console.log(pak,"is within pakistan");
    if (!pak) {
      Alert.alert(
        'Invalid Location', 'The selected location is outside Pakistan. Please select a valid location.', [{ text: 'OK' }]
      );
      return;
    } 
    setSelectedLocation({ latitude, longitude });
    await reverseGeocode(latitude, longitude);
  }, [reverseGeocode]);

  // ✅ Optimized marker drag end
  const handleMarkerDragEnd = useCallback(async (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    
     const pak = locationValidationService.isWithinPakistan(latitude, longitude);
    console.log(pak,"is within pakistan");
    if (!pak) {
      Alert.alert(
        'Invalid Location', 'The selected location is outside Pakistan. Please select a valid location.', [{ text: 'OK' }]
      );
      return setSelectedLocation((prev) => prev); 
    } 
    
    setSelectedLocation({ latitude, longitude });
    await reverseGeocode(latitude, longitude);
  }, [reverseGeocode]);

  // ✅ Optimized confirm handler
  const handleConfirmLocation = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Validate location is in Pakistan
      if (!locationValidationService.isWithinPakistan(
        selectedLocation.latitude, 
        selectedLocation.longitude
      )) {
        Alert.alert(
          'Invalid Location',
          'The selected location is outside Pakistan. Please select a valid location.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Get full location data
      const geocodedData = await locationService.reverseGeocode(
        selectedLocation.latitude, 
        selectedLocation.longitude
      );

      onLocationSelect({
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        street_address: geocodedData.street_address,
        neighborhood: geocodedData.neighborhood,
        district: geocodedData.district,
        city: geocodedData.city,
        province: geocodedData.province,
      });
    } catch (error) {
      console.error('Confirm location error:', error);
      // Fallback: return coordinates only
      onLocationSelect({
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedLocation, onLocationSelect]);

  // ✅ Optimized current location handler
  const handleMyLocation = useCallback(async () => {
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
        latitudeDelta: LOCATION_DELTA,
        longitudeDelta: LOCATION_DELTA,
      };
      
      setRegion(newRegion);
      mapRef.current?.animateToRegion(newRegion, 1000);
      
      await reverseGeocode(newLocation.latitude, newLocation.longitude);
    } catch (error) {
      Alert.alert('Location Error', 'Could not get your current location.');
    } finally {
      setIsLoading(false);
    }
  }, [reverseGeocode]);

  // ✅ Memoized formatted coordinates
  const formattedCoordinates = useMemo(() => 
    `${selectedLocation.latitude.toFixed(6)}, ${selectedLocation.longitude.toFixed(6)}`,
    [selectedLocation]
  );

  // ✅ Memoized search result items
  const renderSearchResults = useMemo(() => {
    if (searchResults.length === 0) return null;

    return (
      <ScrollView 
        style={styles.searchResults} 
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {searchResults.map((place, index) => (
          <TouchableOpacity 
            key={`${place.properties.osm_id || index}`}
            style={styles.resultItem} 
            onPress={() => handleSelectPlace(place)}
          >
            <Ionicons name="location-outline" size={16} color={colors.primary} />
            <Text style={styles.resultText} numberOfLines={2}>
              {place.properties.name?.trim()}
              {place.properties.city ? `, ${place.properties.city.trim()}` : ''}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }, [searchResults, handleSelectPlace]);

  return (
    <Modal visible={true} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onCancel} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Location</Text>
          <TouchableOpacity 
            onPress={handleMyLocation} 
            disabled={isLoading}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons 
              name="locate" 
              size={24} 
              color={isLoading ? colors.mutedText : colors.primary} 
            />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.mutedText} />
          <TextInput
            placeholder="Search for place in Pakistan..."
            placeholderTextColor={colors.mutedText}
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="words"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={colors.mutedText} />
            </TouchableOpacity>
          )}
        </View>

        {/* Search Results */}
        {renderSearchResults}

        {/* Map */}
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={region}
            onRegionChangeComplete={setRegion}
            onPress={handleMapPress}
            showsUserLocation
            showsMyLocationButton={false}
            loadingEnabled
            loadingIndicatorColor={colors.primary}
          >
            <Marker 
              coordinate={selectedLocation} 
              draggable 
              title={placeName}
              onDragEnd={handleMarkerDragEnd}
            >
              <View style={styles.markerContainer}>
                <Ionicons name="location" size={36} color={colors.error} />
              </View>
            </Marker>
          </MapView>
        </View>

        {/* Selected Location Info */}
        <View style={styles.locationInfo}>
          <View style={styles.locationHeader}>
            <Ionicons name="pin" size={16} color={colors.primary} />
            <Text style={styles.locationTitle}>Selected Location</Text>
          </View>
          {placeName ? (
            <Text style={styles.placeName} numberOfLines={2}>{placeName}</Text>
          ) : null}
          <Text style={styles.coordinates}>{formattedCoordinates}</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button 
            title="Cancel" 
            variant="outline" 
            onPress={onCancel} 
            style={styles.actionButton}
            disabled={isLoading}
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
    backgroundColor: colors.background 
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
    color: colors.text 
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginTop: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  searchInput: { 
    flex: 1, 
    paddingVertical: 10, 
    fontSize: 14,
    color: colors.text,
  },
  searchResults: {
    maxHeight: 200,
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginTop: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 8,
  },
  resultText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  mapContainer: { 
    flex: 1,
    marginTop: 8,
  },
  map: { 
    flex: 1 
  },
  markerContainer: { 
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationInfo: { 
    backgroundColor: '#fff', 
    paddingHorizontal: 20, 
    paddingVertical: 16, 
    borderTopWidth: 1, 
    borderTopColor: colors.border,
    gap: 6,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationTitle: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: colors.text,
  },
  placeName: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  coordinates: { 
    fontSize: 12, 
    color: colors.mutedText, 
    fontFamily: 'monospace',
  },
  actions: { 
    flexDirection: 'row', 
    paddingHorizontal: 20, 
    paddingVertical: 16, 
    backgroundColor: '#fff', 
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: { 
    flex: 1 
  },
});
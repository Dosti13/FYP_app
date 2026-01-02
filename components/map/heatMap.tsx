import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, ActivityIndicator, Text } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { locationService, apiService } from "@/services";

interface HeatmapData {
  latitude: string;
  longitude: string;
  incident_count: number;
  city: string;
  district: string;
}

export default function RestrictedAreasMap() {
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mapRef = useRef<MapView>(null);

  // Smart coordinate parser - handles multiple formats
  const parseCoordinate = (coord: string): number => {
    // Remove any whitespace
    const cleaned = coord.trim();
    
    // If it contains a decimal point, parse directly
    if (cleaned.includes('.')) {
      return parseFloat(cleaned);
    }
    
    // If it's a long number (like "24860700"), divide by 1,000,000
    const num = parseFloat(cleaned);
    if (num > 1000) {
      return num / 1000000;
    }
    
    // Otherwise, return as is
    return num;
  };

  // Get current location
  const getCurrentLocation = async () => {
    try {
      const loc = await locationService.getCurrentLocation();
      setCurrentLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      mapRef.current?.animateToRegion(
        {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        },
        1000
      );
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };

  // Fetch heatmap data from API
  const fetchHeatmapData = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await apiService.getHeatmap({ days: 30 });
      
      console.log('=== HEATMAP API RESPONSE ===');
      console.log('Total locations:', data.length);
      if (data.length > 0) {
        console.log('First location raw data:', data[0]);
        console.log('Latitude (raw):', data[0].latitude);
        console.log('Longitude (raw):', data[0].longitude);
        
        const lat = parseCoordinate(data[0].latitude);
        const lng = parseCoordinate(data[0].longitude);
        console.log('Parsed coordinates:', { lat, lng });
        console.log('Valid?', !isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180);
      }
      console.log('===========================');
      
      setHeatmapData(data);
    } catch (err: any) {
      console.error('Error fetching heatmap data:', err);
      setError(err.message || 'Failed to load crime data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentLocation();
    fetchHeatmapData();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        showsUserLocation={true}
        initialRegion={{
          latitude: 24.8607,
          longitude: 67.0011,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2,
        }}
      >
        {/* Render API data with red circles */}
        {!loading && heatmapData.map((area, index) => {
          const latitude = parseCoordinate(area.latitude);
          const longitude = parseCoordinate(area.longitude);

          console.log(`Rendering circle ${index}:`, {
            district: area.district,
            city: area.city,
            originalLat: area.latitude,
            originalLng: area.longitude,
            parsedLat: latitude,
            parsedLng: longitude,
            isValid: !isNaN(latitude) && !isNaN(longitude)
          });

          // Validate coordinates are within valid range
          if (
            isNaN(latitude) || 
            isNaN(longitude) || 
            latitude < -90 || 
            latitude > 90 || 
            longitude < -180 || 
            longitude > 180
          ) {
            console.warn(`❌ Invalid coordinates for ${area.district}:`, { latitude, longitude });
            return null;
          }

          return (
            <React.Fragment key={`crime-area-${index}`}>
              {/* Red Crime Circle */}
              <Circle
                center={{ latitude, longitude }}
                radius={300} // 300 meters - larger for visibility
                strokeWidth={4}
                strokeColor="#FF0000"
                fillColor="rgba(255, 0, 0, 0.4)"
              />
              
              {/* Warning Marker */}
              <Marker
                coordinate={{ latitude, longitude }}
                title={`⚠️ ${area.district}, ${area.city}`}
                description={`Crime incidents: ${area.incident_count}`}
                pinColor="red"
              >
                <View style={styles.markerContainer}>
                  <Ionicons name="warning" size={28} color="#FF0000" />
                </View>
              </Marker>
            </React.Fragment>
          );
        })}
      </MapView>


      {/* Loading Indicator */}
      {loading && (
        <View style={styles.loadingContainer}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Loading crime data...</Text>
          </View>
        </View>
      )}

      {/* Error Display */}
      {error && (
        <View style={styles.errorContainer}>
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={24} color="#FF3B30" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchHeatmapData}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Legend */}
      {!loading && !error && heatmapData.length > 0 && (
        <View style={styles.legendContainer}>
          <Text style={styles.legendTitle}>🔴 Crime Areas</Text>
          <View style={styles.legendItem}>
            <View style={styles.legendDot} />
            <Text style={styles.legendText}>300m danger zone</Text>
          </View>
          <Text style={styles.legendSubtext}>
            {heatmapData.length} location{heatmapData.length !== 1 ? 's' : ''} found
          </Text>
        </View>
      )}

      {/* Zoom to first crime area button */}
      {heatmapData.length > 0 && (
        <TouchableOpacity
          style={[styles.actionButton, { bottom: 140 }]}
          onPress={() => {
            const firstArea = heatmapData[0];
            const lat = parseCoordinate(firstArea.latitude);
            const lng = parseCoordinate(firstArea.longitude);
            
            mapRef.current?.animateToRegion({
              latitude: lat,
              longitude: lng,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }, 1000);
          }}
        >
          <Ionicons name="navigate" size={24} color="white" />
        </TouchableOpacity>
      )}

      {/* Go to My Location Button */}
      <TouchableOpacity
        style={[styles.actionButton, { bottom: 80 }]}
        onPress={getCurrentLocation}
      >
        <Ionicons name="locate" size={28} color="white" />
      </TouchableOpacity>

      {/* Refresh Data Button */}
      <TouchableOpacity
        style={styles.actionButton}
        onPress={fetchHeatmapData}
        disabled={loading}
      >
        <Ionicons name="refresh" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  map: { 
    flex: 1 
  },
  markerContainer: {
    backgroundColor: 'white',
    padding: 6,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#FF0000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  actionButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "rgba(0,122,255,0.95)",
    borderRadius: 50,
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  loadingBox: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  errorContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
  },
  errorBox: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'column',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  errorText: {
    fontSize: 14,
    color: '#FF3B30',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 6,
    marginTop: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  debugContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    maxWidth: 280,
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333',
  },
  debugText: {
    fontSize: 11,
    color: '#666',
    marginBottom: 2,
    fontFamily: 'monospace',
  },
  legendContainer: {
    position: 'absolute',
    bottom: 220,
    left: 20,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  legendDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 8,
    backgroundColor: 'rgba(255, 0, 0, 0.4)',
    borderWidth: 2,
    borderColor: '#FF0000',
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  legendSubtext: {
    fontSize: 11,
    color: '#999',
    marginTop: 6,
    fontStyle: 'italic',
  },
});
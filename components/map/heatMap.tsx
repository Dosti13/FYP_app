import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { dummyAreas } from "../../utils/dumyData";
import { locationService } from "@/services";

export default function RestrictedAreasMap() {
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const mapRef = useRef<MapView>(null);

  // Get current location
  
  const getCurrentLocation = async () => {
    try {
      const loc = await locationService.getCurrentLocation();
      setCurrentLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      // Move map to current location
      mapRef.current?.animateToRegion(
        {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        },
        1000
      );
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);
  console.log("heat map render");
  
  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        showsUserLocation={true} // hide default blue dot
        initialRegion={{
          latitude: 24.8607,
          longitude: 67.0011,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {dummyAreas.map((area) => (
          <React.Fragment key={area.id}>
            <Marker
              coordinate={area.coordinates}
              title={area.name}
              description={`Risk Level: ${area.riskLevel}`}
            />
            <Circle
              center={area.coordinates}
              radius={area.radius}
              strokeWidth={3}
              strokeColor="red"
              fillColor="rgba(255,0,0,0.3)"
            />
          </React.Fragment>
        ))}

     
      </MapView>

      {/* Floating "Go to My Location" Button */}
      <TouchableOpacity
        style={styles.myLocationButton}
        onPress={getCurrentLocation}
      >
        <Ionicons name="location-outline" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  myLocationButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "rgba(0,122,255,0.9)",
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
});

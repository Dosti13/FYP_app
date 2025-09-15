import React from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker, Circle } from "react-native-maps";
import { dummyAreas } from "../../utils/dumyData";
export default function RestrictedAreasMap() {

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 24.8607,
          longitude: 67.0011,
          latitudeDelta: 0.05, // closer zoom
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});

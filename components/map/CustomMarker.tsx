// CustomMarker.tsx - MARKER DISPLAY COMPONENT
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Marker } from 'react-native-maps';
import { CustomMarkerProps } from '../../types/map';

const CustomMarker: React.FC<CustomMarkerProps> = ({
  id,
  latitude,
  longitude,
  title,
  description,
  alertType,
  onPress,
  // ...other props
}) => {
  return (
    <Marker
      coordinate={{ latitude, longitude }}
      onPress={() => onPress(id)}
    >
      <View style={[styles.markerContainer, getMarkerStyle(alertType)]}>
        <Text style={styles.markerIcon}>
          {alertType === 'theft' ? '⚠️' : alertType === 'robbery' ? '🚨' : '👀'}
        </Text>
      </View>
    </Marker>
  );
};

const getMarkerStyle = (type: string) => {
  switch (type) {
    case 'theft': return { backgroundColor: '#FF6B6B' };
    case 'robbery': return { backgroundColor: '#FF4757' };
    case 'suspicious': return { backgroundColor: '#FFA502' };
    default: return { backgroundColor: '#3742FA' };
  }
};

const styles = StyleSheet.create({
  markerContainer: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5,
  },
  markerIcon: { fontSize: 16 },
});

export default CustomMarker;
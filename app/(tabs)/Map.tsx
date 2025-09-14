import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
export default function MapScreen() {
  const [region, setRegion] = useState({
    latitude: 24.8607,
    longitude: 67.0011, // Karachi coordinates
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();    
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }   
      let location = await Location.getCurrentPositionAsync({});
      setRegion({
        ...region,    
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);  
  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={setRegion}
      >
        <Marker
          coordinate={{
            latitude: region.latitude,
            longitude: region.longitude,
          }}
          title="Current Location"
          description="You are here"
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
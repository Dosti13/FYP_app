// screens/MapScreen.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import RestrictedAreaMap from "../../components/map/heatMap";

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <RestrictedAreaMap />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});

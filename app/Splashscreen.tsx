// screens/SplashScreen.tsx
import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator,Image } from "react-native";
import { useRouter } from "expo-router";
export default function SplashScreen() {
  const router = useRouter();




  return (
    <View style={styles.container}>
         <Image
                  source={require('../assets/images/Map-Marker.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />
      <Text style={styles.title}>SnatchAlert</Text>
      <ActivityIndicator size="large" color="green" style={{ marginTop: 20 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "green",
  },
    logo: {
    width: 120,
    height: 120,
  },
});

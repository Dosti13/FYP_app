// screens/SplashScreen.tsx
import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator,Image } from "react-native";
import { useRouter } from "expo-router";
import { Logo } from "@/components/common/logo";
export default function SplashScreen() {
  const router = useRouter();


  

  return (
    <View style={styles.container}>
       <Logo title="Snatch ALert "/>

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
  
  
});

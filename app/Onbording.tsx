// app/index.tsx
import { Image } from "expo-image";
import React from "react";
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
export default function Onbording() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/images/karachimap.png")}
        style={styles.imageBackground}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.content}>
            <View style={styles.logoContainer}>
             <Image
                       source={require('../assets/images/Map-Marker.png')}
                       style={styles.logo}
                        resizeMode="contain"        
                     />
              <Text style={styles.title}>Snatch Alert</Text>
              <Text style={styles.subtitle}>To report the street crime</Text>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => router.navigate("/Signin")}
              >
                <Text style={styles.buttonText}>Log in or sign up</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button}
                onPress={() => router.navigate("/Signup")}
              >
                <Text style={styles.buttonText}>Complete signup</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.footer}>
            © 2025 SnatchAlert   Terms   Help & support
          </Text>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  imageBackground: {
    width: '100%',
    height: '100%',
    backgroundPosition: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: "space-between",
    alignItems: "center",
  },
    logo: {
    width: 120,
    height: 120,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: '100%',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  icon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#2ecc71",
    justifyContent: "center",
    alignItems: "center",
  },
  check: {
    fontSize: 32,
    color: "white",
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  subtitle: {
    color: "#ccc",
    fontSize: 14,
    marginTop: 5,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
  },
  button: {
    backgroundColor: "#2ecc71",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    color: "#aaa",
    fontSize: 12,
    marginBottom: 15,
    textAlign: 'center',
  },
});

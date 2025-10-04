// app/index.tsx
import React from "react";
import { ImageBackground, StyleSheet, Text,  View } from "react-native";
import { useRouter } from "expo-router";
import { Logo } from "@/components/common/logo";
import { Button } from "@/components/common/Button";
export default function Onbording() {
  const router = useRouter();
  console.log("onbaording ");
  
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/images/karachimap.png")}
        style={styles.imageBackground}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.content}>
        <Logo  title="Snatch ALert "/>
            <View style={styles.buttonContainer}>
              <Button
                style={styles.button}
                onPress={() => router.navigate("/Signin")}
                title="Login"                     
                />

                <Button
                style={styles.button}
                onPress={() => router.navigate("/Signup")}
                title="Comlete Signup"                     
                />
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

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: '100%',
    paddingHorizontal: 20,
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

  footer: {
    color: "#aaa",
    fontSize: 12,
    marginBottom: 15,
    textAlign: 'center',
  },
});

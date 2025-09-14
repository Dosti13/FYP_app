import { SafeAreaView, StatusBar } from "react-native";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import SplashScreen from "./Splashscreen";

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <Stack screenOptions={{ headerShown: false}}>
        {isFirstLaunch ? (
          <Stack.Screen name="Onbording" options={{ headerShown: false }} />
        ) : isLoggedIn ? (
          <Stack.Screen name="(tabs)" options={{ title: "Dashboard" }} />
        ) : (
          <Stack.Screen name="(auth)" options={{ title: "Login" }} />
        )}
      </Stack>
    </SafeAreaView>
  );
}

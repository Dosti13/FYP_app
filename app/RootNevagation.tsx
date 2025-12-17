
import { useAuth } from "@clerk/clerk-expo";
import {  StatusBar ,View ,SafeAreaView} from "react-native";
import { Stack } from "expo-router";
import { useEffect, useState  } from "react";
import SplashScreen from "./Splashscreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthContext } from "@/hooks/socialcontext";
import { restrictedAreaWatcher } from "../services/background/restrictedAreaWatcher";

export default function RootNavigation() {
  const { isSignedIn,loading } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  useEffect(() => {
    // Start background watcher when app loads
    restrictedAreaWatcher.startWatching();

    return () => {
      restrictedAreaWatcher.stopWatching();
    };
  }, []);
  // Splash timeout
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // First launch check
  useEffect(() => {
    AsyncStorage.getItem("alreadyLaunched").then((value) => {
      if (value === null) {
        AsyncStorage.setItem("alreadyLaunched", "true");
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    });
  }, []);

  if (isLoading || loading || isFirstLaunch === null) {
    return <SplashScreen />
  }
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <Stack screenOptions={{ headerShown: false }}>
        {isFirstLaunch ? (
          <Stack.Screen name="Onbording" />
        ) : isSignedIn ? (
          <Stack.Screen name="(tabs)" />
        ) : (
          <Stack.Screen name="(auth)/Signin" />
        )}
      </Stack>
    </SafeAreaView>
  );
}
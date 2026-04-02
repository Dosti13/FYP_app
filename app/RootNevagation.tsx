import { useAuthContext } from "@/hooks/socialcontext";
import { authService } from "@/services";
import { refreshHeatmap } from "@/services/background/heatmapCache";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView, StatusBar } from "react-native";
import { restrictedAreaWatcher } from "../services/background/restrictedAreaWatcher";
import SplashScreen from "./Splashscreen";

export default function RootNavigation() {
  const { isSignedIn, loading: socialLoading } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  // Check authentication status
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setAuthChecking(true);

      try {
        // Check if user is authenticated via email/password
        const isAuth = await authService.isAuthenticated();

        if (isAuth) {
          try {
            // Try to get user profile
            const user = await authService.getCurrentUser();
            if (user) {
              setIsAuthenticated(true);
              return;
            }
          } catch (e) {
            console.warn("Failed to get current user:", e);
          }
        }
      } catch (e) {
        console.warn("isAuthenticated check failed:", e);
      }

      // Check if user is authenticated via social login
      if (isSignedIn) {
        console.log("User authenticated via social login");
        setIsAuthenticated(true);
        return;
      }

      // No authentication found
      console.log("User not authenticated");
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Auth check error:", error);
      setIsAuthenticated(false);
    } finally {
      setAuthChecking(false);
    }
  };

  // Start background watcher
  useEffect(() => {
    const init = async () => {
      try {
        await refreshHeatmap("Karachi"); // MUST run first
      } catch (e) {
        console.warn("Heatmap refresh failed:", e);
      }

      try {
        await restrictedAreaWatcher.startWatching();
      } catch (e) {
        console.warn("Restricted area watcher failed:", e);
      }
    };

    init();
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

  // Listen for auth state changes
  useEffect(() => {
    if (isSignedIn) {
      setIsAuthenticated(true);
    }
  }, [isSignedIn]);

  // Show splash while checking
  if (isLoading || authChecking || socialLoading || isFirstLaunch === null) {
    return <SplashScreen />;
  }

  console.log("Navigation State:", {
    isFirstLaunch,
    isAuthenticated,
    isSignedIn,
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <Stack screenOptions={{ headerShown: false }}>
        {isFirstLaunch ? (
          <Stack.Screen name="Onbording" />
        ) : isAuthenticated ? (
          <Stack.Screen name="(tabs)" />
        ) : (
          <Stack.Screen name="(auth)/Signin" />
        )}
      </Stack>
    </SafeAreaView>
  );
}

import { StatusBar, SafeAreaView } from "react-native";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import SplashScreen from "./Splashscreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthContext } from "@/hooks/socialcontext";
import { restrictedAreaWatcher } from "../services/background/restrictedAreaWatcher";
import { authService, notificationService } from "@/services";
import { refreshHeatmap } from "@/services/background/heatmapCache";

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
      
      // Check if user is authenticated via email/password
      const isAuth = await authService.isAuthenticated();
      
      if (isAuth) {
        // Try to get user profile
        const user = await authService.getCurrentUser();
        if (user) {
          console.log('User authenticated via email:', user.email);
          setIsAuthenticated(true);
          return;
        }
      }
      
      // Check if user is authenticated via social login
      if (isSignedIn) {
        console.log('User authenticated via social login');
        setIsAuthenticated(true);
        return;
      }
      
      // No authentication found
      console.log('User not authenticated');
      setIsAuthenticated(false);
      
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
    } finally {
      setAuthChecking(false);
    }
  };

  // Start background watcher
useEffect(() => {
    const init = async () => {
      await refreshHeatmap("Karachi"); // MUST run first
      await restrictedAreaWatcher.startWatching();
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

  console.log('Navigation State:', {
    isFirstLaunch,
    isAuthenticated,
    isSignedIn,
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
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
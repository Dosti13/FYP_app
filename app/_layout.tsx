// app/_layout.tsx
import { NotificationProvider } from "@/hooks/Notificationcontext";
import { AuthProvider } from "@/hooks/socialcontext";
import { ClerkProvider } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import RootNavigation from "./RootNevagation";

// Secure storage for Clerk tokens
WebBrowser.maybeCompleteAuthSession();
const tokenCache = {
  getToken: (key: string) => SecureStore.getItemAsync(key),
  saveToken: (key: string, value: string) =>
    SecureStore.setItemAsync(key, value),
};
const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Allow time for environment variables to load
    setTimeout(() => {
      setIsReady(true);
    }, 500);
  }, []);

  if (!isReady) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#000",
        }}
      >
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!CLERK_PUBLISHABLE_KEY) {
    console.warn("⚠️ CLERK_PUBLISHABLE_KEY not found in environment variables");
  }

  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY || ""}
      tokenCache={tokenCache}
    >
      <NotificationProvider>
        <AuthProvider>
          <RootNavigation />
        </AuthProvider>
      </NotificationProvider>
    </ClerkProvider>
  );
}

// ✅ Handles auth, splash, and onboarding

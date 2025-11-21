// app/_layout.tsx
import * as WebBrowser from "expo-web-browser";
import { ClerkProvider } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import RootNavigation from "./RootNevagation";
import { AuthProvider } from "@/hooks/socialcontext";
// Secure storage for Clerk tokens
WebBrowser.maybeCompleteAuthSession();
const tokenCache = {
  getToken: (key: string) => SecureStore.getItemAsync(key),
  saveToken: (key: string, value: string) => SecureStore.setItemAsync(key, value),
};
const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY

export default function RootLayout() {
  console.log("root layout");
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
      <AuthProvider>
          <RootNavigation />
      </AuthProvider>
    </ClerkProvider>
  );
}

// ✅ Handles auth, splash, and onboarding


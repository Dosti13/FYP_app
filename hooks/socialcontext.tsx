import * as React from "react";
import * as WebBrowser from "expo-web-browser";
WebBrowser.maybeCompleteAuthSession();
import { useAuth, useSignUp, useClerk, useOAuth } from "@clerk/clerk-expo";

// Required for OAuth to work properly

type AuthContextType = {
  isSignedIn: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const [loading, setLoading] = React.useState(false);

  // Use OAuth hooks for each provider
  const { startOAuthFlow: startGoogleOAuth } = useOAuth({ strategy: "oauth_google" });
  const { startOAuthFlow: startFacebookOAuth } = useOAuth({ strategy: "oauth_facebook" });

  const signInWithGoogle = React.useCallback(async () => {
    try {
      setLoading(true);
      const { createdSessionId, setActive } = await startGoogleOAuth();

      if (createdSessionId) {
        await setActive?.({ session: createdSessionId });
      }
    } catch (error) {
      console.error("Google login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [startGoogleOAuth]);

  const signInWithFacebook = React.useCallback(async () => {
    try {
      setLoading(true);
      const { createdSessionId, setActive } = await startFacebookOAuth();

      if (createdSessionId) {
        await setActive?.({ session: createdSessionId });
      }
    } catch (error) {
      console.error("Facebook login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [startFacebookOAuth]);

  const handleSignOut = React.useCallback(async () => {
    try {
      setLoading(true);
      await signOut();
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [signOut]);

  const value = React.useMemo(
    () => ({
      isSignedIn: !!isSignedIn,
      loading,
      signInWithGoogle,
      signInWithFacebook,
      signOut: handleSignOut,
    }),
    [isSignedIn, loading, signInWithGoogle, signInWithFacebook, handleSignOut]
  );

  return React.createElement(
    AuthContext.Provider,
    { value },
    children
  );
}

export function useAuthContext() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
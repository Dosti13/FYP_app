import { useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function OAuthCallback() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (isLoaded) {
      console.log("OAuth callback - Auth loaded, isSignedIn:", isSignedIn);
      
      if (isSignedIn) {
        // Redirect to your main authenticated screen
        // Adjust this path based on your app structure
        router.replace('/Dashboard'); // or '/' or '/home' depending on your routes
      } else {
        // If not signed in, go back to login
        router.replace('/(auth)/Signin'); // or wherever your login screen is
      }
    }
  }, [isLoaded, isSignedIn, router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={styles.text}>Completing sign in...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: '#333',
  },
});

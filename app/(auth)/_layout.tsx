import { Stack } from 'expo-router';
import { View, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AuthLayout() {
  const insets = useSafeAreaInsets();
  console.log("authloyout");
  
  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" translucent={true} />
      {/* Status bar background */}
      <View 
        style={{ 
          height: insets.top, 
          backgroundColor: '#ffffff' 
        }} 
      />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Signin" />
        <Stack.Screen name="Signup" />
        <Stack.Screen name="emailverification" />
        <Stack.Screen name="forgot-password" />
      </Stack>
    </View>
  );
}
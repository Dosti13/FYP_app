
import { Alert } from 'react-native';
import * as Location from 'expo-location';

export async function requestLocationPermission(): Promise<boolean> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Location Permission',
        'This app needs location access to help you report incidents at your current location.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Settings', 
            onPress: () => {
              // Open app settings - implementation varies by platform
            }
          }
        ]
      );
      return false;
    }
    
    return true;
  } catch (error) {
    console.log('Error requesting location permission:', error);
    return false;
  }
}

export function showPermissionAlert(permissionType: string) {
  Alert.alert(
    `${permissionType} Permission Required`,
    `Please grant ${permissionType.toLowerCase()} permission in your device settings to use this feature.`,
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Settings', onPress: () => {
        // Implementation to open settings varies by platform
      }}
    ]
  );
}
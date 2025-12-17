// SocialLoginButtons.tsx
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SocialButtonProps {
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

// Google Sign In Button
export function GoogleSignInButton({ 
  onPress, 
  loading = false, 
  disabled = false,
  style 
}: SocialButtonProps) {
  
  return (
    <TouchableOpacity
      style={[styles.button, styles.googleButton, disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color="#fff" size="small" />
      ) : (
        <>
          <View style={styles.iconContainer}>
            <Ionicons name="logo-google" size={20} color="#fff" />
          </View>
          <Text style={styles.buttonText}>Continue with Google</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

// Facebook Sign In Button
export function FacebookSignInButton({ 
  onPress, 
  loading = false, 
  disabled = false,
  style 
}: SocialButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, styles.facebookButton, disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color="#fff" size="small" />
      ) : (
        <>
          <View style={styles.iconContainer}>
            <Ionicons name="logo-facebook" size={20} color="#fff" />
          </View>
          <Text style={styles.buttonText}>Continue with Facebook</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

// Apple Sign In Button (iOS)
export function AppleSignInButton({ 
  onPress, 
  loading = false, 
  disabled = false,
  style 
}: SocialButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, styles.appleButton, disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color="#fff" size="small" />
      ) : (
        <>
          <View style={styles.iconContainer}>
            <Ionicons name="logo-apple" size={20} color="#fff" />
          </View>
          <Text style={styles.buttonText}>Continue with Apple</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

// Combined Social Login Buttons Component
interface SocialLoginButtonsProps {
  onGooglePress: () => void;
  onFacebookPress: () => void;
  onApplePress?: () => void;
  loading?: boolean;
  showDivider?: boolean;
  containerStyle?: ViewStyle;
}

export function SocialLoginButtons({
  onGooglePress,
  onFacebookPress,
  onApplePress,
  loading = false,
  showDivider = true,
  containerStyle,
}: SocialLoginButtonsProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      {showDivider && (
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>
      )}

      <GoogleSignInButton 
        onPress={onGooglePress} 
        loading={loading} 
        style={styles.socialButton}
      />

      <FacebookSignInButton 
        onPress={onFacebookPress} 
        loading={loading}
        style={styles.socialButton}
      />

      {onApplePress && (
        <AppleSignInButton 
          onPress={onApplePress} 
          loading={loading}
          style={styles.socialButton}
        />
      )}
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    width: '70%',
    alignSelf: 'center',    
   
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    minHeight: 50,
  },
  googleButton: {
    backgroundColor: '#4285F4',
  },
  facebookButton: {
    backgroundColor: '#1877F2',
  },
  appleButton: {
    backgroundColor: '#000000',
  },
  disabled: {
    opacity: 0.6,
  },
  iconContainer: {
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  socialButton: {
    marginBottom: 12,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },

  
});
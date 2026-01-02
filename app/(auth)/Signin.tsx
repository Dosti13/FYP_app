// SignIn.tsx - Updated with Social Login Components
import { useRouter } from 'expo-router';
import { useEffect, useState ,useCallback} from 'react';
import { AuthValidationService } from '../../services/auth/AuthValidationService';
import { Input } from '@/components/common/Input';
import { useAuthContext } from '@/hooks/socialcontext';
import { authStyles } from './authStyles';
import { Logo } from '@/components/common/logo';
import { authService } from '@/services';
import {
  Alert,
  SafeAreaView,
 ActivityIndicator,
  
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button } from '@/components/common/Button';
import { SocialLoginButtons } from '@/components/common/SocialLoginButtons';
import { Ionicons } from '@expo/vector-icons';

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
   const [generalError, setGeneralError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const { signInWithGoogle, signInWithFacebook, loading, isSignedIn } = useAuthContext();
  // Auto-navigate when signed in
  useEffect(() => {
    if (isSignedIn) {
      router.replace('/Dashboard'); 
    }
  }, [isSignedIn]);
useEffect(() => {
    if (generalError) {
      setGeneralError('');
    }
  }, [email, password]);
  const handleSignInWithGoogle = async () => {
    try {
      await signInWithGoogle();
      // Navigation handled by useEffect above
    } catch (err) {
      console.error("Google login error:", err);
      Alert.alert('Login Failed', 'Could not sign in with Google. Please try again.');
    }
  };

  const handleSignInWithFacebook = async () => {
    try {
      await signInWithFacebook();
      // Navigation handled by useEffect above
    } catch (err) {
      console.error("Facebook login error:", err);
      Alert.alert('Login Failed', 'Could not sign in with Facebook. Please try again.');
    }
  };

  const handleSignIn = useCallback(async () => {
    // Mark all fields as touched
    setTouched({
      email: true,
      password: true,
    });

    // Clear previous errors
    setGeneralError('');

    // Validate inputs
    const loginErrors = AuthValidationService.validateLogin(email, password);

    if (Object.keys(loginErrors).length > 0) {
      setEmailError(loginErrors.email || '');
      setPasswordError(loginErrors.password || '');
      return;
    }

    setIsLoading(true);

    try {
      console.log('🔐 Attempting login with email:', email);

      // Login with email/password
      const { user, tokens } = await authService.login({
        email:  email.trim().toLowerCase(),
        password,
      });

      console.log('✅ Login successful:', {
        userId: user.id,
        email: user.email,
      
      });

      // Navigate to dashboard
      router.replace('/Dashboard');
    } catch (error: any) {
      console.error('❌ Login error:', error);

      // Parse and display user-friendly error
      let errorMessage = 'An error occurred during login. Please try again.';

      if (error.message) {
        const msg = error.message.toLowerCase();
        
        if (msg.includes('invalid') || msg.includes('incorrect') || msg.includes('wrong credentials')) {
          errorMessage = 'Invalid email or password. Please check your credentials and try again.';
        } else if (msg.includes('no active account') || msg.includes('not found')) {
          errorMessage = 'No account found with this email. Please sign up first.';
        } else if (msg.includes('network') || msg.includes('connection') || msg.includes('fetch')) {
          errorMessage = 'Network error. Please check your internet connection and try again.';
        } else if (msg.includes('blocked') || msg.includes('suspended') || msg.includes('disabled')) {
          errorMessage = 'Your account has been suspended. Please contact support.';
        } else if (msg.includes('verify') || msg.includes('verification') || msg.includes('not verified')) {
          errorMessage = 'Please verify your email before logging in. Check your inbox.';
        } else if (msg.includes('timeout')) {
          errorMessage = 'Request timeout. Please try again.';
        } else if (msg.includes('unauthorized') || msg.includes('401')) {
          errorMessage = 'Invalid credentials. Please check your email and password.';
        } else {
          errorMessage = error.message;
        }
      }

      setGeneralError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [email, password, router]);
  useEffect(() => {
    const errors = AuthValidationService.validateLogin(email, password);
    if (touched.email) setEmailError(errors.email || "");
    if (touched.password) setPasswordError(errors.password || "");
  }, [password, email, touched]);
  
  return (
    <SafeAreaView style={authStyles.container}>
    <Logo title="Welcome Back" />
       {generalError ? (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle" size={20} color="#FF3B30" />
                <Text style={styles.errorBannerText}>{generalError}</Text>
                <TouchableOpacity 
                  onPress={() => setGeneralError('')}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={18} color="#D32F2F" />
                </TouchableOpacity>
              </View>
            ) : null}
      <View style={authStyles.formContainer}>
        <Input
          style={authStyles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          containerStyle={{ marginBottom: -10 }}
          onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
          error={emailError}
        />
        <Input
          style={authStyles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          containerStyle={{ marginBottom: 20 }}
          onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
          error={passwordError}
        />

     <Button
              title={isLoading ? 'Signing In...' : 'Sign In'}
              onPress={handleSignIn}
              style={authStyles.buttonSpacing}
              disabled={isLoading}/>
 {isLoading && (
                <ActivityIndicator
                  color="white"
                  style={{ marginRight: 8 }}
                  size="small"
                />
              )}
            
          <TouchableOpacity onPress={() => router.navigate('/(auth)/forgot-password')}>
              <Text style={authStyles.forgotlink}>Forgot your password ? </Text>
            </TouchableOpacity>
       

       
        <SocialLoginButtons
          onGooglePress={handleSignInWithGoogle}
          onFacebookPress={handleSignInWithFacebook}
          loading={loading}
          showDivider={true}
        />



        <View style={authStyles.authLinkContainer }>
          <Text style={authStyles.authLinkText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.navigate('/Signup')}>
            <Text style={authStyles.authLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = {
  errorBanner: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
  },
  errorBannerText: {
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
    fontSize: 14,
    color: '#D32F2F',
    lineHeight: 20,
  },
  closeButton: {
    padding: 4,
  },
};
// SignIn.tsx - Updated with Social Login Components
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { AuthValidationService } from '../../services/auth/AuthValidationService';
import { Input } from '@/components/common/Input';
import { useAuthContext } from '@/hooks/socialcontext';
import { authStyles } from './authStyles';
import { Logo } from '@/components/common/logo';
import { authService } from '@/services';
import {
  Alert,
  SafeAreaView,
 
  
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button } from '@/components/common/Button';
import { SocialLoginButtons } from '@/components/common/SocialLoginButtons';

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
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

  const handleSignIn = () => {
    setTouched({
      email: true,
      password: true,
    });

    const loginErrors = AuthValidationService.validateLogin(email, password);

    if (Object.keys(loginErrors).length > 0) {
      Alert.alert('Validation Error', 'All fields are required');
      return;
    }
    authService.login({
      email,
      password,
    }).then(({ user, tokens }) => {
      console.log('User logged in:', user);
      console.log('Auth tokens:', tokens);
      Alert.alert('Login Successful', 'Welcome back!');
       router.replace("/Dashboard");
    }).catch((error) => {
      console.error('Login error:', error);
      Alert.alert('Login Failed', error.message || 'An error occurred during login. Please try again.');
    })
    console.log('Signing in with:', email, password);
  };

  useEffect(() => {
    const errors = AuthValidationService.validateLogin(email, password);
    if (touched.email) setEmailError(errors.email || "");
    if (touched.password) setPasswordError(errors.password || "");
  }, [password, email, touched]);
  
  return (
    <SafeAreaView style={authStyles.container}>
    <Logo title="Welcome Back" />

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
          title="Sign In"
          onPress={handleSignIn}
          style={authStyles.buttonSpacing}
          disabled={loading}
        />
 
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


import { useRouter } from 'expo-router';
import { use, useEffect, useState } from 'react';
import {AuthValidationService} from '../../services/auth/AuthValidationService';
import { SocialLoginButtons } from '@/components/common/SocialLoginButtons';
import { useAuthContext } from '@/hooks/socialcontext';
import {
  Alert,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {Input}  from '../../components/common/Input';
import { Button } from '@/components/common/Button';
import { Logo } from '@/components/common/logo';
import { authStyles } from './authStyles';
export default function SignUp() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
   const [passwordError, setPasswordError] = useState('');
     const [emaiError, setEmailError] = useState('');
     const [usernameError, setUsernameError] = useState('');
     const [cnfrmpaassError, setCnfrmPassError] = useState('');
     const [touched, setTouched] = useState({
  fullName: false,
  email: false,
  password: false,
  confirmPassword: false,
});
  const router = useRouter();
    const { signInWithGoogle, signInWithFacebook, loading, isSignedIn } = useAuthContext();

 const handleSignUp = () => {
       setTouched({
            fullName: true,
            email: true,
            password: true,
            confirmPassword: true,
        });
  const signupErrors = AuthValidationService.validateSignup(fullName, email, password, confirmPassword);
  if (Object.keys(signupErrors).length > 0) {
    Alert.alert("all fields are required");
    return;
  }
  console.log('Signing up with:', { fullName, email, password });
  router.replace("/Dashboard");
};

useEffect(() => { 
  const errors = AuthValidationService.validateSignup(fullName, email, password, confirmPassword);
  if (touched.fullName) setUsernameError(errors.username || "");
  if (touched.email) setEmailError(errors.email || "");
  if (touched.password) setPasswordError(errors.password || "");
  if (touched.confirmPassword) setCnfrmPassError(errors.confirm || "");
}, [password, email, fullName, confirmPassword, touched]);

  useEffect(() => {
    if (isSignedIn) {
      router.replace('/Dashboard'); // Redirect to dashboard or main app screen
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
  console.log("SignUp")
  return (
    <SafeAreaView style={authStyles.container}>
    <KeyboardAwareScrollView
   showsVerticalScrollIndicator={false}
        extraScrollHeight={40}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 30 }}
  // adjust as needed
  >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Logo title="Create Account" />

        <View style={authStyles.formContainer}>
          <Input
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"   
            onBlur={() => setTouched(prev => ({ ...prev, fullName: true }))}
            error={usernameError}
            containerStyle={{ marginBottom: -10}}
          />
          <Input
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
            error={emaiError}
            style={{ marginBottom: -10}}
          />
         
          <Input
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
            error={passwordError}
            containerStyle={{ marginBottom: -10 }}
          />
          <Input
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            onBlur={() => setTouched(prev => ({ ...prev, confirmPassword: true }))}
            error={cnfrmpaassError}
            containerStyle={{ marginBottom: 20 }}
          />
          <Button 
            title="Sign Up"
            onPress={handleSignUp}
            style={authStyles.buttonSpacing}
          />
          <SocialLoginButtons
          onGooglePress={handleSignInWithGoogle}
          onFacebookPress={handleSignInWithFacebook}
          loading={loading}
          showDivider={true}
        />
          <View style={authStyles.authLinkContainer}>
            <Text style={authStyles.linkText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.navigate('/Signin')}>
              <Text style={authStyles.authLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
        </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}


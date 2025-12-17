import { useRouter } from 'expo-router';
import {  useEffect, useState } from 'react';
import {AuthValidationService} from '../../services/auth/AuthValidationService';
import { SocialLoginButtons } from '@/components/common/SocialLoginButtons';
import { useAuthContext } from '@/hooks/socialcontext';
import { authService } from '@/services';
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
  const [fisrtname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
   const [passwordError, setPasswordError] = useState('');
     const [emaiError, setEmailError] = useState('');

     const [usernameError, setUsernameError] = useState('');
     const [cnfrmpaassError, setCnfrmPassError] = useState('');
     const [phoneno, setPhoneno] = useState('');
     const [phonenoError, setPhonenoError] = useState('');
     const [touched, setTouched] = useState({
  fisrtname: false,
  lastname: false,
  email: false,
  phoneno: false,
  password: false,
  confirmPassword: false,
});
  const router = useRouter();
    const { signInWithGoogle, signInWithFacebook, loading, isSignedIn } = useAuthContext();
    
 const handleSignUp = () => {
       setTouched({
            fisrtname: true,
            lastname: true,
            email: true,
            phoneno: true,
            password: true,
            confirmPassword: true,
        });
  const signupErrors = AuthValidationService.validateSignup(fisrtname,lastname, email,phoneno, password, confirmPassword);
  if (Object.keys(signupErrors).length > 0) {
   Alert.alert("Validation Error", "Please fix the highlighted errors.");
    return;
  }
 authService.register({
  first_name: fisrtname,   
  last_name: lastname,
    email,
    phone : phoneno,
    password,
    password2: confirmPassword, 
  }).then(({ user, tokens }) => {
    console.log('User registered:', user);
    console.log('Auth tokens:', tokens);
    Alert.alert('Registration Successful', 'You can now log in with your credentials.');
     router.replace("/Dashboard");
  }).catch((error) => {
    console.error('Registration error:', error);
    Alert.alert('Registration Failed', error.message || 'An error occurred during registration. Please try again.');
  })
  console.log('Signing up with:', { fisrtname,lastname, email, password });
};

useEffect(() => { 
  const errors = AuthValidationService.validateSignup(fisrtname,lastname , email,phoneno, password, confirmPassword);
  if (touched.fisrtname) setUsernameError(errors.username || "");
  if (touched.lastname) setUsernameError(errors.username || "");
  if (touched.phoneno) setPhonenoError(errors.phone || "");
  if (touched.email) setEmailError(errors.email || "");
  if (touched.password) setPasswordError(errors.password || "");
  if (touched.confirmPassword) setCnfrmPassError(errors.confirm || "");
}, [password, email, fisrtname,lastname,phoneno, confirmPassword, touched]);

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
            placeholder="First Name"
            value={fisrtname}
            onChangeText={setFirstname}
            autoCapitalize="words"   
            onBlur={() => setTouched(prev => ({ ...prev, fisrtname: true }))}
            error={usernameError}
            containerStyle={{ marginBottom: -10}}
          />
          <Input
            placeholder="Last Name"
            value={lastname}
            onChangeText={ setLastname}
            autoCapitalize="words"   
            onBlur={() => setTouched(prev => ({ ...prev, lastname: true }))}
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
            placeholder="Phone Number"
            value={phoneno}
            onChangeText={setPhoneno}
            keyboardType="phone-pad"
            autoCapitalize="none"
            onBlur={() => setTouched(prev => ({ ...prev, phoneno: true }))}
            error={phonenoError}
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



import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {AuthValidationService} from '../../services/auth/AuthValidationService';
import {
  Alert,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
// import InputText from '../../components/InputText';
import {Input}  from '../../components/common/Input';
import { Button } from '@/components/common/Button';
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
  return (
    <SafeAreaView style={styles.container}>
         <KeyboardAvoidingView 
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/Map-Marker.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Create Account</Text>
        </View>

        <View style={styles.formContainer}>
          <Input
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"   
            onBlur={() => setTouched(prev => ({ ...prev, fullName: true }))}
            error={usernameError}
            containerStyle={{ marginBottom: 0}}
          />
          <Input
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
            error={emaiError}
            style={{ marginBottom: 0}}
          />
         
          <Input
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
            error={passwordError}
            containerStyle={{ marginBottom: 0 }}
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
            style={styles.buttonSpacing}
          />

          <View style={styles.signinContainer}>
            <Text style={styles.signinText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.navigate('/Signin')}>
              <Text style={styles.signinLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
        </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
  },
  input:{
marginBottom:2
  },
  title: {
    fontSize: 24,
    fontFamily: 'DMBold',
    marginTop: 10,
    color: '#333',
  },
  formContainer: {
    padding: 20,
  },
  button: {
    backgroundColor: '#FF4B4B',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonSpacing: {
    marginTop: 10,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'DMBold',
  },
  signinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signinText: {
    color: '#666',
    fontSize: 14,
    fontFamily: 'DMRegular',
  },
  signinLink: {
    color: '#7eff4bff',
    fontSize: 14,
    fontFamily: 'DMBold',
  },
});
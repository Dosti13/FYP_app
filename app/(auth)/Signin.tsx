import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {AuthValidationService} from '../../services/auth/AuthValidationService';  
import { Input } from '@/components/common/Input';
import {
  Alert,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Button } from '@/components/common/Button';

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
   const [passwordError, setPasswordError] = useState('');
     const [emaiError, setEmailError] = useState('');
    const [touched, setTouched] = useState({
  email: false,
  password: false,
});
  const handleSignIn = () => {
    // Add your authentication logic here
    setTouched({
            email: true,
            password: true,
        });
    const loginErrors = AuthValidationService.validateLogin(email, password);
    
    if (Object.keys(loginErrors).length > 0) {
      Alert.alert('Validation Error , All fields are required');
      return;
    }
    console.log('Signing in with:', email, password);
    router.navigate('/Dashboard');
  };
  useEffect(() => { 
  const errors = AuthValidationService.validateLogin(email, password);
  if (touched.email) setEmailError(errors.email || "");
  if (touched.password) setPasswordError(errors.password || "");
}, [password, email,  touched]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/Map-Marker.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>SnatchAlert</Text>
      </View>

      <View style={styles.formContainer}>
        <Input
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          containerStyle={{ marginBottom: -10 }}
          onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
          error={emaiError}
        />
        <Input
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          containerStyle={{ marginBottom: 10 }}
          onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
          error={passwordError}
        />
   

        <Button 
          title="Sign In"
          onPress={handleSignIn}
          style={styles.buttonSpacing}
        />

        <TouchableOpacity 
          style={styles.forgotPassword}
          onPress={() => router.navigate('/forgot-password')}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.navigate('/Signup')}>
            <Text style={styles.signupLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    marginTop: 60,
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
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
  input: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    fontFamily: 'DMRegular',
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
  forgotPassword: {
    alignItems: 'center',
    marginTop: 15,
  },
  forgotPasswordText: {
    color: '#666',
    fontSize: 14,
    fontFamily: 'DMRegular',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signupText: {
    color: '#666',
    fontSize: 14,
    fontFamily: 'DMRegular',
  },
  signupLink: {
    color: '#7eff4bff',
    fontSize: 14,
    fontFamily: 'DMBold',
  },
});
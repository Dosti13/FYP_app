import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { Button } from '@/components/common/Button';
export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleResetPassword = () => {
    // Add password reset logic here
    console.log('Password reset requested for:', email);
    // Show success message and navigate back
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/Map-Marker.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Reset Password</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.description}>
          Enter your email address and we'll send you instructions to reset your password.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Button
          title="Reset Password"
          onPress={handleResetPassword}
          style={styles.buttonSpacing}
        />

        <Button
          title="Back to Sign In"
          onPress={() => router.back()}
          style={[styles.buttonSpacing, styles.secondaryButton]}
        />
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
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 24,
    fontFamily: 'DMBold',
    marginTop: 10,
    color: '#333',
  },
  description: {
    fontSize: 16,
    fontFamily: 'DMRegular',
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
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
  buttonSpacing: {
    marginTop: 10,
    width: '100%',
  },
  secondaryButton: {
    backgroundColor: '#d65d5dff',
  },
});
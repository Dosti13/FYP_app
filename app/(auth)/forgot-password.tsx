import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
    SafeAreaView,
    Text,
   
    View,
} from 'react-native';
import { Logo } from '@/components/common/logo';
import { Button } from '@/components/common/Button';
import { authStyles } from './authStyles';
import { Input } from '../../components/common/Input';
import { authService } from '@/services';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setLoading] = useState(false);
  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email.');
      return;
    }

    try {
      setLoading(true);
      await authService.forgotPassword(email);
      Alert.alert(
        'Success',
        'Password reset email sent! Please check your inbox.'
      );
      router.push('/Signin'); // Navigate to login page
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={authStyles.container}>
      <Logo title="Forgot Password" />

      <View style={authStyles.formContainer}>
        <Text style={authStyles.description}>
          Enter your email address and we'll send you instructions to reset your password.
        </Text>

        <Input
          style={authStyles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Button
          title="Reset Password"
          onPress={handleResetPassword}
          style={authStyles.buttonSpacing}
        />

        <Button
          title="Back to Sign In"
          onPress={() => router.navigate('/Signin')}
          style={[authStyles.buttonSpacing, authStyles.secondaryButton ,authStyles.authLinkContainer  ]}
        />
      </View>
    </SafeAreaView>
  );
}

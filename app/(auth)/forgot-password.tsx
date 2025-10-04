import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    SafeAreaView,
    Text,
   
    View,
} from 'react-native';
import { Logo } from '@/components/common/logo';
import { Button } from '@/components/common/Button';
import { authStyles } from './authStyles';
import { Input } from '../../components/common/Input';
export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleResetPassword = () => {
    // Add password reset logic here
    console.log('Password reset requested for:', email);
    // Show success message and navigate back
    router.navigate('/Signin');
  };
console.log("forgot pass");

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

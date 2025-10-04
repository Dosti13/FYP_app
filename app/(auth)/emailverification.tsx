import React from 'react'
import { View ,Text} from 'react-native'
import { authStyles } from './authStyles'
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Logo } from '@/components/common/logo';
import { SafeAreaView } from 'react-native-safe-area-context';
function Emailverification() {
  const [code, setCode] = React.useState ('');
  const [loading, setLoading] = React.useState(false);
  console.log("emialveri");
  
  return (
    <SafeAreaView  style={authStyles.container}>
      <Logo title="Email Verification" />
    <View  style={authStyles.formContainer}>
        <Input
          style={authStyles.input}
          placeholder="Enter verification code"
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          autoCapitalize="none"
          />
        <Button
          title={ loading ? "Verifying..." : "Verify Email"}
          style={authStyles.buttonSpacing}    
          onPress={() => {setLoading(true); setTimeout(() => setLoading(false), 2000);}}  
        />
        <Button
          title="Resend Code"
          style={[authStyles.buttonSpacing, authStyles.secondaryButton ,authStyles.authLinkContainer  ]}   
          onPress={() => {}}   
        />
    </View>
    </SafeAreaView>
  )
}

export default Emailverification
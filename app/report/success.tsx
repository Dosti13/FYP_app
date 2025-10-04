import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeScreen } from '../../components/common/SafeScreen';
import { Button } from '../../components/common/Button';
import { colors } from '../../constants/theme';

export default function ReportSuccessScreen() {
  console.log("succces");
  
  return (
    <SafeScreen>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons name="checkmark-circle" size={80} color={colors.success} />
          </View>
          
          <Text style={styles.title}>Report Submitted Successfully!</Text>
          <Text style={styles.message}>
            Thank you for helping make our community safer. Your report has been received and will be reviewed by the authorities.
          </Text>
          
          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={24} color={colors.info} />
            <Text style={styles.infoText}>
              You will receive updates on your report via SMS or email if you provided contact information.
            </Text>
          </View>
        </View>
        
        <View style={styles.actions}>
          <Button
            title="View All Reports"
            variant="outline"
            onPress={() => router.navigate('/(tabs)/Reportlist')}
            style={styles.button}
          />
          
          <Button
            title="Back to Home"
            onPress={() => router.navigate('/(tabs)/Dashboard')}
            style={styles.button}
          />
        </View>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: colors.mutedText,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#eff6ff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dbeafe',
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#1e40af',
    marginLeft: 12,
    lineHeight: 20,
  },
  actions: {
    gap: 12,
  },
  button: {
    width: '100%',
  },
});

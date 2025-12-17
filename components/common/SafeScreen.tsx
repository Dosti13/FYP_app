// components/common/SafeScreen.tsx
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../../constants/theme';

interface SafeScreenProps {
  children: React.ReactNode;
}

export function SafeScreen({ children }: SafeScreenProps) {
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function EmergencyNotice() {
  return (
    <View style={styles.container}>
      <Ionicons name="warning" size={20} color="#dc2626" />
      <Text style={styles.text}>
        For immediate emergencies, please call local emergency services directly.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  text: {
    flex: 1,
    fontSize: 14,
    color: '#991b1b',
    marginLeft: 12,
    fontWeight: '500',
  },
});
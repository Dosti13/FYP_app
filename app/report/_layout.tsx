import React from 'react';
import { Stack } from 'expo-router';

export default function ReportLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="add" />
      <Stack.Screen name="success" />
      <Stack.Screen name="[id]" />
    </Stack>
  );
}


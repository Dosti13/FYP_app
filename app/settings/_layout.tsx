import React from 'react';
import { Stack } from 'expo-router';

export default function SettingsLayout() {
  console.log("settings layout");
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HelpSupport" />
      <Stack.Screen name="TermsCondition" />
    </Stack>
  );
}

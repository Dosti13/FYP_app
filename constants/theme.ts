// constants/theme.ts
import { TextStyle } from "react-native";


export const colors = {
  // Primary colors
  primary: '#22c55e',
  primaryDark: '#4CA30D',
  primaryLight: '#86efac',
  
  // Text colors
  text: '#1f2937',
  textLight: '#ffffff',
  mutedText: '#6b7280',
  
  // Background colors
  background: '#f9fafb',
  surface: '#ffffff',
  
  // Border colors
  border: '#e5e7eb',
  borderLight: '#f3f4f6',
  
  // Status colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
};

export const textStyles: { [key: string]: TextStyle } = {
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    textAlign: "center",
  },
  subHeading: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  body: {
    fontSize: 16,
    color: colors.text,
  },
  muted: {
    fontSize: 14,
    color: colors.mutedText,
  },
  button: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textLight,
  },
};

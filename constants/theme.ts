// constants/theme.ts
import { TextStyle } from "react-native";


export const colors = {
  // Primary colors
  primary: '#22c55e',
  primaryDark: '#4CA30D',
  primaryLight: '#86efac',
  inputBackground: '#f3f4f6',
  // Text colors
  text: '#1f2937',
  textLight: '#ffffff',
  mutedText: '#6b7280',
  
  // Background colors
  background: '#f9fafb',
  surface: '#3b82f6',
  secondary: '#3581fcff',
  danger: '#ef4444',
  white: '#ffffff',
  black: '#000000',
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
export const globalStyles ={
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  centered: {
    justifyContent: "center",
    alignItems: "center",
  },

  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    marginBottom: 15,
    backgroundColor: colors.inputBackground,
  },

  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonSecondary: {
    backgroundColor: colors.secondary,
  },

  buttonDanger: {
    backgroundColor: colors.danger,
  },

  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 10,
  },

  header: {
    flexDirection: "row",
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
}
;
// constants/authStyles.ts
import { StyleSheet } from 'react-native';
import { colors } from '../../constants/theme';
// Color palette for auth screens


// Common auth screen styles
export const authStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
  },
  
  scrollContainer: {
    flexGrow: 1,
  },


  


  // Typography
  title: {
    fontSize: 24,
    fontFamily: 'DMBold',
    marginTop: 10,
    color: colors.text,
  },

  description: {
    fontSize: 16,
    fontFamily: 'DMRegular',
    color: colors.mutedText,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
    lineHeight: 24,
  },

  // Form container
  formContainer: {
    padding: 20,
  },

  // Input styles
  input: {
    backgroundColor: colors.inputBackground,
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    fontFamily: 'DMRegular',
    color: colors.text,
  },

  inputContainer: {
    marginBottom: 15,
  },

  inputContainerSmall: {
    marginBottom: -10,
  },

  // Button styles
  button: {
    backgroundColor: colors.error,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },

  buttonSpacing: {
    marginTop: 10,
    width: '100%',
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'DMBold',
  },

  secondaryButton: {
    backgroundColor: colors.surface,
  },

  // Link styles
  linkContainer: {
    alignItems: 'center',
    marginTop: 15,
  },

  linkText: {
    color: colors.mutedText,
    fontSize: 14,
    fontFamily: 'DMRegular',
  },

  // Sign up / Sign in links
  authLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 3,
  },

  authLinkText: {
    color: colors.mutedText,
    fontSize: 14,
    fontFamily: 'DMRegular',
  },

  authLink: {
    color: colors.primary,
    fontSize: 14,
    fontFamily: 'DMBold',
  },

  // Keyboard avoiding
 
});

// Spacing constants
export const authSpacing = {
  xs: 5,
  sm: 10,
  md: 15,
  lg: 20,
  xl: 40,
  xxl: 60,
};

// Font families (if you need to reference them)
export const authFonts = {
  regular: 'DMRegular',
  bold: 'DMBold',
  medium: 'DMMedium',
};

// Border radius values
export const authBorderRadius = {
  sm: 5,
  md: 10,
  lg: 15,
  xl: 20,
  round: 50,
};

// Common input props
export const commonInputProps = {
  autoCorrect: false,
  placeholderTextColor: colors.mutedText,
  style: authStyles.input,
};

// Common button props
export const commonButtonProps = {
  style: authStyles.buttonSpacing,
};
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle,StyleProp } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
style?: StyleProp<ViewStyle>;}
console.log("btn");
export function Button({ 
  title, 
  onPress, 
  variant = 'primary', 
  disabled = false, 
  loading = false,
  icon,
  style 
}: ButtonProps) {
  const getButtonStyle = () => {
    switch (variant) {
      case 'secondary':
        return [styles.button, styles.secondaryButton];
      case 'outline':
        return [styles.button, styles.outlineButton];
      default:
        return [styles.button, styles.primaryButton];
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'secondary':
        return [styles.buttonText, styles.secondaryButtonText];
      case 'outline':
        return [styles.buttonText, styles.outlineButtonText];
      default:
        return [styles.buttonText, styles.primaryButtonText];
    }
  };
    console.log("button render");
    
  return (
    <TouchableOpacity
      style={[
        ...getButtonStyle(),
        disabled && styles.disabledButton,
        style
      ]}
      
      onPress={onPress}
      disabled={disabled || loading}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={20}
          color={variant === 'primary' ? '#fff' : colors.primary}
          style={{ marginRight: 8 }}
        />
      )}
      <Text style={getTextStyle()}>
        {loading ? 'Loading...' : title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: '#f3f4f6',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  disabledButton: {
    backgroundColor: colors.mutedText,
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButtonText: {
    color: '#fff',
  },
  secondaryButtonText: {
    color: colors.text,
  },
  outlineButtonText: {
    color: colors.primary,
  },
});
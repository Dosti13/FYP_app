import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from './Button';
import { colors } from '../../constants/theme';

interface NavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  isValid: boolean;
  isLoading: boolean;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
  requiresItem?: boolean;
}

export function NavigationButtons({
  currentStep,
  totalSteps,
  isValid,
  isLoading,
  onNext,
  onPrev,
  onSubmit,
  requiresItem
}: NavigationButtonsProps) {
  const isLastStep = currentStep === totalSteps || (currentStep === 3 && !requiresItem);
  const showBackButton = currentStep > 1;

  return (
    <View style={styles.container}>
      {showBackButton && (
        <Button
          title="Back"
          variant="secondary"
          onPress={onPrev}
          style={[styles.button, showBackButton && styles.backButton]}
        />
      )}
      
      <Button
        title={isLastStep ? 'Submit Report' : 'Next'}
        icon={isLastStep ? 'send' : 'arrow-forward'}
        onPress={isLastStep ? onSubmit : onNext}
        disabled={!isValid || isLoading}
        loading={isLoading}
        style={[
          styles.button, 
          styles.nextButton,
          !showBackButton && styles.fullWidthButton
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 12,
  },
  button: {
    flex: 1,
  },
  backButton: {
    flex: 1,
  },
  nextButton: {
    flex: 2,
  },
  fullWidthButton: {
    flex: 1,
  },
});

// components/common/EmergencyNotice.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/theme';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  console.log("step indicator");
  return (
    <View style={styles.container}>
      {[...Array(totalSteps)].map((_, index) => (
        <View key={index} style={styles.stepContainer}>
          <View style={[
            styles.stepCircle,
            currentStep > index + 1 && styles.completedStep,
            currentStep === index + 1 && styles.activeStep,
          ]}>
            <Text style={[
              styles.stepText,
              (currentStep > index + 1 || currentStep === index + 1) && styles.activeStepText
            ]}>
              {index + 1}
            </Text>
          </View>
          {index < totalSteps - 1 && (
            <View style={[
              styles.stepLine,
              currentStep > index + 1 && styles.completedStepLine
            ]} />
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: '#fff',
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedStep: {
    backgroundColor: colors.primary,
  },
  activeStep: {
    backgroundColor: colors.primary,
  },
  stepText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.mutedText,
  },
  activeStepText: {
    color: '#fff',
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: colors.border,
    marginHorizontal: 8,
  },
  completedStepLine: {
    backgroundColor: colors.primary,
  },
});
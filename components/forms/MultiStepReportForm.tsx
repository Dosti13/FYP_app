// components/forms/MultiStepReportForm.tsx
import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';

import { Header } from '../common/Header';
import { StepIndicator } from '../common/StepIndicator';
import { NavigationButtons } from '../common/NavigationButtons';

import { IncidentTypeSelector } from './IncidentTypeSelector';
import { LocationForm } from './LocationForm';
import { IncidentDetailsForm } from './IncidentDetailsForm';
import { StolenItemForm } from './StolenItemForm';

import { useReportForm } from '../../hooks/useReportForm';
import { colors } from '../../constants/theme';

export function MultiStepReportForm() {
  const {
    currentStep,
    reportData,
    selectedIncidentType,
    isLoading,
    totalSteps,
    updateReportData,
    setSelectedIncidentType,
    nextStep,
    prevStep,
    submitReport,
    validateStep,
  } = useReportForm();

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <IncidentTypeSelector
            selectedType={selectedIncidentType}
            onSelect={setSelectedIncidentType}
            reportData={reportData}
            onUpdateData={updateReportData}
          />
        );
      case 2:
        return (
          <LocationForm
            data={reportData.location}
            onUpdate={(location) => updateReportData('location', location)}
          />
        );
      case 3:
        return (
          <IncidentDetailsForm
            incidentData={reportData.incident}
            victimData={reportData.victim}
            onUpdateIncident={(incident) => updateReportData('incident', incident)}
            onUpdateVictim={(victim) => updateReportData('victim', victim)}
          />
        );
      case 4:
        return selectedIncidentType?.requiresItem ? (
          <StolenItemForm
            data={reportData.stolen_item}
            itemType={selectedIncidentType.itemType || 'general'}
            onUpdate={(stolenItem) => updateReportData('stolen_item', stolenItem)}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header
        title="Report Incident"
        onBack={currentStep === 1 ? () => router.back() : prevStep}
      />

      {/* Step Indicator */}
      <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.formContainer}>
          {renderCurrentStep()}
        </View>

        {/* Navigation Buttons */}
        <NavigationButtons
          currentStep={currentStep}
          totalSteps={totalSteps}
          isValid={validateStep(currentStep)}
          isLoading={isLoading}
          onNext={nextStep}
          onPrev={prevStep}
          onSubmit={submitReport}
          requiresItem={selectedIncidentType?.requiresItem}
        />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
});
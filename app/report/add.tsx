import React from 'react';
import { SafeScreen } from '../../components/common/SafeScreen';
import { MultiStepReportForm } from '../../components/forms/MultiStepReportForm';

export default function AddReportScreen() {
  return (
    <SafeScreen>
      <MultiStepReportForm />
    </SafeScreen>
  );
}
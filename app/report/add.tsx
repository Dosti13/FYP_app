import React from 'react';
import { SafeScreen } from '../../components/common/SafeScreen';
import { MultiStepReportForm } from '../../components/forms/MultiStepReportForm';

export default function AddReportScreen() {
  console.log("addd");
  
  return (
    <SafeScreen>
      <MultiStepReportForm />
    </SafeScreen>
  );
}
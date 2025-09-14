// hooks/useReportForm.ts
import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { apiService } from '../services/api/apiSerivce';
import { ReportData } from '../constants/types/report';
import { IncidentType } from '../constants/reportTypes';
import { validateReportStep } from '../utils/validation';

const initialReportData: ReportData = {
  location: {
    province: '',
    city: '',
    district: '',
    neighborhood: '',
    street_address: '',
    latitude: null,
    longitude: null,
  },
  victim: {
    name: '',
    age: '',
    gender: '',
    phone_number: '',
    email: '',
    address: '',
  },
  incident_type: {
    category: '',
    description: '',
  },
  stolen_item: {
    item_type: '',
    description: '',
    value_estimate: '',
    imei: '',
    phone_brand: '',
    phone_model: '',
    license_plate: '',
    chassis_number: '',
    vehicle_make: '',
    vehicle_model: '',
  },
  incident: {
    occurred_at: '',
    value_estimate: '',
    fir_filed: false,
  },
};

export function useReportForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [reportData, setReportData] = useState<ReportData>(initialReportData);
  const [selectedIncidentType, setSelectedIncidentType] = useState<IncidentType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const totalSteps = selectedIncidentType?.requiresItem ? 4 : 3;

  const updateReportData = useCallback((key: keyof ReportData, value: any) => {
    setReportData(prev => ({
      ...prev,
      [key]: { ...prev[key], ...value }
    }));
  }, []);

  const validateStep = useCallback((step: number): boolean => {
    return validateReportStep(step, reportData, selectedIncidentType);
  }, [reportData, selectedIncidentType]);

  const nextStep = useCallback(() => {
    if (validateStep(currentStep)) {
      if (currentStep === totalSteps) {
        submitReport();
      } else {
        setCurrentStep(prev => prev + 1);
      }
    } else {
      Alert.alert('Incomplete Information', 'Please fill in all required fields');
    }
  }, [currentStep, totalSteps, validateStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const submitReport = useCallback(async () => {
    setIsLoading(true);

    try {
      const submissionData = {
        location: reportData.location,
        victim: {
          ...reportData.victim,
          age: reportData.victim.age ? parseInt(reportData.victim.age) : undefined,
        },
        incident_type: reportData.incident_type,
        stolen_item: selectedIncidentType?.requiresItem ? reportData.stolen_item : undefined,
        incident: {
          ...reportData.incident,
          value_estimate: reportData.incident.value_estimate ? 
            parseFloat(reportData.incident.value_estimate) : undefined,
        }
      };

      const result = await apiService.submitReport(submissionData);
      
      if (result.success) {
        router.push('/report/success');
      } else {
        Alert.alert('Submission Failed', result.message);
      }
    } catch (error) {
      console.error('Report submission error:', error);
      Alert.alert('Error', 'Failed to submit report. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [reportData, selectedIncidentType]);

  return {
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
  };
}
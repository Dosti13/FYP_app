import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { apiService } from '../services/api/apiSerivce';
import { ReportData } from '../constants/types/report';
import { IncidentType } from '../constants/reportTypes';
import { validateReportStep } from '../utils/validation';
import { getValidationErrors } from '../utils/validation';
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
      const errors = getValidationErrors(reportData, currentStep);

  if (errors.length === 0) {
    if (currentStep === totalSteps) {
      submitReport();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  } else {
    Alert.alert('Validation Errors', errors.join('\n'));
  }
  }, [currentStep, totalSteps, validateStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const submitReport = useCallback(async () => {
    setIsLoading(true);
        const formattedDateTime = new Date(reportData.incident.occurred_at).toISOString();
    try {
      const submissionData = {
  occurred_at: formattedDateTime,

  location_data: {
    province: reportData.location.province,
    city: reportData.location.city,
    district: reportData.location.district,
    neighborhood: reportData.location.neighborhood,
    street_address: reportData.location.street_address,
   latitude: Number(reportData.location.latitude?.toFixed(6) || 0),
    longitude: Number(reportData.location.longitude?.toFixed(6) || 0),
  },

  victim_data: {
    name: reportData.victim.name,
    age: Number(reportData.victim.age || 0),
    Gender: reportData.victim.gender,
    phone_number: reportData.victim.phone_number,
    email: reportData.victim.email,
    address: reportData.victim.address
  },

  incident_type_name: reportData?.incident_type?.category,

  stolen_item_data: selectedIncidentType?.requiresItem
    ? {
        item_type: reportData.stolen_item.item_type,
        description: reportData.stolen_item.description,
        value_estimate: Number(reportData.stolen_item.value_estimate || 0),
       imei: reportData.stolen_item.item_type === 'phone'
        ? reportData.stolen_item.imei?.trim() || undefined // if empty, set undefined
        : reportData.stolen_item.imei,
        phone_brand: reportData.stolen_item.phone_brand,
        phone_model: reportData.stolen_item.phone_model,
        license_plate: reportData.stolen_item.license_plate,
        chassis_number: reportData.stolen_item.chassis_number,
        vehicle_make: reportData.stolen_item.vehicle_make,
        vehicle_model: reportData.stolen_item.vehicle_model,
      }
    : undefined,

  value_estimate: Number(reportData.incident.value_estimate || 0),

  fir_filed: reportData.incident.fir_filed,

  description: reportData?.incident_type?.description,

  is_anonymous: true,
  status: "reported",
};


    console.log("FINAL submission data →", submissionData);
      console.log("submisson data ",submissionData);
      
      const result = await apiService.submitReport(submissionData);
      
      if (result.success) {
        router.navigate('/report/success');
      } else {
        Alert.alert('Submission Failed', result.message);
      }
    } catch (error:any) {
      console.error('Report submission error:', error);
  if (error?.data) {
    console.log("🔥 BACKEND VALIDATION ERROR:", error.data);
    Alert.alert(
      'Submission Failed',
      JSON.stringify(error.data, null, 2) // pretty print
    );
  } else {
    console.error('Report submission error:', error);
    Alert.alert('Error', error.message || 'Failed to submit report. Please try again.');
  }
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
import { ReportData,} from '../constants/types/report';
import { IncidentType } from '../constants/reportTypes';
export function validateReportStep(
  step: number, 
  reportData: ReportData, 
  selectedIncidentType: IncidentType | null
): boolean {
  switch (step) {
    case 1: // Incident Type
      return reportData.incident_type.category !== '';
    
    case 2: // Location
      return reportData.location.province !== '' && 
             reportData.location.city !== '' &&
             reportData.location.neighborhood !== '';
    
    case 3: // Incident Details
      return reportData.incident.occurred_at !== '';
    
    case 4: // Stolen Item (if required)
      if (!selectedIncidentType?.requiresItem) return true;
      return reportData.stolen_item.description !== '';
    
    default:
      return true;
  }
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhoneNumber(phone: string): boolean {
  // Pakistani phone number format
  const phoneRegex = /^(\+92|0)?[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/[-\s]/g, ''));
}

export function validateIMEI(imei: string): boolean {
  return /^\d{15}$/.test(imei);
}

export function getValidationErrors(reportData: ReportData, step: number): string[] {
  const errors: string[] = [];

  switch (step) {
    case 1:
      if (!reportData.incident_type.category) {
        errors.push('Please select an incident type');
      }
      break;

    case 2:
      if (!reportData.location.province) {
        errors.push('Province is required');
      }
      if (!reportData.location.city) {
        errors.push('City is required');
      }
      if (!reportData.location.neighborhood) {
        errors.push('Neighborhood is required');
      }
      break;

    case 3:
      if (!reportData.incident.occurred_at) {
        errors.push('Date and time of incident is required');
      }
      if (reportData.victim.email && !validateEmail(reportData.victim.email)) {
        errors.push('Please enter a valid email address');
      }
      if (reportData.victim.phone_number && !validatePhoneNumber(reportData.victim.phone_number)) {
        errors.push('Please enter a valid phone number');
      }
      break;

    case 4:
      if (!reportData.stolen_item.description) {
        errors.push('Item description is required');
      }
      if (reportData.stolen_item.imei && !validateIMEI(reportData.stolen_item.imei)) {
        errors.push('Please enter a valid 15-digit IMEI number');
      }
      break;
  }

  return errors;
}

// utils/formatters.ts




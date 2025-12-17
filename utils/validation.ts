import { IncidentType } from '../constants/reportTypes';
import { ReportData, } from '../constants/types/report';

export function validateReportStep(
  step: number, 
  reportData: ReportData, 
  selectedIncidentType: IncidentType | null
): boolean {

  const item = reportData.stolen_item;
  const type = reportData.stolen_item.item_type?.toLowerCase();

  switch (step) {

    // ------------------------
    // STEP 1 — INCIDENT TYPE
    // ------------------------
    case 1:
      return reportData.incident_type?.category !== '';

    // ------------------------
    // STEP 2 — LOCATION
    // ------------------------
    case 2:
      return (
        reportData.location.province !== '' &&
        reportData.location.city !== '' &&
        reportData.location.neighborhood !== '' &&
        reportData.location.street_address !== ''
      );

    // ------------------------
    // STEP 3 — INCIDENT DETAILS
    // ------------------------
    case 3:
      return reportData.incident.occurred_at !== '';

    // ------------------------
    // STEP 4 — STOLEN ITEM (Advanced Rules)
    // ------------------------
    case 4:

      // If item is NOT required → step is valid
      if (!selectedIncidentType?.requiresItem) return true;

      // Must always have description
      if (!item.description) return false;

      // ---------------------------------------------------------
      // MOBILE SNATCH / PHONE → IMEI Required
      // ---------------------------------------------------------
      if ( selectedIncidentType?.category === "Mobile Snatch") {
        return (
          item.description !== '' &&
          item.imei?.trim()?.length === 15  // IMEI must be 15 digits
       
        );
      }

      // ---------------------------------------------------------
      // VEHICLE SNATCH
      // ---------------------------------------------------------
      if (
      
        selectedIncidentType?.category === "Car" ||
        selectedIncidentType?.category === "Bike"
      ) {
        return (
          item.description !== '' &&
          item.license_plate !== '' 

        );
      }

      // ---------------------------------------------------------
      // ANY OTHER ITEM — Only description required
      // ---------------------------------------------------------
      return item.description !== '';

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
      if (!reportData.incident_type?.category) {
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
      if (!reportData.location.street_address) {
        errors.push('Street address is required');
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
        errors.push("Item description is required.");
      }

      // -------- MOBILE / PHONE --------
      if (reportData.incident_type?.category === "Mobile Snatch" ) {
        if (!reportData.stolen_item.imei) {
          errors.push("IMEI number is required for stolen mobile.");
        } else if (!validateIMEI(reportData.stolen_item.imei)) {
          errors.push("IMEI must be a valid 15-digit number.");
        }

      }

      // -------- VEHICLE / CAR / BIKE --------
      if (reportData.incident_type?.category === "Car" || reportData.incident_type?.category === "Bike") {
        if (!reportData.stolen_item.license_plate) errors.push("License plate is required.");
       
      }
      break;
  }

  return errors;
}

// utils/formatters.ts




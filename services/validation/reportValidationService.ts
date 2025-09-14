// services/validation/reportValidationService.ts - Report validation logic
interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}


class ReportValidationService {
  // Validate complete report
  validateReport(reportData: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate incident type
    if (!reportData.incident_type?.category) {
      errors.push('Incident type is required');
    }

    // Validate location
    const locationValidation = this.validateLocation(reportData.location);
    if (!locationValidation.isValid) {
      errors.push(...locationValidation.errors);
    }
    warnings.push(...locationValidation.warnings);

    // Validate incident details
    const incidentValidation = this.validateIncidentDetails(reportData.incident);
    if (!incidentValidation.isValid) {
      errors.push(...incidentValidation.errors);
    }
    warnings.push(...incidentValidation.warnings);

    // Validate victim info (optional but must be valid if provided)
    if (this.hasVictimInfo(reportData.victim)) {
      const victimValidation = this.validateVictimInfo(reportData.victim);
      warnings.push(...victimValidation.warnings);
      if (!victimValidation.isValid) {
        errors.push(...victimValidation.errors);
      }
    }

    // Validate stolen item (if applicable)
    if (reportData.stolen_item && this.hasStolenItemInfo(reportData.stolen_item)) {
      const itemValidation = this.validateStolenItem(reportData.stolen_item);
      if (!itemValidation.isValid) {
        errors.push(...itemValidation.errors);
      }
      warnings.push(...itemValidation.warnings);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  // Validate location data
  private validateLocation(location: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!location.province) {
      errors.push('Province is required');
    }

    if (!location.city) {
      errors.push('City is required');
    }

    if (!location.neighborhood) {
      errors.push('Neighborhood is required');
    }

    // Validate coordinates if provided
    if (location.latitude && location.longitude) {
      if (!this.isValidLatitude(location.latitude)) {
        errors.push('Invalid latitude coordinate');
      }
      if (!this.isValidLongitude(location.longitude)) {
        errors.push('Invalid longitude coordinate');
      }
    } else {
      warnings.push('GPS coordinates not provided - location may be less accurate');
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  // Validate incident details
  private validateIncidentDetails(incident: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!incident.occurred_at) {
      errors.push('Date and time of incident is required');
    } else if (!this.isValidDateTime(incident.occurred_at)) {
      errors.push('Invalid date and time format');
    } else if (this.isFutureDateTime(incident.occurred_at)) {
      errors.push('Incident date cannot be in the future');
    } else if (this.isTooOldDateTime(incident.occurred_at)) {
      warnings.push('Incident occurred more than a year ago');
    }

    if (incident.value_estimate && !this.isValidAmount(incident.value_estimate)) {
      warnings.push('Invalid estimated loss amount');
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  // Validate victim information
  private validateVictimInfo(victim: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (victim.email && !this.isValidEmail(victim.email)) {
      errors.push('Invalid email address format');
    }

    if (victim.phone_number && !this.isValidPhoneNumber(victim.phone_number)) {
      errors.push('Invalid phone number format');
    }

    if (victim.age) {
      const age = parseInt(victim.age);
      if (isNaN(age) || age < 1 || age > 120) {
        errors.push('Invalid age');
      }
    }

    if (victim.name && victim.name.length < 2) {
      warnings.push('Very short name provided');
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  // Validate stolen item
  private validateStolenItem(item: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!item.description || item.description.length < 5) {
      errors.push('Stolen item description must be at least 5 characters');
    }

    if (item.value_estimate && !this.isValidAmount(item.value_estimate)) {
      warnings.push('Invalid item value estimate');
    }

    // Validate phone-specific fields
    if (item.item_type === 'phone') {
      if (item.imei && !this.isValidIMEI(item.imei)) {
        warnings.push('Invalid IMEI number format');
      }
    }

    // Validate vehicle-specific fields
    if (item.item_type === 'vehicle' || item.item_type === 'car') {
      if (item.license_plate && !this.isValidLicensePlate(item.license_plate)) {
        warnings.push('Invalid license plate format');
      }
    }

    return { isValid: errors.length === 0, errors, warnings };
  }

  // Validation helpers
  private isValidLatitude(lat: number): boolean {
    return lat >= -90 && lat <= 90;
  }

  private isValidLongitude(lng: number): boolean {
    return lng >= -180 && lng <= 180;
  }

  private isValidDateTime(dateTime: string): boolean {
    const date = new Date(dateTime);
    return date instanceof Date && !isNaN(date.getTime());
  }

  private isFutureDateTime(dateTime: string): boolean {
    const date = new Date(dateTime);
    return date > new Date();
  }

  private isTooOldDateTime(dateTime: string, yearsBack: number = 1): boolean {
    const date = new Date(dateTime);
    const cutoff = new Date();
    cutoff.setFullYear(cutoff.getFullYear() - yearsBack);
    return date < cutoff;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPhoneNumber(phone: string): boolean {
    // Pakistani phone number formats
    const phoneRegex = /^(\+92|92|0)?[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/[-\s]/g, ''));
  }

  private isValidAmount(amount: string | number): boolean {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return !isNaN(num) && num >= 0 && num <= 100000000; // Max 100M PKR
  }

  private isValidIMEI(imei: string): boolean {
    return /^\d{15}$/.test(imei);
  }

  private isValidLicensePlate(plate: string): boolean {
    // Pakistani license plate formats
    const plateRegex = /^[A-Z]{2,3}-\d{3,4}$/;
    return plateRegex.test(plate.toUpperCase());
  }

  private hasVictimInfo(victim: any): boolean {
    return victim && (
      victim.name || 
      victim.email || 
      victim.phone_number || 
      victim.age || 
      victim.address
    );
  }

  private hasStolenItemInfo(item: any): boolean {
    return item && (
      item.description || 
      item.value_estimate || 
      item.imei || 
      item.license_plate
    );
  }
}

export const reportValidationService = new ReportValidationService();
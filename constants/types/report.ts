export interface LocationData {
  province: string;
  city: string;
  district: string;
  neighborhood: string;
  street_address: string;
  latitude: number | null;
  longitude: number | null;
}

export interface VictimData {
  name: string;
  age: string;
  gender: string;
  phone_number: string;
  email: string;
  address: string;
}

export interface IncidentTypeData {
  category: string;
  description: string;
}

export interface StolenItemData {
  item_type: string;
  description: string;
  value_estimate: string;
  // Phone specific
  imei: string;
  phone_brand: string;
  phone_model: string;
  // Vehicle specific
  license_plate: string;
  chassis_number: string;
  vehicle_make: string;
  vehicle_model: string;
}

export interface IncidentData {
  occurred_at: string;
  value_estimate: string;
  fir_filed: boolean;
}

export interface ReportData {
  location: LocationData;
  victim: VictimData;
  incident_type: IncidentTypeData;
  stolen_item: StolenItemData;
  incident: IncidentData;
}
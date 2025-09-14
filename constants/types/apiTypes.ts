export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message: string;
  errors?: string[];
  meta?: {
    page?: number;
    totalPages?: number;
    total?: number;
    limit?: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface FilterParams {
  province?: string;
  city?: string;
  district?: string;
  incident_type?: string;
  date_from?: string;
  date_to?: string;
  risk_level?: 'HIGH' | 'MEDIUM' | 'LOW';
  status?: string;
}

export interface SortParams {
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

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
  name?: string;
  age?: number;
  gender?: string;
  phone_number?: string;
  email?: string;
  address?: string;
}

export interface IncidentTypeData {
  category: string;
  description: string;
}

export interface StolenItemData {
  item_type: string;
  description?: string;
  value_estimate?: number;
  imei?: string;
  phone_brand?: string;
  phone_model?: string;
  license_plate?: string;
  chassis_number?: string;
  vehicle_make?: string;
  vehicle_model?: string;
}

export interface IncidentData {
  occurred_at: string;
  value_estimate?: number;
  fir_filed: boolean;
}

export interface ReportSubmissionData {
  location: LocationData;
  victim: VictimData;
  incident_type: IncidentTypeData;
  stolen_item?: StolenItemData;
  incident: IncidentData;
}

export interface Report {
  id: number;
  occurred_at: string;
  location: LocationData & { id: number };
  victim: VictimData & { id: number };
  incident_type: IncidentTypeData & { id: number };
  stolen_item?: StolenItemData & { id: number };
  value_estimate?: number;
  fir_filed: boolean;
  status: 'pending' | 'verified' | 'investigating' | 'resolved' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface IncidentStats {
  total_incidents: number;
  this_month: number;
  this_week: number;
  resolved: number;
  fir_filed: number;
  by_type: Record<string, number>;
  by_location: Record<string, number>;
  trend: Array<{
    date: string;
    count: number;
  }>;
  peak_hours: number[];
  most_affected_areas: Array<{
    name: string;
    count: number;
    risk_level: string;
  }>;
}

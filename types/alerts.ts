// alerts.ts - TYPE DEFINITIONS (No API calls)
export interface AlertMarker {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  description: string;
  alertType: 'theft' | 'robbery' | 'suspicious';
  timestamp: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  photos?: string[];
  status: 'active' | 'resolved';
  commentsCount: number;
}

export interface NearbyAlertsRequest {
  latitude: number;
  longitude: number;
  radius?: number; // in meters, default 5000
  alertTypes?: string[];
  limit?: number;
}

export interface CreateAlertRequest {
  title: string;
  description: string;
  alertType: 'theft' | 'robbery' | 'suspicious';
  latitude: number;
  longitude: number;
  photos?: {
    uri: string;
    type: string;
    name: string;
  }[];
}
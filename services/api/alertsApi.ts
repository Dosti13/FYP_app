// alertsApi.ts - BACKEND API CALLS
import axios from 'axios';
import { AlertMarker, CreateAlertRequest, NearbyAlertsRequest } from '../../types/alerts';

const API_BASE_URL = 'https://your-backend-api.com/api';

// Axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken(); // From secure storage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const alertsApi = {
  
  // API CALL: GET NEARBY ALERTS (Called from MapScreen.tsx)
  getNearbyAlerts: async (params: NearbyAlertsRequest): Promise<{data: AlertMarker[]}> => {
    try {
      const response = await apiClient.get('/alerts/nearby', {
        params: {
          latitude: params.latitude,
          longitude: params.longitude,
          radius: params.radius || 5000,
          alertTypes: params.alertTypes?.join(','),
          limit: params.limit || 100
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching nearby alerts:', error);
      throw error;
    }
  },

  // API CALL: GET ALERT DETAILS (Called from AlertDetailsScreen.tsx)
  getAlertDetails: async (alertId: string): Promise<{data: AlertMarker}> => {
    try {
      const response = await apiClient.get(`/alerts/${alertId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching alert details:', error);
      throw error;
    }
  },

  // API CALL: CREATE NEW ALERT (Called from CreateAlertScreen.tsx)
  createAlert: async (alertData: CreateAlertRequest): Promise<{data: AlertMarker}> => {
    try {
      const formData = new FormData();
      formData.append('title', alertData.title);
      formData.append('description', alertData.description);
      formData.append('alertType', alertData.alertType);
      formData.append('latitude', alertData.latitude.toString());
      formData.append('longitude', alertData.longitude.toString());
      
      // Add photos if any
      alertData.photos?.forEach((photo, index) => {
        formData.append(`photos[${index}]`, {
          uri: photo.uri,
          type: photo.type,
          name: photo.name,
        } as any);
      });

      const response = await apiClient.post('/alerts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating alert:', error);
      throw error;
    }
  },

  // API CALL: UPDATE ALERT STATUS (Called from AlertDetailsScreen.tsx)
  updateAlertStatus: async (alertId: string, status: 'resolved' | 'active'): Promise<void> => {
    try {
      await apiClient.patch(`/alerts/${alertId}/status`, { status });
    } catch (error) {
      console.error('Error updating alert status:', error);
      throw error;
    }
  }
};
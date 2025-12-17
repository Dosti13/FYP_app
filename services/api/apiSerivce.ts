import { ApiUtils } from "../utils/apiUtils";
interface IncidentResult {
  id: number;
  status?: string;
  [key: string]: any;
}
interface PaginatedReportResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: any[];}
class ApiService {
  private baseUrl: string;
  private defaultHeaders: HeadersInit;
  
  constructor() {
    this.baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  // Generic API request method
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const config: RequestInit = {
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
        },
        ...options,
      };

      console.log(`API Request: ${config.method || 'GET'} ${url}`);
      
      const response = await fetch(url, config);
      
      const data = await response.json().catch(() => null);
     if (!response.ok) {
      // Throw the entire response data so you can see detailed backend errors
      console.error("🔥 BACKEND ERROR DATA:", data);
      throw { status: response.status, data };
    }

       console.log('API Response:', data);
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Authentication methods
  setAuthToken(token: string) {
    this.defaultHeaders = {
      ...this.defaultHeaders,
      'Authorization': `Bearer ${token}`,
    };
  }

  clearAuthToken() {
    const { Authorization, ...headers } = this.defaultHeaders as any;
    this.defaultHeaders = headers;
  }

  // Location Dimension Methods
  async createLocation(locationData: any): Promise<any> {
    return this.request('/locations', {
      method: 'POST',
      body: JSON.stringify(locationData),
    });
  }

  async findLocation(locationData: any): Promise<any> {
    const queryParams = new URLSearchParams(locationData);
    try {
      const locations = await this.request(`/locations?${queryParams.toString()}`);
      return Array.isArray(locations) && locations.length > 0 ? locations[0] : null;
    } catch (error) {
      return null;
    }
  }

  // Victim Dimension Methods
  async createVictim(victimData: any): Promise<any> {
    const cleanedData = Object.fromEntries(
      Object.entries(victimData).filter(([_, value]) => 
        value !== null && value !== undefined && value !== ''
      )
    );

    return this.request('/victims', {
      method: 'POST',
      body: JSON.stringify(cleanedData),
    });
  }

  // Incident Type Methods
  async createOrGetIncidentType(incidentTypeData: any): Promise<any> {
    try {
      const existingTypes = await this.request(
        `/incident-types?category=${encodeURIComponent(incidentTypeData.category)}`
      );
      
      if (Array.isArray(existingTypes) && existingTypes.length > 0) {
        return existingTypes[0];
      }
    } catch (error) {
      console.log('Error finding existing incident type, will create new one');
    }

    return this.request('/incident-types', {
      method: 'POST',
      body: JSON.stringify(incidentTypeData),
    });
  }

  // Stolen Item Methods
  async createStolenItem(stolenItemData: any): Promise<any> {
    const cleanedData = Object.fromEntries(
      Object.entries(stolenItemData).filter(([_, value]) => 
        value !== null && value !== undefined && value !== ''
      )
    );

    return this.request('/stolen-items', {
      method: 'POST',
      body: JSON.stringify(cleanedData),
    });
  }

  // Main Incident Methods
  async createIncident(incidentData: any): Promise<any> {
    return this.request('/incidents', {
      method: 'POST',
      body: JSON.stringify(incidentData),
    });
  }

  // Complete Report Submission
  async submitReport(reportData: any): Promise<{
    success: boolean;
    incident_id?: number;
    message: string;
  }> {
    try {
      const clean = ApiUtils.sanitizeData(reportData);
      console.log(clean,"clean data to submit");
      
      console.log('Submitting complete report:', reportData);

      // Submit as single transaction
      const result = await this.request<IncidentResult>('/reports/incidents/create/', {
        method: 'POST',
        body: JSON.stringify(clean),
      });
    
      return {
        success: true,
        incident_id: result.id,
        message: 'Report submitted successfully',
      };

    } catch (error:any) {
     if (error.data) {
      console.log("🔥 BACKEND ERROR DATA:", error.data);
    }

      console.error('Report submission error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to submit report',
      };
    }
  }

  // Get Reports
  async getReports(params?: any): Promise<any> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          queryParams.append(key, String(value));
        }
      });
    }

     const res = await this.request<PaginatedReportResponse>(`/reports/incidents?${queryParams.toString()}`);
  return res.results; // TypeScript n
  }

  // Get Report Details
  async getReportDetails(incidentId: number): Promise<any> {
    return this.request(`/reports/incidents/${incidentId}`);
  }

  // Statistics

  // Update Report Status
  async updateReportStatus(incidentId: number, updates: any): Promise<any> {
    return this.request(`/incidents/${incidentId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }
}

export const apiService = new ApiService();




// services/api/geofencingService.ts - Enhanced geofencing service
export interface RestrictedArea {
  id: string;
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  radius: number;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  alertMessage: string;
  incidentCount: number;
  lastIncident?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AreaEntry {
  id: string;
  areaId: string;
  userLocation: {
    latitude: number;
    longitude: number;
  };
  timestamp: string;
  deviceId?: string;
}

class GeofencingService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Geofencing API Error:', error);
      throw error;
    }
  }

  // Get all restricted areas
  async getRestrictedAreas(includeInactive = false): Promise<RestrictedArea[]> {
    return this.request(`/restricted-areas?include_inactive=${includeInactive}`);
  }

  // Get restricted areas by location
  async getRestrictedAreasByLocation(
    latitude: number, 
    longitude: number, 
    radiusKm: number = 10
  ): Promise<RestrictedArea[]> {
    return this.request(
      `/restricted-areas/nearby?lat=${latitude}&lng=${longitude}&radius=${radiusKm}`
    );
  }

  // Create new restricted area (admin)
  async createRestrictedArea(area: Omit<RestrictedArea, 'id' | 'createdAt' | 'updatedAt'>): Promise<RestrictedArea> {
    return this.request('/restricted-areas', {
      method: 'POST',
      body: JSON.stringify(area),
    });
  }

  // Update restricted area
  async updateRestrictedArea(id: string, updates: Partial<RestrictedArea>): Promise<RestrictedArea> {
    return this.request(`/restricted-areas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Delete restricted area
  async deleteRestrictedArea(id: string): Promise<void> {
    return this.request(`/restricted-areas/${id}`, {
      method: 'DELETE',
    });
  }

  // Report area entry
  async reportAreaEntry(areaId: string, userLocation: {
    latitude: number;
    longitude: number;
  }, deviceId?: string): Promise<void> {
    try {
      await this.request(`/restricted-areas/${areaId}/entries`, {
        method: 'POST',
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          location: userLocation,
          deviceId,
        }),
      });
    } catch (error) {
      console.error('Failed to report area entry:', error);
      // Non-critical - don't throw
    }
  }

  // Get area statistics
  async getAreaStatistics(areaId: string): Promise<{
    entries_today: number;
    entries_week: number;
    entries_month: number;
    peak_hours: number[];
    incident_correlation: number;
    most_active_day: string;
  }> {
    return this.request(`/restricted-areas/${areaId}/stats`);
  }

  // Get area entries (admin)
  async getAreaEntries(areaId: string, params?: {
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
  }): Promise<{
    entries: AreaEntry[];
    total: number;
  }> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }

    return this.request(`/restricted-areas/${areaId}/entries?${queryParams.toString()}`);
  }

  // Bulk update areas
  async bulkUpdateAreas(updates: Array<{
    id: string;
    updates: Partial<RestrictedArea>;
  }>): Promise<RestrictedArea[]> {
    return this.request('/restricted-areas/bulk-update', {
      method: 'PUT',
      body: JSON.stringify({ updates }),
    });
  }

  // Get areas by risk level
  async getAreasByRiskLevel(riskLevel: 'HIGH' | 'MEDIUM' | 'LOW'): Promise<RestrictedArea[]> {
    return this.request(`/restricted-areas?risk_level=${riskLevel}`);
  }

  // Search areas
  async searchAreas(query: string): Promise<RestrictedArea[]> {
    return this.request(`/restricted-areas/search?q=${encodeURIComponent(query)}`);
  }
}

export const geofencingService = new GeofencingService();


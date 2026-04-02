// services/api/apiService.ts
import { authService } from "../auth/authService";
import { ApiUtils } from "../utils/apiUtils";
// Response Types based on API documentation
interface IncidentResult {
  id: number;
  status?: string;
  [key: string]: any;
}
interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

interface IncidentType {
  id: number;
  category: string;
  description?: string;
}

interface Location {
  id: number;
  province?: string;
  city: string;
  district: string;
  neighborhood?: string;
  street_address?: string;
  latitude: string;
  longitude: string;
}

interface Victim {
  id: number;
  name: string;
  age: number;
  gender: string;
  phone_number?: string;
  email?: string;
}

interface StolenItem {
  id: number;
  item_type: string;
  imei?: string;
  phone_brand?: string;
  phone_model?: string;
  value_estimate?: number;
}

interface Incident {
  id: number;
  occurred_at: string;
  incident_type: IncidentType;
  location: Location;
  victim?: Victim;
  stolen_item?: StolenItem;
  value_estimate: string;
  fir_filed: boolean;
  description: string;
  is_anonymous: boolean;
  status: string;
  created_at: string;
}

interface IMEIRecord {
  id: number;
  imei: string;
  phone_brand: string;
  phone_model: string;
  owner_name: string;
  owner_contact: string;
  status: string;
  notes?: string;
  reported_at: string;
  reported_by_username: string;
}

interface HeatmapData {
  latitude: string;
  longitude: string;
  incident_count: number;
  city: string;
  district: string;
}

interface SafetyScore {
  location_id: number;
  city: string;
  district: string;
  neighborhood: string;
  incident_count: number;
  safety_score: number;
  risk_level: string;
}

interface Alert {
  id: number;
  location: Location;
  alert_type: string;
  message: string;
  severity: string;
  is_active: boolean;
  valid_from: string;
  valid_until: string | null;
  created_by_username: string;
  created_at: string;
}

interface SafetyTip {
  id: number;
  title: string;
  content: string;
  category: string;
  is_active: boolean;
  created_by_username: string;
  created_at: string;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl =
      process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:8000/api";
  }

  /**
   * Generic API request method with automatic token handling
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    requiresAuth: boolean = true,
  ): Promise<T> {
    try {
      const url = `${this.baseUrl}${endpoint}`;

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (requiresAuth) {
        const authHeader = await authService.getAuthHeader();
        console.log("🔑 Auth Header:", authHeader);
        if (authHeader) {
          headers["Authorization"] = authHeader;
        } else {
          throw new Error(
            "Authentication required but no valid token available",
          );
        }
      }
      console.log("📤 Request Headers:", headers);
      console.log("📦 Request Body:", options.body);
      if (options.headers) {
        Object.entries(options.headers).forEach(([key, value]) => {
          headers[key] = value as string;
        });
      }

      const config: RequestInit = {
        ...options,
        headers,
      };

      console.log(`API Request: ${config.method || "GET"} ${url}`);

      const response = await fetch(url, config);
     
      let data = null;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        try {
          const text = await response.text();
          data = text ? JSON.parse(text) : null;
        } catch (parseError) {
          console.error("JSON parse error:", parseError);
        }
      }

      if (!response.ok) {
        console.error("API Error Response:", data);

        if (response.status === 401 && requiresAuth) {
          console.log("Got 401, attempting token refresh...");
          try {
            await authService.refreshToken();
            return this.retryRequest<T>(endpoint, options, requiresAuth);
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            throw {
              status: 401,
              data: { message: "Session expired. Please login again." },
            };
          }
        }

        throw new Error(data?.message || "API request failed");
      }

      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  private async retryRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    requiresAuth: boolean = true,
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (requiresAuth) {
      const authHeader = await authService.getAuthHeader();
      if (authHeader) {
        headers["Authorization"] = authHeader;
      }
    }

    if (options.headers) {
      Object.entries(options.headers).forEach(([key, value]) => {
        headers[key] = value as string;
      });
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    const response = await fetch(url, config);

    let data = null;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const text = await response.text();
      data = text ? JSON.parse(text) : null;
    }

    if (!response.ok) {
      throw new Error(data?.message || "API request failed");
    }

    return data;
  }

  async createIncident(reportData: any): Promise<{
    success: boolean;
    incident_id?: number;
    message: string;
  }> {
    try {
      const clean = ApiUtils.deepSanitize(reportData);
      console.log("Submitting complete report:", clean);

      // Submit as single transaction console.log('📋 Submitting complete report:', reportData);
      console.log("📋 Report as JSON:", JSON.stringify(reportData, null, 2));
      const result = await this.request<IncidentResult>(
        "/reports/incidents/create/",
        {
          method: "POST",
          body: JSON.stringify(clean),
        },
      );

      return {
        success: true,
        incident_id: result.id,
        message: "Report submitted successfully",
      };
    } catch (error: any) {
      if (error.data) {
        console.log("🔥 BACKEND ERROR DATA:", error.data);
      }

      console.error("Report submission error:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to submit report",
      };
    }
  }
  /**
   * List Incidents
   * GET /reports/incidents/
   * Permission: Public (read-only)
   */
  async getIncidents(params?: {
    city?: string;
    district?: string;
    neighborhood?: string;
    incident_type__category?: string;
    status?: string;
    date_from?: string;
    date_to?: string;
    fir_filed?: boolean;
    search?: string;
    ordering?: string;
    page?: number;
    page_size?: number;
  }): Promise<Incident[]> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          queryParams.append(key, String(value));
        }
      });
    }

    const endpoint = queryParams.toString()
      ? `/reports/incidents/?${queryParams.toString()}`
      : "/reports/incidents/";

    const res = await this.request<PaginatedResponse<Incident>>(
      endpoint,
      {},
      false,
    );
    return res.results;
  }

  /**
   * Get Incident Details
   * GET /reports/incidents/{id}/
   * Permission: Public (read-only)
   */
  async getIncidentDetails(id: number): Promise<Incident> {
    return this.request<Incident>(`/reports/incidents/${id}/`, {}, false);
  }

  /**
   * Update Incident
   * PATCH /reports/incidents/{id}/update/
   * Permission: Authenticated (owner only)
   */
  async updateIncident(
    id: number,
    updates: {
      description?: string;
      status?: string;
      fir_filed?: boolean;
    },
  ): Promise<Incident> {
    return this.request<Incident>(`/reports/incidents/${id}/update/`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  }

  /**
   * Delete Incident
   * DELETE /reports/incidents/{id}/delete/
   * Permission: Authenticated (owner only)
   */
  async deleteIncident(id: number): Promise<void> {
    await this.request(`/reports/incidents/${id}/delete/`, {
      method: "DELETE",
    });
  }

  /**
   * My Incidents
   * GET /reports/incidents/my/
   * Permission: Authenticated
   */
  async getMyIncidents(): Promise<Incident[]> {
    const res = await this.request<PaginatedResponse<Incident>>(
      "/reports/incidents/my/",
    );
    return res.results;
  }

  // ==========================================
  // 3. IMEI TRACKING

  /**
   * Check IMEI Status
   * POST /reports/imei/check/
   * Permission: Public
   */
  async checkIMEI(imei: string): Promise<{
    found: boolean;
    status?: string;
    phone_brand?: string;
    phone_model?: string;
    reported_at?: string;
    message: string;
  }> {
    return this.request(
      "/reports/imei/check/",
      {
        method: "POST",
        body: JSON.stringify({ imei }),
      },
      false,
    );
  }

  /**
   * List All IMEIs
   * GET /reports/imei/list/
   * Permission: Admin/Authority
   */
  async listIMEIs(params?: {
    status?: string;
    search?: string;
  }): Promise<IMEIRecord[]> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          queryParams.append(key, String(value));
        }
      });
    }

    const endpoint = queryParams.toString()
      ? `/reports/imei/list/?${queryParams.toString()}`
      : "/reports/imei/list/";

    return this.request<IMEIRecord[]>(endpoint);
  }

  /**
   * Update IMEI Status
   * PATCH /reports/imei/{id}/update/
   * Permission: Admin/Authority
   */
  async updateIMEI(
    id: number,
    updates: {
      status?: string;
      notes?: string;
    },
  ): Promise<IMEIRecord> {
    return this.request<IMEIRecord>(`/reports/imei/${id}/update/`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  }

  // ==========================================
  // 4. CRIME ANALYTICS
  // ==========================================

  /**
   * Crime Heatmap
   * GET /reports/heatmap/
   * Permission: Public
   */
  async getHeatmap(params?: {
    days?: number;
    city?: string;
  }): Promise<HeatmapData[]> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          queryParams.append(key, String(value));
        }
      });
    }

    const endpoint = queryParams.toString()
      ? `/reports/heatmap/?${queryParams.toString()}`
      : "/reports/heatmap/";

    return this.request<HeatmapData[]>(endpoint, {}, false);
  }

  /**
   * Area Safety Score
   * GET /reports/safety-score/
   * Permission: Public
   */
  async getSafetyScore(params?: {
    city?: string;
    days?: number;
  }): Promise<SafetyScore[]> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          queryParams.append(key, String(value));
        }
      });
    }

    const endpoint = queryParams.toString()
      ? `/reports/safety-score/?${queryParams.toString()}`
      : "/reports/safety-score/";

    return this.request<SafetyScore[]>(endpoint, {}, false);
  }

  /**
   * Crime Statistics
   * GET /reports/statistics/
   * Permission: Public
   */
  async getStatistics(params?: { days?: number }): Promise<{
    total_incidents: number;
    period_days: number;
    by_incident_type: Array<{ incident_type__category: string; count: number }>;
    top_cities: Array<{ location__city: string; count: number }>;
    fir_filed_percentage: number;
  }> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }

    const endpoint = queryParams.toString()
      ? `/reports/statistics/?${queryParams.toString()}`
      : "/reports/statistics/";

    return this.request(endpoint, {}, false);
  }

  // ==========================================
  // 5. AREA ALERTS
  // ==========================================

  /**
   * List Active Alerts
   * GET /reports/alerts/
   * Permission: Public
   */
  async getAlerts(params?: {
    alert_type?: string;
    severity?: string;
    location__city?: string;
  }): Promise<Alert[]> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          queryParams.append(key, String(value));
        }
      });
    }

    const endpoint = queryParams.toString()
      ? `/reports/alerts/?${queryParams.toString()}`
      : "/reports/alerts/";

    return this.request<Alert[]>(endpoint, {}, false);
  }

  /**
   * Create Alert
   * POST /reports/alerts/create/
   * Permission: Admin/Authority
   */
  async createAlert(data: {
    location_id: number;
    alert_type: string;
    message: string;
    severity: string;
    valid_from: string;
    valid_until?: string;
  }): Promise<Alert> {
    return this.request<Alert>("/reports/alerts/create/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // ==========================================
  // 6. SAFETY TIPS
  // ==========================================

  /**
   * List Safety Tips
   * GET /core/safety-tips/
   * Permission: Public
   */
  async getSafetyTips(params?: {
    category?: string;
    search?: string;
  }): Promise<SafetyTip[]> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          queryParams.append(key, String(value));
        }
      });
    }

    const endpoint = queryParams.toString()
      ? `/core/safety-tips/?${queryParams.toString()}`
      : "/core/safety-tips/";

    return this.request<SafetyTip[]>(endpoint, {}, false);
  }

  /**
   * Create Safety Tip
   * POST /core/safety-tips/create/
   * Permission: Authenticated
   */
  async createSafetyTip(data: {
    title: string;
    content: string;
    category: string;
  }): Promise<SafetyTip> {
    return this.request<SafetyTip>("/core/safety-tips/create/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // ==========================================
  // 7. FEEDBACK
  // ==========================================

  /**
   * Submit Feedback
   * POST /core/feedback/
   * Permission: Public
   */
  async submitFeedback(data: {
    subject: string;
    message: string;
    contact_email: string;
  }): Promise<any> {
    return this.request(
      "/core/feedback/",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      false,
    );
  }

  /**
   * List Feedback
   * GET /core/feedback/list/
   * Permission: Admin
   */
  async listFeedback(params?: { is_resolved?: boolean }): Promise<any[]> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }

    const endpoint = queryParams.toString()
      ? `/core/feedback/list/?${queryParams.toString()}`
      : "/core/feedback/list/";

    return this.request<any[]>(endpoint);
  }

  // ==========================================
  // 8. INCIDENT TYPES
  // ==========================================

  /**
   * List Incident Types
   * GET /core/incident-types/
   * Permission: Public
   */
  async getIncidentTypes(): Promise<IncidentType[]> {
    return this.request<IncidentType[]>("/core/incident-types/", {}, false);
  }

  // ==========================================
  // UTILITY METHODS
  // ==========================================

  async isAuthenticated(): Promise<boolean> {
    return authService.isAuthenticated();
  }

  async getCurrentUser() {
    return authService.getCurrentUser();
  }

  async logout(): Promise<void> {
    await authService.logout();
  }
}

export const apiService = new ApiService();

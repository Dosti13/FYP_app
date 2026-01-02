// services/api/authService.ts - Authentication service
import AsyncStorage from '@react-native-async-storage/async-storage';

// ----------------- Interfaces -----------------
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name?: string;
  phone?: string;
  role: 'user' | 'admin' | 'moderator';
  verified: boolean;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

interface BackendTokens {
  access: string;
  refresh: string;
}

// ----------------- Custom API Error -----------------
export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

// ----------------- AuthService -----------------
class AuthService {
  private baseUrl: string;
  private tokenKey = 'auth_tokens';
  private userKey = 'auth_user';

  constructor() {
    this.baseUrl =
      process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';
  }

  // Decode JWT to get expiration and payload
  private decodeJWT(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('JWT decode error:', error);
      return null;
    }
  }

  // Generic API request with proper error handling
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (options.headers) {
        Object.entries(options.headers).forEach(([key, value]) => {
          headers[key] = value as string;
        });
      }

      const fetchOptions: RequestInit = { method: options.method || 'GET', headers, ...options };
      delete fetchOptions.headers;
      fetchOptions.headers = headers;

      const response = await fetch(url, fetchOptions);

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        data = responseText;
        console.log(data,"data");
        
      }

      if (!response.ok) {
     
        
        const message =
          data?.detail ||
          data?.message ||
          data?.non_field_errors?.[0] ||
          data?.email
          'Request failed';
        throw new ApiError(message, response.status, data);
      }

      return data;
    } catch (error:any) {
      if (!(error instanceof ApiError)) {
        throw new ApiError(error.message || 'Network error', 0);
      }
      throw error;
    }
  }

  // Convert backend tokens to internal format
  private convertTokens(backendTokens: BackendTokens): AuthTokens {
    const decoded = this.decodeJWT(backendTokens.access);
    const expiresAt = decoded?.exp ? decoded.exp * 1000 : Date.now() + 5 * 60 * 1000;

    return {
      accessToken: backendTokens.access,
      refreshToken: backendTokens.refresh,
      expiresAt,
    };
  }

  // ----------------- Auth API -----------------
  async register(userData: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    password: string;
    password2: string;
  }): Promise<{ user: User; tokens: AuthTokens }> {
    const result = await this.request<{ user: User; tokens: BackendTokens }>('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    const tokens = this.convertTokens(result.tokens);
    await this.storeTokens(tokens);
    await this.storeUser(result.user);
    return { user: result.user, tokens };
  }

  async login(credentials: { email: string; password: string }): Promise<{ user: User; tokens: AuthTokens }> {
    const result = await this.request<{ user: User; tokens: BackendTokens }>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    const tokens = this.convertTokens(result.tokens);
    await this.storeTokens(tokens);
    await this.storeUser(result.user);
    return { user: result.user, tokens };
  }

  async logout(): Promise<void> {
    const tokens = await this.getStoredTokens();
    if (tokens) {
      try {
        await this.request('/auth/logout/', {
          method: 'POST',
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        });
      } catch (error) {
        console.warn('Logout failed:', error);
      }
    }
    await this.clearStorage();
  }

  async refreshToken(): Promise<AuthTokens> {
    const tokens = await this.getStoredTokens();
    if (!tokens) throw new Error('No refresh token available');

    const result = await this.request<{ access: string }>('/auth/token/refresh/', {
      method: 'POST',
      body: JSON.stringify({ refresh: tokens.refreshToken }),
    });

    const newTokens = this.convertTokens({ access: result.access, refresh: tokens.refreshToken });
    await this.storeTokens(newTokens);
    return newTokens;
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const tokens = await this.getValidTokens();
      if (!tokens) return null;

      const user = await this.request<User>('/auth/profile/', {
        method: 'GET',
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
      });

      await this.storeUser(user);
      return user;
    } catch (error: any) {
      if (error.status === 401) {
        try {
          const newTokens = await this.refreshToken();
          const user = await this.request<User>('/auth/profile/', {
            method: 'GET',
            headers: { Authorization: `Bearer ${newTokens.accessToken}` },
          });
          await this.storeUser(user);
          return user;
        } catch {
          await this.clearStorage();
          return null;
        }
      }
      await this.clearStorage();
      return null;
    }
  }

  async updateProfile(updates: Partial<User>): Promise<User> {
    const tokens = await this.getValidTokens();
    if (!tokens) throw new Error('Not authenticated');

    const user = await this.request<User>('/auth/profile/', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${tokens.accessToken}` },
      body: JSON.stringify(updates),
    });
console.log(user,"from update ");

    await this.storeUser(user);
    return user;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const tokens = await this.getValidTokens();
    if (!tokens) throw new Error('Not authenticated');

    await this.request('/auth/change-password/', {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokens.accessToken}` },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  async forgotPassword(email: string): Promise<void> {
    await this.request('/auth/password-reset/request/', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await this.request('/auth/reset-password/', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  }

  async verifyEmail(token: string): Promise<void> {
    await this.request('/auth/verify-email/', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  async resendVerificationEmail(): Promise<void> {
    const tokens = await this.getValidTokens();
    if (!tokens) throw new Error('Not authenticated');

    await this.request('/auth/resend-verification/', {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokens.accessToken}` },
    });
  }

  async deleteAccount(): Promise<void> {
    const tokens = await this.getValidTokens();
    if (!tokens) throw new Error('Not authenticated');

    await this.request('/auth/delete-account/', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${tokens.accessToken}` },
    });
    await this.clearStorage();
  }

  // ----------------- Storage -----------------
  private async storeTokens(tokens: AuthTokens) {
    await AsyncStorage.setItem(this.tokenKey, JSON.stringify(tokens));
  }

  private async getStoredTokens(): Promise<AuthTokens | null> {
    const stored = await AsyncStorage.getItem(this.tokenKey);
    return stored ? JSON.parse(stored) : null;
  }

  private async getValidTokens(): Promise<AuthTokens | null> {
    const tokens = await this.getStoredTokens();
    if (!tokens) return null;

    const bufferTime = 60 * 1000; // 1 min
    if (Date.now() >= tokens.expiresAt - bufferTime) {
      try {
        return await this.refreshToken();
      } catch {
        await this.clearStorage();
        return null;
      }
    }
    return tokens;
  }

  private async storeUser(user: User) {
    await AsyncStorage.setItem(this.userKey, JSON.stringify(user));
  }

  async getStoredUser(): Promise<User | null> {
    const stored = await AsyncStorage.getItem(this.userKey);
    return stored ? JSON.parse(stored) : null;
  }

  private async clearStorage() {
    await AsyncStorage.multiRemove([this.tokenKey, this.userKey]);
  }

  async isAuthenticated(): Promise<boolean> {
    const tokens = await this.getValidTokens();
    return !!tokens;
  }

  async getAuthHeader(): Promise<string | null> {
    const tokens = await this.getValidTokens();
    return tokens ? `Bearer ${tokens.accessToken}` : null;
  }
}

export const authService = new AuthService();

// services/api/authService.ts - Authentication service
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  email: string;
  name: string;
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

// Backend response format
interface BackendTokens {
  access: string;
  refresh: string;
}

class AuthService {
  private baseUrl: string;
  private tokenKey = 'auth_tokens';
  private userKey = 'auth_user';

  constructor() {
    this.baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';
  }

  // Decode JWT to get expiration time
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

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      
      // Build headers separately to ensure they're set correctly
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      // Merge any additional headers
      if (options.headers) {
        Object.entries(options.headers).forEach(([key, value]) => {
          headers[key] = value as string;
        });
      }

      console.log('=== API Request ===');
      console.log('URL:', url);
      console.log('Method:', options.method || 'GET');
      console.log('Headers:', JSON.stringify(headers, null, 2));
      
      const fetchOptions: RequestInit = {
        method: options.method || 'GET',
        headers: headers,
        ...options,
      };
      
      // Remove headers from options to avoid duplication
      delete fetchOptions.headers;
      fetchOptions.headers = headers;

      console.log('Final Fetch Options:', JSON.stringify(fetchOptions, null, 2));
      
      const response = await fetch(url, fetchOptions);

      console.log('Response Status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error Response Text:', errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { detail: errorText };
        }
        
        console.log('Error Data:', errorData);
        throw new Error(errorData.message || errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const responseText = await response.text();
      console.log('Success Response:', responseText.substring(0, 200));
      
      return JSON.parse(responseText);
    } catch (error) {
      console.error('Auth API Error:', error);
      throw error;
    }
  }

  // Convert backend token format to internal format
  private convertTokens(backendTokens: BackendTokens): AuthTokens {
    // Decode JWT to get actual expiration time
    const decoded = this.decodeJWT(backendTokens.access);
    let expiresAt: number;

    if (decoded && decoded.exp) {
      // JWT exp is in seconds, convert to milliseconds
      expiresAt = decoded.exp * 1000;
    } else {
      // Fallback: assume 5 minutes validity
      expiresAt = Date.now() + (5 * 60 * 1000);
    }

    console.log('Token expires at:', new Date(expiresAt).toISOString());
    
    return {
      accessToken: backendTokens.access,
      refreshToken: backendTokens.refresh,
      expiresAt,
    };
  }

  // Register new user
  async register(userData: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    password: string;
    password2: string;
  }): Promise<{ user: User; tokens: AuthTokens }> {
    console.log('Registering user:', userData.email);
    
    const result = await this.request<{ user: User; tokens: { access: string; refresh: string } }>('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    const tokens = this.convertTokens({ access: result.tokens.access, refresh: result.tokens.refresh });
    await this.storeTokens(tokens);
    await this.storeUser(result.user);

    return { user: result.user, tokens };
  }

  // Login user
  async login(credentials: {
    email: string;
    password: string;
  }): Promise<{ user: User; tokens: AuthTokens }> {
    console.log('Logging in user:', credentials.email);
    
    const result = await this.request<{ user: User; tokens: { access: string; refresh: string } }>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    console.log('Login response tokens:', result.tokens);
    
    const tokens = this.convertTokens({ access: result.tokens.access, refresh: result.tokens.refresh });
    await this.storeTokens(tokens);
    await this.storeUser(result.user);

    return { user: result.user, tokens };
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      const tokens = await this.getStoredTokens();
      if (tokens) {
        await this.request('/auth/logout/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${tokens.accessToken}`,
          },
        });
      }
      console.log("User logged out successfully");
    } catch (error) {
      console.warn('Logout API call failed:', error);
    }

    await this.clearStorage();
  }

  // Refresh access token
  async refreshToken(): Promise<AuthTokens> {
    const tokens = await this.getStoredTokens();
    if (!tokens) {
      throw new Error('No refresh token available');
    }

    console.log('Refreshing access token...');

    const result = await this.request<{ access: string }>('/auth/token/refresh/', {
      method: 'POST',
      body: JSON.stringify({ refresh: tokens.refreshToken }),
    });

    const newTokens = this.convertTokens({ 
      access: result.access, 
      refresh: tokens.refreshToken // Keep the same refresh token
    });
    
    await this.storeTokens(newTokens);
    console.log('Token refreshed successfully');
    return newTokens;
  }

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    try {
      const tokens = await this.getValidTokens();
      
      if (!tokens) {
        console.log('No valid tokens available');
        return null;
      }

      // Check if token is actually defined
      if (!tokens.accessToken) {
        console.error('Access token is undefined!');
        await this.clearStorage();
        return null;
      }

      // Decode token to check user_id
      const decoded = this.decodeJWT(tokens.accessToken);
      console.log('=== GET CURRENT USER ===');
      console.log('Token decoded - user_id:', decoded?.user_id);
      console.log('Token expires:', decoded?.exp ? new Date(decoded.exp * 1000).toISOString() : 'unknown');
      console.log('Access Token (first 50 chars):', tokens.accessToken.substring(0, 50) + '...');
      console.log('Full Authorization Header:', `Bearer ${tokens.accessToken.substring(0, 50)}...`);

      const user = await this.request<User>('/auth/profile/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${tokens.accessToken}`,
        },
      });

      await this.storeUser(user);
      console.log('User profile fetched successfully');
      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      
      // If 401, try to refresh token once
      if (error instanceof Error && error.message.includes('401')) {
        try {
          console.log('Got 401, attempting token refresh...');
          const newTokens = await this.refreshToken();
          
          // Retry with new token
          const user = await this.request<User>('/auth/profile/', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${newTokens.accessToken}`,
            },
          });
          
          await this.storeUser(user);
          console.log('User profile fetched after token refresh');
          return user;
        } catch (refreshError) {
          console.error('Token refresh failed, clearing storage:', refreshError);
          await this.clearStorage();
          return null;
        }
      }
      
      await this.clearStorage();
      return null;
    }
  }

  // Update user profile
  async updateProfile(updates: Partial<User>): Promise<User> {
    const tokens = await this.getValidTokens();
    if (!tokens) throw new Error('Not authenticated');

    const user = await this.request<User>('/auth/profile/', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${tokens.accessToken}`,
      },
      body: JSON.stringify(updates),
    });

    await this.storeUser(user);
    return user;
  }

  // Change password
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const tokens = await this.getValidTokens();
    if (!tokens) throw new Error('Not authenticated');

    await this.request('/auth/change-password/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokens.accessToken}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  // Forgot password
  async forgotPassword(email: string): Promise<void> {
    await this.request('/auth/password-reset/request/', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // Reset password
  async resetPassword(token: string, newPassword: string): Promise<void> {
    await this.request('/auth/reset-password/', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  }

  // Verify email
  async verifyEmail(token: string): Promise<void> {
    await this.request('/auth/verify-email/', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  // Resend verification email
  async resendVerificationEmail(): Promise<void> {
    const tokens = await this.getValidTokens();
    if (!tokens) throw new Error('Not authenticated');

    await this.request('/auth/resend-verification/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokens.accessToken}`,
      },
    });
  }

  // Token management
  private async storeTokens(tokens: AuthTokens): Promise<void> {
    try {
      await AsyncStorage.setItem(this.tokenKey, JSON.stringify(tokens));
      console.log('Tokens stored successfully');
    } catch (error) {
      console.error('Store tokens error:', error);
    }
  }

  private async getStoredTokens(): Promise<AuthTokens | null> {
    try {
      const stored = await AsyncStorage.getItem(this.tokenKey);
      if (!stored) {
        console.log('No stored tokens found');
        return null;
      }
      
      const tokens = JSON.parse(stored);
      console.log('Stored tokens retrieved, expires:', new Date(tokens.expiresAt).toISOString());
      return tokens;
    } catch (error) {
      console.error('Get stored tokens error:', error);
      return null;
    }
  }

  private async getValidTokens(): Promise<AuthTokens | null> {
    const tokens = await this.getStoredTokens();
    
    if (!tokens) return null;

    const now = Date.now();
    const bufferTime = 60 * 1000; // 1 minute buffer

    // Check if token is expired or will expire soon
    if (now >= (tokens.expiresAt - bufferTime)) {
      console.log('Token expired or expiring soon, refreshing...');
      try {
        return await this.refreshToken();
      } catch (error) {
        console.error('Token refresh failed:', error);
        await this.clearStorage();
        return null;
      }
    }

    console.log('Using valid token');
    return tokens;
  }

  private async storeUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(this.userKey, JSON.stringify(user));
      console.log('User stored successfully');
    } catch (error) {
      console.error('Store user error:', error);
    }
  }

  async getStoredUser(): Promise<User | null> {
    try {
      const stored = await AsyncStorage.getItem(this.userKey);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Get stored user error:', error);
      return null;
    }
  }

  // Check authentication status
  async isAuthenticated(): Promise<boolean> {
    const tokens = await this.getValidTokens();
    return !!tokens;
  }

  async getAuthHeader(): Promise<string | null> {
    const tokens = await this.getValidTokens();
    return tokens ? `Bearer ${tokens.accessToken}` : null;
  }

  private async clearStorage(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([this.tokenKey, this.userKey]);
      console.log('Auth storage cleared');
    } catch (error) {
      console.error('Clear auth storage error:', error);
    }
  }

  async deleteAccount(): Promise<void> {
    const tokens = await this.getValidTokens();
    if (!tokens) throw new Error('Not authenticated');

    await this.request('/auth/delete-account/', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${tokens.accessToken}`,
      },
    });

    await this.clearStorage();
  }
}

export const authService = new AuthService();
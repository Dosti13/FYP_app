// services/api/authService.ts - Authentication service
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  role: 'user' | 'admin' | 'moderator';
  verified: boolean;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

class AuthService {
  private baseUrl: string;
  private tokenKey = 'auth_tokens';
  private userKey = 'auth_user';

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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Auth API Error:', error);
      throw error;
    }
  }

  // Register new user
  async register(userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }): Promise<{ user: User; tokens: AuthTokens }> {
    const result = await this.request<{ user: User; tokens: AuthTokens }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    await this.storeTokens(result.tokens);
    await this.storeUser(result.user);

    return result;
  }

  // Login user
  async login(credentials: {
    email: string;
    password: string;
  }): Promise<{ user: User; tokens: AuthTokens }> {
    const result = await this.request<{ user: User; tokens: AuthTokens }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    await this.storeTokens(result.tokens);
    await this.storeUser(result.user);

    return result;
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      const tokens = await this.getStoredTokens();
      if (tokens) {
        await this.request('/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${tokens.accessToken}`,
          },
        });
      }
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

    const result = await this.request<{ tokens: AuthTokens }>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken: tokens.refreshToken }),
    });

    await this.storeTokens(result.tokens);
    return result.tokens;
  }

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    try {
      const tokens = await this.getValidTokens();
      if (!tokens) return null;

      const user = await this.request<User>('/auth/me', {
        headers: {
          'Authorization': `Bearer ${tokens.accessToken}`,
        },
      });

      await this.storeUser(user);
      return user;
    } catch (error) {
       console.error('Get current user error:', error);
      await this.clearStorage();
      return null;
    }
}
 // Update user profile
  async updateProfile(updates: Partial<User>): Promise<User> {
    const tokens = await this.getValidTokens();
    if (!tokens) throw new Error('Not authenticated');

    const user = await this.request<User>('/auth/profile', {
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

    await this.request('/auth/change-password', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokens.accessToken}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  // Forgot password
  async forgotPassword(email: string): Promise<void> {
    await this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // Reset password
  async resetPassword(token: string, newPassword: string): Promise<void> {
    await this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  }

  // Verify email
  async verifyEmail(token: string): Promise<void> {
    await this.request('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  // Resend verification email
  async resendVerificationEmail(): Promise<void> {
    const tokens = await this.getValidTokens();
    if (!tokens) throw new Error('Not authenticated');

    await this.request('/auth/resend-verification', {
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
    } catch (error) {
      console.error('Store tokens error:', error);
    }
  }

  private async getStoredTokens(): Promise<AuthTokens | null> {
    try {
      const stored = await AsyncStorage.getItem(this.tokenKey);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Get stored tokens error:', error);
      return null;
    }
  }

  private async getValidTokens(): Promise<AuthTokens | null> {
    const tokens = await this.getStoredTokens();
    if (!tokens) return null;

    // Check if token is expired
    if (Date.now() >= tokens.expiresAt) {
      try {
        return await this.refreshToken();
      } catch (error) {
        await this.clearStorage();
        return null;
      }
    }

    return tokens;
  }

  // User management
  private async storeUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(this.userKey, JSON.stringify(user));
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

  // Get auth header for API requests
  async getAuthHeader(): Promise<string | null> {
    const tokens = await this.getValidTokens();
    return tokens ? `Bearer ${tokens.accessToken}` : null;
  }

  // Clear all stored auth data
  private async clearStorage(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([this.tokenKey, this.userKey]);
    } catch (error) {
      console.error('Clear auth storage error:', error);
    }
  }

  // Delete account
  async deleteAccount(): Promise<void> {
    const tokens = await this.getValidTokens();
    if (!tokens) throw new Error('Not authenticated');

    await this.request('/auth/delete-account', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${tokens.accessToken}`,
      },
    });

    await this.clearStorage();
  }
}

export const authService = new AuthService();

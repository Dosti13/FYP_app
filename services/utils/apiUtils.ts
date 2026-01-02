export class ApiUtils {
  // Build query string from params
  static buildQueryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(item => searchParams.append(key, String(item)));
        } else {
          searchParams.append(key, String(value));
        }
      }
    });

    return searchParams.toString();
  }

  // Handle API errors consistently
  static handleApiError(error: any): string {
    if (error instanceof Error) {
      return error.message;
    }
    
    if (typeof error === 'string') {
      return error;
    }
    
    if (error?.response?.data?.message) {
      return error.response.data.message;
    }
    
    if (error?.message) {
      return error.message;
    }
    
    return 'An unexpected error occurred';
  }

  // Retry logic for failed API calls
  static async retryOperation<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: any;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        if (attempt === maxRetries) {
          throw error;
        }
        
        // Exponential backoff
        const waitTime = delay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        
        console.warn(`API retry attempt ${attempt + 1} after ${waitTime}ms`);
      }
    }
    
    throw lastError;
  }

  // Parse API response consistently
  static parseApiResponse<T>(response: any): ApiResponse<T> {
    if (response.success !== undefined) {
      return response as ApiResponse<T>;
    }
    
    // Handle different API response formats
    if (response.data !== undefined) {
      return {
        success: true,
        data: response.data,
        message: response.message || 'Success',
      };
    }
    
    // Assume direct data response
    return {
      success: true,
      data: response,
      message: 'Success',
    };
  }

  // Format date for API
  static formatDateForAPI(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toISOString();
  }

  // Parse API date
  static parseAPIDate(dateString: string): Date {
    return new Date(dateString);
  }

  // Sanitize data before sending to API
static deepSanitize(
  data: any,
  seen = new WeakSet(),
  depth = 0,
  maxDepth = 20
): any {
  // Prevent too deep recursion
  if (depth > maxDepth) {
    return undefined;
  }

  // Remove null & undefined
  if (data === null || data === undefined) {
    return undefined;
  }

  // Handle primitive types
  if (
    typeof data === 'number' ||
    typeof data === 'boolean'
  ) {
    return data;
  }

  // Handle strings
  if (typeof data === 'string') {
    const trimmed = data.trim();
    return trimmed === '' ? undefined : trimmed;
  }

  // Handle Date
  if (data instanceof Date) {
    return isNaN(data.getTime()) ? undefined : data;
  }

  // Prevent circular reference
  if (typeof data === 'object') {
    if (seen.has(data)) {
      return undefined;
    }
    seen.add(data);
  }

  // Handle arrays
  if (Array.isArray(data)) {
    const sanitizedArray = data
      .map(item =>
        this.deepSanitize(item, seen, depth + 1, maxDepth)
      )
      .filter(item => item !== undefined);

    return sanitizedArray.length > 0 ? sanitizedArray : undefined;
  }

  // Handle objects
  if (typeof data === 'object') {
    const sanitizedObject: any = {};

    Object.entries(data).forEach(([key, value]) => {
      // Prevent prototype pollution
      if (
        key === '__proto__' ||
        key === 'constructor' ||
        key === 'prototype'
      ) {
        return;
      }

      const sanitizedValue = this.deepSanitize(
        value,
        seen,
        depth + 1,
        maxDepth
      );

      if (sanitizedValue !== undefined) {
        sanitizedObject[key] = sanitizedValue;
      }
    });

    return Object.keys(sanitizedObject).length > 0
      ? sanitizedObject
      : undefined;
  }

  return undefined;
}

  // Check if response indicates authentication error
  static isAuthError(error: any): boolean {
    const status = error?.response?.status || error?.status;
    return status === 401 || status === 403;
  }

  // Check if error is network related
  static isNetworkError(error: any): boolean {
    return !error?.response && (
      error?.code === 'NETWORK_ERROR' ||
      error?.message?.includes('Network') ||
      error?.message?.includes('fetch')
    );
  }

  // Generate request ID for tracking
  static generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Log API request for debugging
  static logApiRequest(method: string, url: string, data?: any): void {
    if (__DEV__) {
      console.log(`🔄 API ${method.toUpperCase()} ${url}`, {
        timestamp: new Date().toISOString(),
        data: data ? JSON.stringify(data, null, 2) : undefined,
      });
    }
  }

  // Log API response for debugging
  static logApiResponse(method: string, url: string, response: any, duration?: number): void {
    if (__DEV__) {
      console.log(`✅ API ${method.toUpperCase()} ${url}`, {
        timestamp: new Date().toISOString(),
        duration: duration ? `${duration}ms` : undefined,
        data: response ? JSON.stringify(response, null, 2) : undefined,
      });
    }
  }

  // Log API error for debugging
  static logApiError(method: string, url: string, error: any, duration?: number): void {
    if (__DEV__) {
      console.error(`❌ API ${method.toUpperCase()} ${url}`, {
        timestamp: new Date().toISOString(),
        duration: duration ? `${duration}ms` : undefined,
        error: error?.message || error,
        status: error?.response?.status,
        data: error?.response?.data,
      });
    }
  }
}

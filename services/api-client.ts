import { ApiResponse } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

declare const window: any;

// Get the appropriate API URL based on platform
const getApiBaseUrl = () => {
  // Production backend
  return 'https://sejasfresh.cloud/api/delivery';
  
  // For local development, uncomment below:
  // if (Platform.OS === 'android') {
  //   return 'http://10.0.2.2:5000/api/delivery';
  // } else if (Platform.OS === 'ios') {
  //   return 'http://localhost:5000/api/delivery';
  // } else {
  //   return 'http://localhost:5000/api/delivery';
  // }
};

const API_CONFIG = {
  DELIVERY_BASE: getApiBaseUrl(),
  TIMEOUT: 15000,
};

console.log('[API Config] Base URL:', API_CONFIG.DELIVERY_BASE);

const STORAGE_KEY = 'delivery_boy_token';

// Helper to get storage (use localStorage on web, AsyncStorage on native)
const getStorage = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return {
        getItem: (key: string) => Promise.resolve(window.localStorage.getItem(key)),
        setItem: (key: string, value: string) => {
          window.localStorage.setItem(key, value);
          return Promise.resolve();
        },
        removeItem: (key: string) => {
          window.localStorage.removeItem(key);
          return Promise.resolve();
        },
      };
    }
  } catch (e) {
    console.warn('localStorage not available');
  }
  return AsyncStorage;
};

const storage = getStorage();

class ApiClient {
  private token: string | null = null;

  async initialize() {
    try {
      this.token = await storage.getItem(STORAGE_KEY);
      console.log('[API Client] Initialized with token:', !!this.token);
    } catch (error) {
      console.error('Failed to initialize API client:', error);
    }
  }

  setToken(token: string) {
    this.token = token;
    console.log('[API Client] Token set:', token.substring(0, 20) + '...');
  }

  getToken(): string | null {
    return this.token;
  }

  async clearToken() {
    this.token = null;
    try {
      await storage.removeItem(STORAGE_KEY);
      console.log('[API Client] Token cleared');
    } catch (error) {
      console.error('Failed to clear token:', error);
    }
  }

  async saveToken(token: string) {
    this.token = token;
    try {
      await storage.setItem(STORAGE_KEY, token);
      console.log('[API Client] Token saved:', token.substring(0, 20) + '...');
    } catch (error) {
      console.error('Failed to save token:', error);
    }
  }

  private getHeaders(includeAuth = true): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
      console.log('[API Client] Including auth token in headers:', this.token.substring(0, 20) + '...');
    } else if (includeAuth && !this.token) {
      console.warn('[API Client] Auth required but no token available!');
    }

    return headers;
  }

  async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: any,
    includeAuth = true
  ): Promise<ApiResponse<T>> {
    const url = `${API_CONFIG.DELIVERY_BASE}${endpoint}`;
    console.log(`[API] ${method} ${endpoint}`, data ? { data } : '');

    try {
      const options: RequestInit = {
        method,
        headers: this.getHeaders(includeAuth),
      };

      if (data && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(data);
      }

      const response = await Promise.race([
        fetch(url, options),
        new Promise<Response>((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout')), API_CONFIG.TIMEOUT)
        ),
      ]);

      const responseData = await response.json();
      console.log(`[API Response] ${method} ${endpoint}:`, { status: response.status, success: response.ok, data: responseData });

      if (!response.ok) {
        // Handle 401 Unauthorized - token might be invalid
        if (response.status === 401) {
          await this.clearToken();
        }

        return {
          success: false,
          message: responseData.message || 'Request failed',
          error: responseData.error,
        };
      }

      return responseData;
    } catch (error: any) {
      console.error(`API Error (${method} ${endpoint}):`, error);
      return {
        success: false,
        message: error.message || 'Network error',
        error: error.toString(),
      };
    }
  }

  async get<T>(endpoint: string, includeAuth = true): Promise<ApiResponse<T>> {
    return this.request<T>('GET', endpoint, undefined, includeAuth);
  }

  async post<T>(endpoint: string, data?: any, includeAuth = true): Promise<ApiResponse<T>> {
    return this.request<T>('POST', endpoint, data, includeAuth);
  }

  async put<T>(endpoint: string, data?: any, includeAuth = true): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', endpoint, data, includeAuth);
  }

  async delete<T>(endpoint: string, includeAuth = true): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', endpoint, undefined, includeAuth);
  }
}

export const apiClient = new ApiClient();

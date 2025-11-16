import {
    ApiResponse,
    AuthResponse,
    DeliveryBoy,
    DeliveryBoyProfile,
    DeliveryStats,
    LocationRequest,
    LoginRequest,
    Order,
    RegisterRequest,
} from '@/types';
import { apiClient } from './api-client';

/**
 * Authentication Services
 */
export const authService = {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<DeliveryBoy>('/register', data, false);
    if (response.success && response.data) {
      const authResponse = response as any as AuthResponse;
      if (authResponse.token) {
        await apiClient.saveToken(authResponse.token);
      }
    }
    return response as AuthResponse;
  },

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<DeliveryBoy>('/login', credentials, false);
    if (response.success && response.data) {
      const authResponse = response as any as AuthResponse;
      if (authResponse.token) {
        await apiClient.saveToken(authResponse.token);
      }
    }
    return response as AuthResponse;
  },

  async logout(): Promise<ApiResponse<null>> {
    const response = await apiClient.post<null>('/logout');
    if (response.success) {
      await apiClient.clearToken();
    }
    return response;
  },

  getToken(): string | null {
    return apiClient.getToken();
  },

  setToken(token: string): void {
    apiClient.setToken(token);
  },

  async clearAuth(): Promise<void> {
    await apiClient.clearToken();
  },
};

/**
 * Profile Services
 */
export const profileService = {
  async getProfile(): Promise<ApiResponse<DeliveryBoyProfile>> {
    return apiClient.get<DeliveryBoyProfile>('/me');
  },

  async updateAvailability(availability: 'available' | 'busy' | 'offline'): Promise<ApiResponse<DeliveryBoy>> {
    return apiClient.put<DeliveryBoy>('/availability', { availability });
  },

  async updateLocation(location: LocationRequest): Promise<ApiResponse<DeliveryBoy>> {
    // Validate location coordinates
    if (location.latitude < -90 || location.latitude > 90) {
      return {
        success: false,
        message: 'Invalid latitude. Must be between -90 and 90',
      };
    }
    if (location.longitude < -180 || location.longitude > 180) {
      return {
        success: false,
        message: 'Invalid longitude. Must be between -180 and 180',
      };
    }

    return apiClient.put<DeliveryBoy>('/location', location);
  },

  async getStats(): Promise<ApiResponse<DeliveryStats>> {
    return apiClient.get<DeliveryStats>('/stats');
  },
};

/**
 * Order Services
 */
export const orderService = {
  async getPendingOrders(): Promise<ApiResponse<Order[]>> {
    return apiClient.get<Order[]>('/orders/pending');
  },

  async getAssignedOrders(): Promise<ApiResponse<Order[]>> {
    return apiClient.get<Order[]>('/orders/assigned');
  },

  async acceptOrder(orderId: string): Promise<ApiResponse<Order>> {
    return apiClient.post<Order>(`/orders/${orderId}/accept`);
  },

  async markOutForDelivery(orderId: string, notes?: string): Promise<ApiResponse<Order>> {
    return apiClient.put<Order>(`/orders/${orderId}/out-for-delivery`, {
      notes: notes || '',
    });
  },

  async markDelivered(orderId: string, notes?: string, otp?: string): Promise<ApiResponse<Order>> {
    return apiClient.put<Order>(`/orders/${orderId}/delivered`, {
      notes: notes || '',
      otp: otp || '',
    });
  },

  async getOrderDetails(orderId: string): Promise<ApiResponse<Order>> {
    return apiClient.get<Order>(`/orders/${orderId}`);
  },
};

/**
 * Real-time location tracking (you can call this periodically)
 */
export const trackingService = {
  startTracking(
    interval: number = 30000,
    onLocationUpdate?: (success: boolean) => void
  ): NodeJS.Timeout {
    return setInterval(async () => {
      try {
        // You would get actual GPS coordinates from device location service
        // For now, this is a placeholder
        // In real app, use Expo.Location or react-native-geolocation-service
        const location = await getDeviceLocation();
        if (location) {
          const response = await profileService.updateLocation(location);
          onLocationUpdate?.(response.success);
        }
      } catch (error) {
        console.error('Tracking error:', error);
        onLocationUpdate?.(false);
      }
    }, interval);
  },

  stopTracking(trackingId: NodeJS.Timeout): void {
    clearInterval(trackingId);
  },
};

/**
 * Helper function to get device location
 * Note: You need to implement actual location retrieval
 */
async function getDeviceLocation(): Promise<LocationRequest | null> {
  // TODO: Integrate with Expo.Location or react-native-geolocation-service
  // For now returning null - you'll implement this separately
  return null;
}

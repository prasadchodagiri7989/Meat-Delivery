import { useEffect, useRef } from 'react';

/**
 * Hook to periodically update location
 */
export const useLocationTracking = (
  enabled: boolean = false,
  interval: number = 30000,
  onLocationUpdate?: (success: boolean) => void
) => {
  const trackingRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled) {
      if (trackingRef.current) {
        clearInterval(trackingRef.current);
        trackingRef.current = null;
      }
      return;
    }

    const startTracking = async () => {
      // TODO: Get actual device location
      // For now, this is a placeholder
      // You need to implement with expo-location or react-native-geolocation-service
      
      // Example implementation:
      // try {
      //   const location = await Location.getCurrentPositionAsync({});
      //   const success = await profileService.updateLocation({
      //     latitude: location.coords.latitude,
      //     longitude: location.coords.longitude,
      //   });
      //   onLocationUpdate?.(success.success);
      // } catch (error) {
      //   console.error('Location error:', error);
      //   onLocationUpdate?.(false);
      // }
    };

    // Call immediately, then set interval
    startTracking();
    trackingRef.current = setInterval(startTracking, interval);

    return () => {
      if (trackingRef.current) {
        clearInterval(trackingRef.current);
      }
    };
  }, [enabled, interval, onLocationUpdate]);

  const stopTracking = () => {
    if (trackingRef.current) {
      clearInterval(trackingRef.current);
      trackingRef.current = null;
    }
  };

  return { stopTracking };
};

/**
 * Hook to periodically refresh orders
 */
export const useOrderRefresh = (
  enabled: boolean = false,
  interval: number = 30000,
  onRefresh?: () => Promise<void>
) => {
  const refreshRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled || !onRefresh) return;

    const refresh = async () => {
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh error:', error);
      }
    };

    // Call immediately, then set interval
    refresh();
    refreshRef.current = setInterval(refresh, interval);

    return () => {
      if (refreshRef.current) {
        clearInterval(refreshRef.current);
      }
    };
  }, [enabled, interval, onRefresh]);

  const stopRefresh = () => {
    if (refreshRef.current) {
      clearInterval(refreshRef.current);
      refreshRef.current = null;
    }
  };

  return { stopRefresh };
};

/**
 * Hook for debouncing API calls
 */
export const useDebounce = <T>(value: T, delay: number = 500) => {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

// Import React for useDebounce
import React from 'react';

import { authService, profileService } from '@/services';
import { apiClient } from '@/services/api-client';
import { DeliveryBoy, DeliveryBoyProfile } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: DeliveryBoy | null;
  profile: DeliveryBoyProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  register: (data: any) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;

  fetchProfile: () => Promise<void>;
  updateAvailability: (status: 'available' | 'busy' | 'offline') => Promise<boolean>;
  updateLocation: (latitude: number, longitude: number) => Promise<boolean>;

  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<DeliveryBoy | null>(null);
  const [profile, setProfile] = useState<DeliveryBoyProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /** 🔄 Load stored token & user on app startup */
  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);

        const savedToken = await AsyncStorage.getItem("delivery_boy_token");
        console.log("Loaded token:", savedToken);

        if (savedToken) {
          setToken(savedToken);
          authService.setToken(savedToken);

          const profileResp = await profileService.getProfile();

          if (profileResp.success && (profileResp.data || profileResp.user)) {
            const userData = profileResp.data ?? profileResp.user;
            setProfile(profileResp.data ?? null);
            setUser(userData);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  /** 🟢 REGISTER */
  const register = async (data: any): Promise<boolean> => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await authService.register(data);
      console.log("REGISTER RESPONSE:", response);

      const userData = response.data ?? response.user;

      if (response.success && userData) {
        setUser(userData);

        if (response.token) {
          setToken(response.token);
          await apiClient.saveToken(response.token);
        }

        return true;
      }

      setError(response.message || "Registration failed");
      return false;
    } catch (e: any) {
      setError(e.message || "Registration failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /** 🟢 LOGIN */
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await authService.login({ email, password });
      console.log("LOGIN RESPONSE:", response);

      const userData = response.data ?? response.user;

      if (response.success && userData) {
        setUser(userData);

        if (response.token) {
          setToken(response.token);
          await apiClient.saveToken(response.token);
        }

        return true;
      }

      setError(response.message || "Login failed");
      return false;
    } catch (err: any) {
      setError(err.message || "Login failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /** 🚪 LOGOUT */
  const logout = async () => {
    await authService.logout();
    setUser(null);
    setProfile(null);
    setToken(null);
  };

  /** 👤 FETCH PROFILE */
  const fetchProfile = async () => {
    const response = await profileService.getProfile();
    if (response.success && (response.data || response.user)) {
      const userData = response.data ?? response.user;
      setUser(userData);
      setProfile(response.data ?? null);
    }
  };

  /** 🟢 UPDATE AVAILABILITY */
  const updateAvailability = async (status: 'available' | 'busy' | 'offline') => {
    const response = await profileService.updateAvailability(status);
    if (response.success && response.data) {
      setUser(response.data);
      return true;
    }
    return false;
  };

  /** 📍 UPDATE LOCATION */
  const updateLocation = async (lat: number, lng: number) => {
    const resp = await profileService.updateLocation({ latitude: lat, longitude: lng });
    return resp.success;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        error,
        register,
        login,
        logout,
        fetchProfile,
        updateAvailability,
        updateLocation,
        clearError: () => setError(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DeliveryBoyProfile } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

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

const API_BASE_URL = getApiBaseUrl();
const STORAGE_KEY = 'delivery_boy_token';

// Helper to get storage
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
  } catch {
    console.warn('localStorage not available');
  }
  return AsyncStorage;
};

const storage = getStorage();

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  
  const [profile, setProfile] = useState<DeliveryBoyProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch profile data
  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get token from storage
      const token = await storage.getItem(STORAGE_KEY);
      
      if (!token) {
        setError('No authentication token found');
        setIsLoading(false);
        return;
      }
      
      console.log('🔄 Fetching profile...');
      
      const response = await fetch(`${API_BASE_URL}/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json() as any;
      console.log('📦 Profile response:', JSON.stringify(data, null, 2));
      
      if (response.ok && data.success) {
        // API returns profile in 'message' field, not 'data'
        const profileData = data.message || data.data;
        if (profileData) {
          setProfile(profileData);
        } else {
          setError('No profile data received');
        }
      } else {
        setError(data.data || data.message || 'Failed to load profile');
      }
    } catch (err: any) {
      console.error('❌ Profile fetch error:', err);
      setError(err.message || 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch profile on component mount (for web)
  useEffect(() => {
    console.log('📱 Profile component mounted - fetching profile...');
    fetchProfile();
  }, [fetchProfile]);

  // Fetch profile when screen comes into focus (for mobile navigation)
  useFocusEffect(
    useCallback(() => {
      console.log('📱 Profile screen focused - fetching profile...');
      fetchProfile();
    }, [fetchProfile])
  );
  
  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', onPress: () => {}, style: 'cancel' },
      {
        text: 'Logout',
        onPress: async () => {
          try {
            // Get token for logout API call
            const token = await storage.getItem(STORAGE_KEY);
            
            if (token) {
              // Call logout API
              await fetch(`${API_BASE_URL}/logout`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                },
              });
            }
            
            // Clear token from storage
            await storage.removeItem(STORAGE_KEY);
            
            // Clear profile state
            setProfile(null);
            
            // Navigate to login page
            router.replace('/login');
            
            Alert.alert('Success', 'You have been logged out successfully');
          } catch (error: any) {
            console.error('Logout error:', error);
            // Even if API fails, clear local storage and navigate
            await storage.removeItem(STORAGE_KEY);
            setProfile(null);
            router.replace('/login');
          }
        },
        style: 'destructive',
      },
    ]);
  };

  // Loading state
  if (isLoading) {
    return (
      <ThemedView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#10B981" />
        <ThemedText style={styles.loadingText}>Loading profile...</ThemedText>
      </ThemedView>
    );
  }

  // Error state
  if (error || !profile) {
    return (
      <ThemedView style={[styles.container, styles.centerContent]}>
        <ThemedText style={styles.errorText}>❌ {error || 'Failed to load profile'}</ThemedText>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchProfile}
        >
          <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerSection}>
          <View style={[styles.avatarContainer, { backgroundColor: isDark ? '#1E3A3A' : '#E3F2FD' }]}>
            <ThemedText style={styles.avatar}>👨‍💼</ThemedText>
          </View>
          <ThemedText type="title" style={styles.nameText}>
            {profile.name || `${profile.firstName} ${profile.lastName}`}
          </ThemedText>
          <ThemedText style={styles.joinDateText}>
            Member since {profile.joinDate ? new Date(profile.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
          </ThemedText>
        </View>

        <ThemedView style={[styles.section, { backgroundColor: isDark ? '#1F2937' : '#F9FAFB' }]}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            📋 Personal Information
          </ThemedText>

          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Name</ThemedText>
            <ThemedText style={styles.infoValue}>{profile.name || `${profile.firstName} ${profile.lastName}`}</ThemedText>
          </View>

          <View style={[styles.infoRow, styles.borderTop]}>
            <ThemedText style={styles.infoLabel}>Email</ThemedText>
            <ThemedText style={[styles.infoValue, { color: '#0a7ea4' }]}>
              {profile.email}
            </ThemedText>
          </View>

          <View style={[styles.infoRow, styles.borderTop]}>
            <ThemedText style={styles.infoLabel}>Phone</ThemedText>
            <ThemedText style={styles.infoValue}>{profile.phone}</ThemedText>
          </View>

          <View style={[styles.infoRow, styles.borderTop]}>
            <ThemedText style={styles.infoLabel}>Address</ThemedText>
            <ThemedText style={[styles.infoValue, styles.multilineText]}>
              {profile.fullAddress || profile.address}
            </ThemedText>
          </View>

          <View style={[styles.infoRow, styles.borderTop]}>
            <ThemedText style={styles.infoLabel}>City</ThemedText>
            <ThemedText style={styles.infoValue}>{profile.city}</ThemedText>
          </View>

          <View style={[styles.infoRow, styles.borderTop]}>
            <ThemedText style={styles.infoLabel}>State</ThemedText>
            <ThemedText style={styles.infoValue}>{profile.state}</ThemedText>
          </View>

          <View style={[styles.infoRow, styles.borderTop]}>
            <ThemedText style={styles.infoLabel}>Zip Code</ThemedText>
            <ThemedText style={styles.infoValue}>{profile.zipCode}</ThemedText>
          </View>
        </ThemedView>

        <ThemedView style={[styles.section, { backgroundColor: isDark ? '#1F2937' : '#F9FAFB' }]}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            📊 Performance Stats
          </ThemedText>

          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Total Deliveries</ThemedText>
            <ThemedText style={[styles.infoValue, { color: '#10B981', fontWeight: '700' }]}>{profile.totalDeliveries}</ThemedText>
          </View>

          <View style={[styles.infoRow, styles.borderTop]}>
            <ThemedText style={styles.infoLabel}>Completed</ThemedText>
            <ThemedText style={styles.infoValue}>{profile.completedDeliveries}</ThemedText>
          </View>

          <View style={[styles.infoRow, styles.borderTop]}>
            <ThemedText style={styles.infoLabel}>Total Earnings</ThemedText>
            <ThemedText style={[styles.infoValue, { color: '#10B981', fontWeight: '700' }]}>₹{profile.totalEarnings?.toFixed(2)}</ThemedText>
          </View>

          <View style={[styles.infoRow, styles.borderTop]}>
            <ThemedText style={styles.infoLabel}>Average Rating</ThemedText>
            <ThemedText style={styles.infoValue}>⭐ {profile.averageRating?.toFixed(1)}</ThemedText>
          </View>

          <View style={[styles.infoRow, styles.borderTop]}>
            <ThemedText style={styles.infoLabel}>Completion Rate</ThemedText>
            <ThemedText style={styles.infoValue}>{profile.completionRate}%</ThemedText>
          </View>

          <View style={[styles.infoRow, styles.borderTop]}>
            <ThemedText style={styles.infoLabel}>Avg Delivery Time</ThemedText>
            <ThemedText style={styles.infoValue}>{profile.averageDeliveryTime} min</ThemedText>
          </View>
        </ThemedView>

        <ThemedView style={[styles.section, { backgroundColor: isDark ? '#1F2937' : '#F9FAFB' }]}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            🚗 Vehicle Information
          </ThemedText>

          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Vehicle Type</ThemedText>
            <ThemedText style={styles.infoValue}>{profile.vehicleType}</ThemedText>
          </View>

          <View style={[styles.infoRow, styles.borderTop]}>
            <ThemedText style={styles.infoLabel}>Vehicle Model</ThemedText>
            <ThemedText style={styles.infoValue}>{profile.vehicleModel}</ThemedText>
          </View>

          <View style={[styles.infoRow, styles.borderTop]}>
            <ThemedText style={styles.infoLabel}>Vehicle Number</ThemedText>
            <ThemedText style={styles.infoValue}>{profile.vehicleNumber}</ThemedText>
          </View>

          <View style={[styles.infoRow, styles.borderTop]}>
            <ThemedText style={styles.infoLabel}>License Number</ThemedText>
            <ThemedText style={styles.infoValue}>{profile.licenseNumber}</ThemedText>
          </View>

          <View style={[styles.infoRow, styles.borderTop]}>
            <ThemedText style={styles.infoLabel}>License Expiry</ThemedText>
            <ThemedText style={styles.infoValue}>
              {profile.licenseExpiry ? new Date(profile.licenseExpiry).toLocaleDateString() : 'N/A'}
            </ThemedText>
          </View>
        </ThemedView>

        <ThemedView style={[styles.section, { backgroundColor: isDark ? '#1F2937' : '#F9FAFB' }]}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            🏦 Bank Information
          </ThemedText>

          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Account Holder</ThemedText>
            <ThemedText style={styles.infoValue}>{profile.accountHolder}</ThemedText>
          </View>

          <View style={[styles.infoRow, styles.borderTop]}>
            <ThemedText style={styles.infoLabel}>Bank Name</ThemedText>
            <ThemedText style={styles.infoValue}>{profile.bankName}</ThemedText>
          </View>

          <View style={[styles.infoRow, styles.borderTop]}>
            <ThemedText style={styles.infoLabel}>Account Number</ThemedText>
            <ThemedText style={styles.infoValue}>{profile.bankAccount}</ThemedText>
          </View>

          <View style={[styles.infoRow, styles.borderTop]}>
            <ThemedText style={styles.infoLabel}>IFSC Code</ThemedText>
            <ThemedText style={styles.infoValue}>{profile.ifscCode}</ThemedText>
          </View>
        </ThemedView>

        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: isDark ? '#4B0000' : '#FFEBEE' }]}
          onPress={handleLogout}
        >
          <ThemedText style={[styles.logoutButtonText, { color: isDark ? '#FF6B6B' : '#D32F2F' }]}>
            🚪 Logout
          </ThemedText>
        </TouchableOpacity>

        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>
            Version 1.0.0
          </ThemedText>
          <ThemedText style={styles.footerText}>
            © 2025 Delivery Boy App. All rights reserved.
          </ThemedText>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    marginTop: 12,
    opacity: 0.7,
  },
  errorText: {
    fontSize: 16,
    color: '#DC2626',
    marginBottom: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  retryButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatar: {
    fontSize: 50,
  },
  nameText: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  joinDateText: {
    fontSize: 13,
    opacity: 0.6,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    minWidth: 160,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    opacity: 0.6,
    textAlign: 'center',
  },
  quickActionsSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  quickActionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    gap: 4,
  },
  callButton: {
    backgroundColor: '#E3F2FD',
  },
  emailButton: {
    backgroundColor: '#FFF3E0',
  },
  editButton: {
    backgroundColor: '#E8F5E9',
  },
  quickActionIcon: {
    fontSize: 20,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 14,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.08)',
  },
  infoLabel: {
    fontSize: 13,
    opacity: 0.7,
    fontWeight: '500',
    flex: 0.4,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    flex: 0.6,
    textAlign: 'right',
  },
  multilineText: {
    textAlign: 'right',
    flexWrap: 'wrap',
  },
  logoutButton: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.08)',
  },
  footerText: {
    fontSize: 12,
    opacity: 0.5,
    marginVertical: 2,
  },
  bottomPadding: {
    height: 20,
  },
});

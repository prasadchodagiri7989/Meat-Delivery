import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/auth-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Linking,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { user, profile, logout, isLoading, fetchProfile, updateAvailability } = useAuth();
  const [availability, setAvailability] = useState<'available' | 'busy' | 'offline'>(
    profile?.availability || 'offline'
  );
  const [isUpdatingAvailability, setIsUpdatingAvailability] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  useEffect(() => {
    if (profile?.availability) {
      setAvailability(profile.availability);
    }
  }, [profile?.availability]);

  const handleCall = () => {
    if (user?.phone) {
      Linking.openURL(`tel:${user.phone}`);
    }
  };

  const handleEmail = () => {
    if (user?.email) {
      Linking.openURL(`mailto:${user.email}`);
    }
  };

  const handleAvailabilityChange = async (newStatus: 'available' | 'busy' | 'offline') => {
    try {
      setIsUpdatingAvailability(true);
      const success = await updateAvailability(newStatus);
      if (success) {
        setAvailability(newStatus);
        Alert.alert('Success', `Status updated to ${newStatus}`);
      } else {
        Alert.alert('Error', 'Failed to update availability status');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to update availability');
      console.error('Availability update error:', err);
    } finally {
      setIsUpdatingAvailability(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', onPress: () => {}, style: 'cancel' },
      {
        text: 'Logout',
        onPress: async () => {
          try {
            await logout();
            // Auth state will change and root layout will navigate to login
          } catch (err) {
            Alert.alert('Error', 'Failed to logout');
            console.error('Logout error:', err);
          }
        },
        style: 'destructive',
      },
    ]);
  };

  if (isLoading) {
    return (
      <ThemedView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={isDark ? '#fff' : '#000'} />
        <ThemedText style={{ marginTop: 12 }}>Loading profile...</ThemedText>
      </ThemedView>
    );
  }

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'available':
        return { bg: '#E8F5E9', text: '#2E7D32', dot: '#4CAF50' };
      case 'busy':
        return { bg: '#FFF3E0', text: '#F57C00', dot: '#FF9800' };
      case 'offline':
        return { bg: '#F3F4F6', text: '#6B7280', dot: '#9CA3AF' };
      default:
        return { bg: '#F3F4F6', text: '#6B7280', dot: '#9CA3AF' };
    }
  };

  const availabilityColor = getAvailabilityColor(availability);

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Header */}
        <View style={styles.headerSection}>
          <View
            style={[
              styles.avatarContainer,
              { backgroundColor: isDark ? '#1E3A3A' : '#E3F2FD' },
            ]}
          >
            <ThemedText style={styles.avatar}>👨‍💼</ThemedText>
          </View>
          <ThemedText type="title" style={styles.nameText}>
            {user?.firstName} {user?.lastName}
          </ThemedText>
          <ThemedText style={styles.emailText}>{user?.email}</ThemedText>
        </View>

        {/* Availability Status */}
        <View
          style={[
            styles.availabilityCard,
            {
              backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5',
              borderColor: availabilityColor.dot,
            },
          ]}
        >
          <View style={styles.availabilityHeader}>
            <View style={styles.availabilityStatus}>
              <View
                style={[styles.statusDot, { backgroundColor: availabilityColor.dot }]}
              />
              <ThemedText style={styles.availabilityLabel}>
                Status: {availability.charAt(0).toUpperCase() + availability.slice(1)}
              </ThemedText>
            </View>
          </View>

          <View style={styles.availabilityButtons}>
            {(['available', 'busy', 'offline'] as const).map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.availabilityButton,
                  {
                    backgroundColor:
                      availability === status
                        ? getAvailabilityColor(status).bg
                        : isDark
                        ? '#1a1a1a'
                        : '#fff',
                    borderColor:
                      availability === status
                        ? getAvailabilityColor(status).dot
                        : isDark
                        ? '#444'
                        : '#ddd',
                  },
                ]}
                onPress={() => handleAvailabilityChange(status)}
                disabled={isUpdatingAvailability}
              >
                {isUpdatingAvailability && availability === status ? (
                  <ActivityIndicator size="small" color={getAvailabilityColor(status).text} />
                ) : (
                  <ThemedText
                    style={[
                      styles.availabilityButtonText,
                      {
                        color:
                          availability === status
                            ? getAvailabilityColor(status).text
                            : isDark
                            ? '#fff'
                            : '#000',
                      },
                    ]}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </ThemedText>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Contact Information */}
        {(user?.phone || user?.email) && (
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              📞 Contact Information
            </ThemedText>

            {user?.phone && (
              <TouchableOpacity
                style={[
                  styles.infoCard,
                  { backgroundColor: isDark ? '#1F2937' : '#F9FAFB' },
                ]}
                onPress={handleCall}
              >
                <View style={styles.infoIcon}>
                  <ThemedText style={styles.iconText}>☎️</ThemedText>
                </View>
                <View style={styles.infoContent}>
                  <ThemedText style={styles.infoLabel}>Phone</ThemedText>
                  <ThemedText style={styles.infoValue}>{user.phone}</ThemedText>
                </View>
              </TouchableOpacity>
            )}

            {user?.email && (
              <TouchableOpacity
                style={[
                  styles.infoCard,
                  { backgroundColor: isDark ? '#1F2937' : '#F9FAFB' },
                ]}
                onPress={handleEmail}
              >
                <View style={styles.infoIcon}>
                  <ThemedText style={styles.iconText}>✉️</ThemedText>
                </View>
                <View style={styles.infoContent}>
                  <ThemedText style={styles.infoLabel}>Email</ThemedText>
                  <ThemedText style={styles.infoValue}>{user.email}</ThemedText>
                </View>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Address Information */}
        {profile?.address && (
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              📍 Address Information
            </ThemedText>
            <View
              style={[
                styles.infoCard,
                { backgroundColor: isDark ? '#1F2937' : '#F9FAFB' },
              ]}
            >
              <View style={styles.infoIcon}>
                <ThemedText style={styles.iconText}>🏠</ThemedText>
              </View>
              <View style={styles.infoContent}>
                <ThemedText style={styles.infoLabel}>Address</ThemedText>
                <ThemedText style={styles.infoValue}>{profile.address}</ThemedText>
              </View>
            </View>
          </View>
        )}

        {/* Vehicle Information */}
        {(profile?.vehicleType || profile?.vehicleNumber) && (
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              🚗 Vehicle Information
            </ThemedText>
            {profile?.vehicleType && (
              <View
                style={[
                  styles.infoCard,
                  { backgroundColor: isDark ? '#1F2937' : '#F9FAFB' },
                ]}
              >
                <View style={styles.infoIcon}>
                  <ThemedText style={styles.iconText}>🚙</ThemedText>
                </View>
                <View style={styles.infoContent}>
                  <ThemedText style={styles.infoLabel}>Vehicle Type</ThemedText>
                  <ThemedText style={styles.infoValue}>{profile.vehicleType}</ThemedText>
                </View>
              </View>
            )}
            {profile?.vehicleNumber && (
              <View
                style={[
                  styles.infoCard,
                  { backgroundColor: isDark ? '#1F2937' : '#F9FAFB' },
                ]}
              >
                <View style={styles.infoIcon}>
                  <ThemedText style={styles.iconText}>📋</ThemedText>
                </View>
                <View style={styles.infoContent}>
                  <ThemedText style={styles.infoLabel}>Vehicle Number</ThemedText>
                  <ThemedText style={styles.infoValue}>{profile.vehicleNumber}</ThemedText>
                </View>
              </View>
            )}
          </View>
        )}

        {/* License Information */}
        {profile?.licenseNumber && (
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              🎫 License Information
            </ThemedText>
            <View
              style={[
                styles.infoCard,
                { backgroundColor: isDark ? '#1F2937' : '#F9FAFB' },
              ]}
            >
              <View style={styles.infoIcon}>
                <ThemedText style={styles.iconText}>🆔</ThemedText>
              </View>
              <View style={styles.infoContent}>
                <ThemedText style={styles.infoLabel}>License Number</ThemedText>
                <ThemedText style={styles.infoValue}>{profile.licenseNumber}</ThemedText>
              </View>
            </View>
          </View>
        )}

        {/* Bank Information */}
        {(profile?.bankName || profile?.accountNumber) && (
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              🏦 Bank Information
            </ThemedText>
            {profile?.bankName && (
              <View
                style={[
                  styles.infoCard,
                  { backgroundColor: isDark ? '#1F2937' : '#F9FAFB' },
                ]}
              >
                <View style={styles.infoIcon}>
                  <ThemedText style={styles.iconText}>🏪</ThemedText>
                </View>
                <View style={styles.infoContent}>
                  <ThemedText style={styles.infoLabel}>Bank Name</ThemedText>
                  <ThemedText style={styles.infoValue}>{profile.bankName}</ThemedText>
                </View>
              </View>
            )}
            {profile?.accountNumber && (
              <View
                style={[
                  styles.infoCard,
                  { backgroundColor: isDark ? '#1F2937' : '#F9FAFB' },
                ]}
              >
                <View style={styles.infoIcon}>
                  <ThemedText style={styles.iconText}>💳</ThemedText>
                </View>
                <View style={styles.infoContent}>
                  <ThemedText style={styles.infoLabel}>Account Number</ThemedText>
                  <ThemedText style={styles.infoValue}>****{profile.accountNumber.slice(-4)}</ThemedText>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Logout Button */}
        <TouchableOpacity
          style={[styles.logoutButton]}
          onPress={handleLogout}
        >
          <ThemedText style={styles.logoutButtonText}>🚪 Logout</ThemedText>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
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
  scrollContent: {
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    fontSize: 48,
  },
  nameText: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  emailText: {
    fontSize: 14,
    opacity: 0.6,
  },
  availabilityCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 2,
  },
  availabilityHeader: {
    marginBottom: 12,
  },
  availabilityStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  availabilityLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  availabilityButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  availabilityButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
  },
  availabilityButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  infoCard: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    alignItems: 'center',
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 20,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    opacity: 0.6,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

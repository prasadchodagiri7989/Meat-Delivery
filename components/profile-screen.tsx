
import { useAuth } from '@/context/auth-context';
import { useOrders } from '@/context/order-context';
import { useEffect, useState } from 'react';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { user, profile, isLoading, logout, updateAvailability } = useAuth();
  const { stats, fetchStats } = useOrders();
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  if (isLoading) {
    return (
      <ThemedView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={isDark ? '#fff' : '#000'} />
      </ThemedView>
    );
  }

  if (!user || !profile) {
    return (
      <ThemedView style={[styles.container, styles.center]}>
        <ThemedText type="title">Not Logged In</ThemedText>
        <ThemedText style={styles.subtitle}>Please login to view profile</ThemedText>
      </ThemedView>
    );
  }

  const handleToggleAvailability = async () => {
    const currentStatus = user.availability;
    const newStatus = currentStatus === 'available' ? 'offline' : 'available';

    setIsUpdating(true);
    const success = await updateAvailability(newStatus);
    setIsUpdating(false);

    if (success) {
      Alert.alert(
        'Success',
        `You are now ${newStatus}`
      );
    } else {
      Alert.alert('Error', 'Failed to update availability');
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Logout',
        onPress: async () => {
          await logout();
          // Navigation will be handled by auth state change
        },
        style: 'destructive',
      },
    ]);
  };

  const availabilityColor =
    user.availability === 'available'
      ? '#2E7D32'
      : user.availability === 'busy'
      ? '#F57C00'
      : '#9E9E9E';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <ThemedView style={[styles.header, { backgroundColor: isDark ? '#1A1A1A' : '#F5F5F5' }]}>
        <View style={styles.avatarPlaceholder}>
          <ThemedText style={styles.avatarText}>
            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
          </ThemedText>
        </View>

        <View style={styles.headerInfo}>
          <ThemedText type="subtitle">
            {user.firstName} {user.lastName}
          </ThemedText>
          <ThemedText style={styles.email}>{user.email}</ThemedText>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusIndicator,
                { backgroundColor: availabilityColor },
              ]}
            />
            <ThemedText style={styles.statusText}>
              {user.availability.toUpperCase()}
            </ThemedText>
          </View>
        </View>
      </ThemedView>

      {/* Quick Stats */}
      {stats && (
        <View style={styles.statsGrid}>
          <ThemedView style={[styles.statCard, { backgroundColor: isDark ? '#1E3A3A' : '#E3F2FD' }]}>
            <ThemedText type="subtitle" style={styles.statNumber}>
              {stats.totalDeliveries}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Total Deliveries</ThemedText>
          </ThemedView>

          <ThemedView style={[styles.statCard, { backgroundColor: isDark ? '#1E3A1E' : '#E8F5E9' }]}>
            <ThemedText type="subtitle" style={[styles.statNumber, { color: '#2E7D32' }]}>
              {stats.completedDeliveries}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Completed</ThemedText>
          </ThemedView>

          <ThemedView style={[styles.statCard, { backgroundColor: isDark ? '#3A2E1E' : '#FFF3E0' }]}>
            <ThemedText type="subtitle" style={[styles.statNumber, { color: '#F57C00' }]}>
              ⭐ {stats.rating}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Rating</ThemedText>
          </ThemedView>
        </View>
      )}

      {/* Personal Information */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Personal Information
        </ThemedText>

        <View style={styles.infoRow}>
          <ThemedText style={styles.label}>Full Name</ThemedText>
          <ThemedText style={styles.value}>
            {user.firstName} {user.lastName}
          </ThemedText>
        </View>

        <View style={[styles.infoRow, styles.borderTop]}>
          <ThemedText style={styles.label}>Email</ThemedText>
          <ThemedText style={styles.value}>{user.email}</ThemedText>
        </View>

        <View style={[styles.infoRow, styles.borderTop]}>
          <ThemedText style={styles.label}>Phone</ThemedText>
          <ThemedText style={styles.value}>{user.phone}</ThemedText>
        </View>
      </ThemedView>

      {/* License Information */}
      {profile.license && (
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            License Information
          </ThemedText>

          <View style={styles.infoRow}>
            <ThemedText style={styles.label}>License Number</ThemedText>
            <ThemedText style={styles.value}>{profile.license.number}</ThemedText>
          </View>

          <View style={[styles.infoRow, styles.borderTop]}>
            <ThemedText style={styles.label}>Expiry Date</ThemedText>
            <ThemedText style={styles.value}>{profile.license.expiryDate}</ThemedText>
          </View>
        </ThemedView>
      )}

      {/* Vehicle Information */}
      {profile.vehicle && (
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Vehicle Information
          </ThemedText>

          <View style={styles.infoRow}>
            <ThemedText style={styles.label}>Vehicle Type</ThemedText>
            <ThemedText style={styles.value}>
              {profile.vehicle.type.toUpperCase()}
            </ThemedText>
          </View>

          <View style={[styles.infoRow, styles.borderTop]}>
            <ThemedText style={styles.label}>Registration</ThemedText>
            <ThemedText style={styles.value}>
              {profile.vehicle.registrationNumber}
            </ThemedText>
          </View>

          <View style={[styles.infoRow, styles.borderTop]}>
            <ThemedText style={styles.label}>Model</ThemedText>
            <ThemedText style={styles.value}>{profile.vehicle.model}</ThemedText>
          </View>
        </ThemedView>
      )}

      {/* Account Actions */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Account
        </ThemedText>

        <View style={[styles.button, { backgroundColor: isDark ? '#1E3A3A' : '#E3F2FD' }]}>
          <ThemedText
            style={[styles.buttonText, { color: isDark ? '#4DD0E1' : '#1976D2' }]}
            onPress={handleToggleAvailability}
            disabled={isUpdating}
          >
            {isUpdating ? 'Updating...' : `Set as ${user.availability === 'available' ? 'Offline' : 'Available'}`}
          </ThemedText>
        </View>

        <View style={[styles.button, { backgroundColor: '#FFEBEE', marginTop: 12 }]}>
          <ThemedText
            style={[styles.buttonText, { color: '#D32F2F' }]}
            onPress={handleLogout}
          >
            Logout
          </ThemedText>
        </View>
      </ThemedView>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
    gap: 16,
  },
  avatarPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#1976D2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
  },
  headerInfo: {
    flex: 1,
  },
  email: {
    fontSize: 13,
    opacity: 0.6,
    marginTop: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    textAlign: 'center',
    opacity: 0.8,
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    marginBottom: 12,
    fontSize: 16,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  label: {
    fontSize: 13,
    opacity: 0.7,
  },
  value: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'right',
    flex: 1,
    marginLeft: 8,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 14,
  },
  subtitle: {
    marginTop: 8,
    opacity: 0.7,
  },
  bottomPadding: {
    height: 20,
  },
});

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/auth-context';
import { useOrders } from '@/context/order-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

// Filter active orders only
const activeOrders = orders.filter((o) => o.status === 'Active');

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { user } = useAuth();
  const { stats, assignedOrders, fetchStats, refreshAll } = useOrders();
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        await fetchStats();
        await refreshAll();
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadData();
    }
  }, [user]);

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshAll();
      await fetchStats();
    } catch (error) {
      Alert.alert('Error', 'Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <ThemedView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={isDark ? '#fff' : '#000'} />
        <ThemedText style={{ marginTop: 12 }}>Loading dashboard...</ThemedText>
      </ThemedView>
    );
  }

  // Show not logged in
  if (!user) {
    return (
      <ThemedView style={[styles.container, styles.centerContent]}>
        <ThemedText type="title">Please login to view dashboard</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
    >
      <ThemedView style={styles.header}>
        <ThemedText type="title">Dashboard</ThemedText>
        <ThemedText style={styles.subtitle}>
          Welcome, {user.firstName}! Your Delivery Analytics
        </ThemedText>
      </ThemedView>

      {/* Stats Row 1 */}
      <View style={styles.statsGrid}>
        <ThemedView style={[styles.statCard, { backgroundColor: isDark ? '#1E3A3A' : '#E3F2FD' }]}>
          <ThemedText type="subtitle" style={styles.statNumber}>
            {stats?.totalDeliveries || 0}
          </ThemedText>
          <ThemedText style={styles.statLabel}>Total Orders</ThemedText>
        </ThemedView>

        <ThemedView style={[styles.statCard, { backgroundColor: isDark ? '#1E3A1E' : '#E8F5E9' }]}>
          <ThemedText type="subtitle" style={[styles.statNumber, { color: '#2E7D32' }]}>
            ₹{(stats?.totalDeliveries || 0) * 150}
          </ThemedText>
          <ThemedText style={styles.statLabel}>Est. Earnings</ThemedText>
        </ThemedView>
      </View>

      {/* Stats Row 2 */}
      <View style={styles.statsGrid}>
        <ThemedView style={[styles.statCard, { backgroundColor: isDark ? '#3A1E1E' : '#FFEBEE' }]}>
          <ThemedText type="subtitle" style={[styles.statNumber, { color: '#D32F2F' }]}>
            {assignedOrders.length}
          </ThemedText>
          <ThemedText style={styles.statLabel}>Active Orders</ThemedText>
        </ThemedView>

        <ThemedView style={[styles.statCard, { backgroundColor: isDark ? '#3A3A1E' : '#FFF3E0' }]}>
          <ThemedText type="subtitle" style={[styles.statNumber, { color: '#F57C00' }]}>
            {stats?.completedDeliveries || 0}
          </ThemedText>
          <ThemedText style={styles.statLabel}>Completed</ThemedText>
        </ThemedView>
      </View>

      {/* Active Orders List */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Performance Metrics</ThemedText>

        <View style={styles.metricRow}>
          <ThemedText style={styles.metricLabel}>Completion Rate</ThemedText>
          <ThemedText style={styles.metricValue}>
            {stats?.totalDeliveries
              ? Math.round(
                  ((stats.completedDeliveries || 0) / stats.totalDeliveries) * 100
                )
              : 0}
            %
          </ThemedText>
        </View>

        <View style={[styles.metricRow, styles.borderTop]}>
          <ThemedText style={styles.metricLabel}>Average Rating</ThemedText>
          <ThemedText style={[styles.metricValue, { color: '#FFB300' }]}>
            ⭐ {(stats?.rating || 0).toFixed(1)}
          </ThemedText>
        </View>

        <View style={[styles.metricRow, styles.borderTop]}>
          <ThemedText style={styles.metricLabel}>Avg. Delivery Time</ThemedText>
          <ThemedText style={styles.metricValue}>
            {stats?.averageDeliveryTime || 0} min
          </ThemedText>
        </View>
      </ThemedView>

      {/* Active Deliveries */}
      {assignedOrders.length > 0 && (
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">Active Deliveries ({assignedOrders.length})</ThemedText>

          {assignedOrders.slice(0, 3).map((delivery) => (
            <View key={delivery._id} style={styles.deliveryItem}>
              <View style={styles.deliveryInfo}>
                <ThemedText style={styles.deliveryLocation}>
                  📍 {delivery.deliveryAddress.street}
                </ThemedText>
                <ThemedText style={styles.deliveryTime}>
                  Order: {delivery.orderNumber}
                </ThemedText>
              </View>
              <ThemedView
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      delivery.status === 'delivered'
                        ? isDark
                          ? '#1E3A1E'
                          : '#E8F5E9'
                        : isDark
                        ? '#3A2E1E'
                        : '#FFF3E0',
                  },
                ]}
              >
                <ThemedText
                  style={[
                    styles.statusText,
                    {
                      color:
                        delivery.status === 'delivered'
                          ? '#2E7D32'
                          : '#F57C00',
                    },
                  ]}
                >
                  {delivery.status === 'out-for-delivery'
                    ? '🚚 In Progress'
                    : '✓ ' + delivery.status}
                </ThemedText>
              </ThemedView>
            </View>
          ))}

          {assignedOrders.length > 3 && (
            <ThemedText style={{ marginTop: 8, opacity: 0.7 }}>
              +{assignedOrders.length - 3} more delivery(ies)
            </ThemedText>
          )}
        </ThemedView>
      )}

      {assignedOrders.length === 0 && (
        <ThemedView style={[styles.section, styles.centerContent]}>
          <ThemedText style={{ fontSize: 16, opacity: 0.6 }}>
            No active deliveries
          </ThemedText>
          <ThemedText style={{ fontSize: 13, opacity: 0.5, marginTop: 4 }}>
            Check the Orders tab to accept new deliveries
          </ThemedText>
        </ThemedView>
      )}

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
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  header: {
    marginBottom: 20,
    paddingVertical: 8,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.8,
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderRadius: 12,
  },
  deliveryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  deliveryInfo: {
    flex: 1,
  },
  deliveryLocation: {
    fontSize: 14,
    fontWeight: '500',
  },
  deliveryTime: {
    fontSize: 12,
    opacity: 0.6,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 20,
  },
});

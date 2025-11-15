import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ScrollView, StyleSheet, View } from 'react-native';

// Updated analytics data
const analyticsData = {
  totalOrders: 450,
  thisMonthOrders: 120,
  todayOrders: 12,
  activeOrders: 3,
};

// All orders — active + delivered
const orders = [
  { id: 1, location: '123 Main St', status: 'Delivered', time: '2:30 PM' },
  { id: 2, location: '456 Oak Ave', status: 'Delivered', time: '1:45 PM' },
  { id: 3, location: '789 Pine Rd', status: 'Active', time: 'Now' },
  { id: 4, location: '45 River St', status: 'Active', time: 'Now' },
  { id: 5, location: 'City Mall', status: 'Active', time: 'Now' },
];

// Filter active orders only
const activeOrders = orders.filter((o) => o.status === 'Active');

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Dashboard</ThemedText>
        <ThemedText style={styles.subtitle}>Delivery Overview</ThemedText>
      </ThemedView>

      {/* Stats Row 1 */}
      <View style={styles.statsGrid}>
        <ThemedView style={[styles.statCard, { backgroundColor: isDark ? '#1E3A3A' : '#E3F2FD' }]}>
          <ThemedText type="subtitle" style={styles.statNumber}>
            {analyticsData.totalOrders}
          </ThemedText>
          <ThemedText style={styles.statLabel}>Total Orders</ThemedText>
        </ThemedView>

        <ThemedView style={[styles.statCard, { backgroundColor: isDark ? '#3A1E3A' : '#F3E5F5' }]}>
          <ThemedText type="subtitle" style={styles.statNumber}>
            {analyticsData.thisMonthOrders}
          </ThemedText>
          <ThemedText style={styles.statLabel}>This Month</ThemedText>
        </ThemedView>
      </View>

      {/* Stats Row 2 */}
      <View style={styles.statsGrid}>
        <ThemedView style={[styles.statCard, { backgroundColor: isDark ? '#3A1E1E' : '#FFEBEE' }]}>
          <ThemedText type="subtitle" style={[styles.statNumber]}>
            {analyticsData.todayOrders}
          </ThemedText>
          <ThemedText style={styles.statLabel}>Today Orders</ThemedText>
        </ThemedView>

        <ThemedView style={[styles.statCard, { backgroundColor: isDark ? '#3A3A1E' : '#FFF3E0' }]}>
          <ThemedText type="subtitle" style={styles.statNumber}>
            {analyticsData.activeOrders}
          </ThemedText>
          <ThemedText style={styles.statLabel}>Active Orders</ThemedText>
        </ThemedView>
      </View>

      {/* Active Orders List */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Active Orders</ThemedText>

        {activeOrders.length === 0 && (
          <ThemedText style={{ opacity: 0.7, marginTop: 10 }}>
            No active orders right now.
          </ThemedText>
        )}

        {activeOrders.map((order) => (
          <View key={order.id} style={styles.deliveryItem}>
            <View style={styles.deliveryInfo}>
              <ThemedText style={styles.deliveryLocation}>📍 {order.location}</ThemedText>
              <ThemedText style={styles.deliveryTime}>{order.time}</ThemedText>
            </View>

            <ThemedView
              style={[
                styles.statusBadge,
                { backgroundColor: isDark ? '#3A2E1E' : '#FFF3E0' }
              ]}
            >
              <ThemedText style={[styles.statusText, { color: '#F57C00' }]}>
                Active
              </ThemedText>
            </ThemedView>
          </View>
        ))}
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

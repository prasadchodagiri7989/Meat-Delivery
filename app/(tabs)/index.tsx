import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ScrollView, StyleSheet, View } from 'react-native';

// Sample analytics data
const analyticsData = {
  ordersServed: 145,
  totalEarnings: 4580,
  todaysEarnings: 320,
  activeDeliveries: 3,
  completedToday: 12,
  averageRating: 4.8,
  totalDistance: 2450,
};

const recentDeliveries = [
  { id: 1, location: '123 Main St', status: 'Delivered', time: '2:30 PM' },
  { id: 2, location: '456 Oak Ave', status: 'Delivered', time: '1:45 PM' },
  { id: 3, location: '789 Pine Rd', status: 'In Progress', time: 'Active' },
];

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Dashboard</ThemedText>
        <ThemedText style={styles.subtitle}>Your Delivery Analytics</ThemedText>
      </ThemedView>

      {/* Quick Stats Row 1 */}
      <View style={styles.statsGrid}>
        <ThemedView style={[styles.statCard, { backgroundColor: isDark ? '#1E3A3A' : '#E3F2FD' }]}>
          <ThemedText type="subtitle" style={styles.statNumber}>
            {analyticsData.ordersServed}
          </ThemedText>
          <ThemedText style={styles.statLabel}>Orders Served</ThemedText>
        </ThemedView>
        
        <ThemedView style={[styles.statCard, { backgroundColor: isDark ? '#1E3A1E' : '#E8F5E9' }]}>
          <ThemedText type="subtitle" style={[styles.statNumber, { color: '#2E7D32' }]}>
            ₹{analyticsData.totalEarnings}
          </ThemedText>
          <ThemedText style={styles.statLabel}>Total Earnings</ThemedText>
        </ThemedView>
      </View>

      {/* Quick Stats Row 2 */}
      <View style={styles.statsGrid}>
        <ThemedView style={[styles.statCard, { backgroundColor: isDark ? '#3A1E1E' : '#FFEBEE' }]}>
          <ThemedText type="subtitle" style={[styles.statNumber, { color: '#D32F2F' }]}>
            ₹{analyticsData.todaysEarnings}
          </ThemedText>
          <ThemedText style={styles.statLabel}>Today's Earnings</ThemedText>
        </ThemedView>
        
        <ThemedView style={[styles.statCard, { backgroundColor: isDark ? '#3A3A1E' : '#FFF3E0' }]}>
          <ThemedText type="subtitle" style={[styles.statNumber, { color: '#F57C00' }]}>
            {analyticsData.activeDeliveries}
          </ThemedText>
          <ThemedText style={styles.statLabel}>Active Deliveries</ThemedText>
        </ThemedView>
      </View>

      {/* Performance Metrics */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Performance Metrics</ThemedText>
        
        <View style={styles.metricRow}>
          <ThemedText style={styles.metricLabel}>Completed Today</ThemedText>
          <ThemedText style={styles.metricValue}>{analyticsData.completedToday}</ThemedText>
        </View>
        
        <View style={[styles.metricRow, styles.borderTop]}>
          <ThemedText style={styles.metricLabel}>Average Rating</ThemedText>
          <ThemedText style={[styles.metricValue, { color: '#FFB300' }]}>
            ⭐ {analyticsData.averageRating}
          </ThemedText>
        </View>
        
        <View style={[styles.metricRow, styles.borderTop]}>
          <ThemedText style={styles.metricLabel}>Total Distance</ThemedText>
          <ThemedText style={styles.metricValue}>{analyticsData.totalDistance} km</ThemedText>
        </View>
      </ThemedView>

      {/* Recent Deliveries */}
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Recent Deliveries</ThemedText>
        
        {recentDeliveries.map((delivery) => (
          <View key={delivery.id} style={styles.deliveryItem}>
            <View style={styles.deliveryInfo}>
              <ThemedText style={styles.deliveryLocation}>📍 {delivery.location}</ThemedText>
              <ThemedText style={styles.deliveryTime}>{delivery.time}</ThemedText>
            </View>
            <ThemedView 
              style={[
                styles.statusBadge,
                { 
                  backgroundColor: delivery.status === 'Delivered' 
                    ? isDark ? '#1E3A1E' : '#E8F5E9'
                    : isDark ? '#3A2E1E' : '#FFF3E0'
                }
              ]}
            >
              <ThemedText 
                style={[
                  styles.statusText,
                  { 
                    color: delivery.status === 'Delivered' ? '#2E7D32' : '#F57C00'
                  }
                ]}
              >
                {delivery.status}
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
    textAlign: 'center',
    opacity: 0.8,
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderRadius: 12,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  metricLabel: {
    fontSize: 14,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  deliveryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  deliveryInfo: {
    flex: 1,
  },
  deliveryLocation: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
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

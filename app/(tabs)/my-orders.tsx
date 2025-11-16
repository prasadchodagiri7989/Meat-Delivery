import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useOrders } from '@/context/order-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Linking,
    RefreshControl,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

const screenWidth = Dimensions.get('window').width;

const FILTER_OPTIONS = ['All', 'out-for-delivery', 'delivered'];

export default function MyOrdersScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { assignedOrders, isLoading, error, fetchAssignedOrders, markOutForDelivery, markDelivered } = useOrders();
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const [actioningId, setActioningId] = useState<string | null>(null);

  // Fetch assigned orders on mount
  useEffect(() => {
    const loadOrders = async () => {
      try {
        await fetchAssignedOrders();
      } catch (err) {
        console.error('Error loading orders:', err);
      }
    };

    loadOrders();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchAssignedOrders();
    } catch (err) {
      Alert.alert('Error', 'Failed to refresh orders');
    } finally {
      setRefreshing(false);
    }
  };

  // Filter orders based on selected status
  const filteredOrders = assignedOrders.filter(order => {
    if (selectedFilter === 'All') return true;
    return order.status === selectedFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'out-for-delivery':
        return { bg: isDark ? '#1E3A1E' : '#E8F5E9', text: '#2E7D32' };
      case 'delivered':
        return { bg: isDark ? '#1E2A3A' : '#E3F2FD', text: '#1565C0' };
      case 'pending':
        return { bg: isDark ? '#3A3A1E' : '#FFF3E0', text: '#F57C00' };
      default:
        return { bg: isDark ? '#1F2937' : '#F3F4F6', text: '#6B7280' };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'out-for-delivery':
        return '🚚';
      case 'delivered':
        return '✓';
      case 'pending':
        return '⏳';
      default:
        return '◦';
    }
  };

  const formatStatus = (status: string) => {
    return status?.replace(/_/g, ' ').charAt(0).toUpperCase() + status?.slice(1).replace(/_/g, ' ') || 'Unknown';
  };

  const handleStartDelivery = async (orderId: string) => {
    Alert.alert(
      'Start Delivery',
      'Mark this order as out for delivery?',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Start',
          onPress: async () => {
            try {
              setActioningId(orderId);
              const success = await markOutForDelivery(orderId);
              if (success) {
                Alert.alert('Success', 'Order marked as out for delivery');
                await fetchAssignedOrders();
              } else {
                Alert.alert('Error', 'Failed to update order status');
              }
            } catch (err) {
              Alert.alert('Error', 'Failed to update order');
              console.error('Mark out for delivery error:', err);
            } finally {
              setActioningId(null);
            }
          },
        },
      ]
    );
  };

  const handleMarkDelivered = async (orderId: string) => {
    Alert.prompt(
      'Complete Delivery',
      'Enter the delivery OTP:',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: async (otp: string | undefined) => {
            if (!otp || otp.trim().length === 0) {
              Alert.alert('Error', 'Please enter OTP');
              return;
            }
            try {
              setActioningId(orderId);
              const success = await markDelivered(orderId, '', otp);
              if (success) {
                Alert.alert('Success', 'Order marked as delivered!');
                await fetchAssignedOrders();
              } else {
                Alert.alert('Error', 'Failed to mark as delivered');
              }
            } catch (err) {
              Alert.alert('Error', 'Failed to complete delivery');
              console.error('Mark delivered error:', err);
            } finally {
              setActioningId(null);
            }
          },
        },
      ]
    );
  };

  const handleOpenMaps = (lat: number, lon: number) => {
    if (!lat || !lon) {
      Alert.alert('Error', 'Location not available');
      return;
    }
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}&travelmode=driving`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Could not open Google Maps');
    });
  };

  if (isLoading && assignedOrders.length === 0) {
    return (
      <ThemedView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={isDark ? '#fff' : '#000'} />
        <ThemedText style={{ marginTop: 12 }}>Loading your orders...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">My Orders</ThemedText>
        <ThemedText style={styles.orderCount}>
          ({filteredOrders.length} orders)
        </ThemedText>
      </View>

      {error && (
        <View
          style={[
            styles.errorContainer,
            { backgroundColor: isDark ? '#3a1a1a' : '#ffebee' },
          ]}
        >
          <ThemedText style={{ color: '#d32f2f' }}>{error}</ThemedText>
        </View>
      )}

      {/* Filter Buttons */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {FILTER_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.filterButton,
              {
                backgroundColor:
                  selectedFilter === option
                    ? '#FF6B35'
                    : isDark
                    ? '#2a2a2a'
                    : '#f0f0f0',
              },
            ]}
            onPress={() => setSelectedFilter(option)}
          >
            <ThemedText
              style={[
                styles.filterButtonText,
                {
                  color: selectedFilter === option ? '#fff' : isDark ? '#fff' : '#000',
                },
              ]}
            >
              {option}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {filteredOrders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>No orders found</ThemedText>
          <ThemedText style={styles.emptySubText}>
            {selectedFilter === 'All'
              ? 'Accept orders to see them here'
              : `No ${selectedFilter.toLowerCase()} orders`}
          </ThemedText>
        </View>
      ) : (
        <ScrollView
          style={styles.ordersList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          {filteredOrders.map((order) => {
            const statusColor = getStatusColor(order.status);
            const statusIcon = getStatusIcon(order.status);

            return (
              <ThemedView
                key={order._id}
                style={[
                  styles.orderCard,
                  { backgroundColor: isDark ? '#1F2937' : '#F9FAFB' },
                ]}
              >
                {/* Header */}
                <View style={styles.cardHeader}>
                  <View>
                    <ThemedText type="subtitle" style={styles.customerName}>
                      {`${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`.trim() || 'Customer'}
                    </ThemedText>
                    <ThemedText style={styles.orderId}>Order #{order.orderNumber}</ThemedText>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: statusColor.bg },
                    ]}
                  >
                    <ThemedText style={[styles.statusText, { color: statusColor.text }]}>
                      {statusIcon} {formatStatus(order.status)}
                    </ThemedText>
                  </View>
                </View>

                {/* Price */}
                <View style={styles.priceContainer}>
                  <ThemedText style={[styles.price, { color: '#10B981' }]}>
                    ₹{order.pricing?.total || 0}
                  </ThemedText>
                </View>

                {/* Address */}
                <View style={styles.addressContainer}>
                  <ThemedText style={styles.addressIcon}>📍</ThemedText>
                  <ThemedText style={styles.address} numberOfLines={2}>
                    {`${order.deliveryAddress?.street || ''}, ${order.deliveryAddress?.city || ''}`}
                  </ThemedText>
                </View>

                {/* Details Row */}
                <View style={styles.detailsRow}>
                  <View style={styles.detailItem}>
                    <ThemedText style={styles.detailLabel}>Items</ThemedText>
                    <ThemedText style={styles.detailValue}>
                      {order.items?.length || 0}
                    </ThemedText>
                  </View>
                  <View style={styles.detailItem}>
                    <ThemedText style={styles.detailLabel}>Date</ThemedText>
                    <ThemedText style={styles.detailValue}>
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                    </ThemedText>
                  </View>
                  <View style={styles.detailItem}>
                    <ThemedText style={styles.detailLabel}>Time</ThemedText>
                    <ThemedText style={styles.detailValue}>
                      {order.createdAt ? new Date(order.createdAt).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      }) : 'N/A'}
                    </ThemedText>
                  </View>
                </View>

                {/* Action Buttons */}
                {order.status !== 'delivered' && (
                  <View style={styles.buttonsContainer}>
                    {order.status === 'pending' && (
                      <>
                        <TouchableOpacity
                          style={[
                            styles.button,
                            styles.mapsButton,
                          ]}
                          onPress={() => handleOpenMaps(12.9716, 77.5946)}
                        >
                          <ThemedText style={styles.buttonText}>📍 Maps</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.button,
                            styles.startButton,
                            { opacity: actioningId === order._id ? 0.6 : 1 },
                          ]}
                          onPress={() => handleStartDelivery(order._id)}
                          disabled={actioningId === order._id}
                        >
                          {actioningId === order._id ? (
                            <ActivityIndicator size="small" color="#fff" />
                          ) : (
                            <ThemedText style={styles.buttonText}>Start</ThemedText>
                          )}
                        </TouchableOpacity>
                      </>
                    )}

                    {order.status === 'out-for-delivery' && (
                      <>
                        <TouchableOpacity
                          style={[
                            styles.button,
                            styles.mapsButton,
                          ]}
                          onPress={() => handleOpenMaps(12.9716, 77.5946)}
                        >
                          <ThemedText style={styles.buttonText}>📍 Maps</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.button,
                            styles.completeButton,
                            { opacity: actioningId === order._id ? 0.6 : 1 },
                          ]}
                          onPress={() => handleMarkDelivered(order._id)}
                          disabled={actioningId === order._id}
                        >
                          {actioningId === order._id ? (
                            <ActivityIndicator size="small" color="#fff" />
                          ) : (
                            <ThemedText style={styles.buttonText}>Complete</ThemedText>
                          )}
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                )}

                {/* Delivered Info */}
                {order.status === 'delivered' && (
                  <View style={[styles.deliveredInfo, { backgroundColor: statusColor.bg + '30' }]}>
                    <ThemedText style={[styles.deliveredText, { color: statusColor.text }]}>
                      ✓ Delivered on {order.updatedAt ? new Date(order.updatedAt).toLocaleDateString() : 'N/A'}
                    </ThemedText>
                  </View>
                )}
              </ThemedView>
            );
          })}
        </ScrollView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  orderCount: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 4,
  },
  errorContainer: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#d32f2f',
  },
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  filterContent: {
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  ordersList: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  orderCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
  },
  orderId: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  priceContainer: {
    marginBottom: 12,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
  },
  addressContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  addressIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  address: {
    flex: 1,
    fontSize: 13,
    opacity: 0.7,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    marginBottom: 12,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 11,
    opacity: 0.6,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapsButton: {
    backgroundColor: '#3B82F6',
  },
  startButton: {
    backgroundColor: '#10B981',
  },
  completeButton: {
    backgroundColor: '#8B5CF6',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  deliveredInfo: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  deliveredText: {
    fontSize: 13,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
  },
});

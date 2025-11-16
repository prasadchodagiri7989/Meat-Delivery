import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useOrders } from '@/context/order-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

export default function OrdersScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { pendingOrders, isLoading, error, fetchPendingOrders, acceptOrder } = useOrders();
  const [refreshing, setRefreshing] = useState(false);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  // Fetch pending orders on mount
  useEffect(() => {
    const loadOrders = async () => {
      try {
        await fetchPendingOrders();
      } catch (err) {
        console.error('Error loading orders:', err);
      }
    };

    loadOrders();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchPendingOrders();
    } catch (err) {
      Alert.alert('Error', 'Failed to refresh orders');
    } finally {
      setRefreshing(false);
    }
  };

  const handleAccept = async (orderId: string, customerName: string) => {
    Alert.alert(
      'Accept Order',
      `Do you want to accept ${customerName}'s order?`,
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Accept',
          onPress: async () => {
            try {
              setAcceptingId(orderId);
              const success = await acceptOrder(orderId);
              if (success) {
                Alert.alert('Success', 'Order accepted successfully!');
                // Refresh the list after acceptance
                await fetchPendingOrders();
              } else {
                Alert.alert('Error', 'Failed to accept order');
              }
            } catch (err) {
              Alert.alert('Error', 'Failed to accept order');
              console.error('Accept order error:', err);
            } finally {
              setAcceptingId(null);
            }
          },
        },
      ]
    );
  };

  if (isLoading && pendingOrders.length === 0) {
    return (
      <ThemedView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={isDark ? '#fff' : '#000'} />
        <ThemedText style={{ marginTop: 12 }}>Loading orders...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Available Orders</ThemedText>
        <ThemedText style={styles.orderCount}>
          ({pendingOrders.length} orders)
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

      {pendingOrders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>
            No orders available at the moment
          </ThemedText>
          <ThemedText style={styles.emptySubText}>
            Check back later for new orders
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
          {pendingOrders.map((order) => (
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
                  <ThemedText style={styles.detailLabel}>Status</ThemedText>
                  <ThemedText
                    style={[styles.detailValue, { color: '#FF9800' }]}
                  >
                    {order.status || 'pending'}
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
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.acceptButton,
                    {
                      opacity: acceptingId === order._id ? 0.6 : 1,
                    },
                  ]}
                  onPress={() => handleAccept(order._id, `${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`)}
                  disabled={acceptingId === order._id}
                >
                  {acceptingId === order.id ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <>
                      <ThemedText style={styles.buttonText}>✓ Accept</ThemedText>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </ThemedView>
          ))}
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
    marginBottom: 16,
  },
  orderCount: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 4,
  },
  errorContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#d32f2f',
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
    alignItems: 'center',
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
  price: {
    fontSize: 18,
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
  acceptButton: {
    backgroundColor: '#10B981',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
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

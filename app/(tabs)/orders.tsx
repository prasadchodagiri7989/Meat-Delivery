import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { orderService } from '@/services';
import { Order } from '@/types';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Platform,
    RefreshControl,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
export default function OrdersScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  // Fetch pending orders directly from API
  const fetchPendingOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔄 Fetching pending orders...');
      const response = await orderService.getPendingOrders();
      console.log('📦 API Response:', JSON.stringify(response, null, 2));
      
      // API returns orders in the 'message' field, not 'data'
      const orders = Array.isArray(response.message) ? response.message : 
                     Array.isArray(response.data) ? response.data : [];
      
      if (response.success && orders.length > 0) {
        console.log(`✅ Found ${orders.length} orders`);
        setPendingOrders(orders);
      } else {
        console.log('⚠️ No orders available');
        setPendingOrders([]);
      }
    } catch (err: any) {
      console.error('❌ Fetch error:', err);
      setError(err.message || 'Failed to fetch orders');
      setPendingOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch orders every time the screen comes into focus (URL changes)
  useFocusEffect(
    useCallback(() => {
      console.log('📱 Orders screen focused - fetching orders...');
      fetchPendingOrders();
    }, [fetchPendingOrders])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchPendingOrders();
    } catch {
      Alert.alert('Error', 'Failed to refresh orders');
    } finally {
      setRefreshing(false);
    }
  };

  const processDelivery = async (orderId: string) => {
    console.log('✅ Processing delivery for order:', orderId);
    try {
      setAcceptingId(orderId);
      
      console.log('🚀 Accepting order:', orderId);
      const acceptResponse = await orderService.acceptOrder(orderId);
      console.log('📋 Accept response:', JSON.stringify(acceptResponse, null, 2));
      
      if (acceptResponse.success) {
        console.log('✅ Order accepted successfully!');
        
        // Navigate to order details page
        router.push({
          pathname: '/order-details',
          params: { orderId: orderId }
        });
      } else {
        console.log('⚠️ Accept failed:', acceptResponse.message);
        Alert.alert('Error', acceptResponse.message || 'Failed to accept order');
      }
    } catch (err: any) {
      console.error('❌ Error accepting order:', err);
      Alert.alert('Error', err.message || 'Failed to accept order');
    } finally {
      setAcceptingId(null);
    }
  };

  const handleAccept = async (orderId: string, customerName: string) => {
    console.log('🟢 handleAccept called with:', { orderId, customerName });
    
    // On web, use window.confirm instead of Alert.alert
    if (Platform.OS === 'web') {
      const confirmed = (globalThis as any).window?.confirm(`Accept ${customerName}'s order?`);
      console.log('🌐 Web confirmation:', confirmed);
      if (confirmed) {
        await processDelivery(orderId);
      } else {
        console.log('❌ User cancelled');
      }
      return;
    }
    
    Alert.alert(
      'Accept Order',
      `Accept ${customerName}'s order?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => console.log('❌ User cancelled'),
        },
        {
          text: 'Accept',
          onPress: async () => {
            await processDelivery(orderId);
          },
        },
      ]
    );
  };

  if (isLoading && (!Array.isArray(pendingOrders) || pendingOrders.length === 0)) {
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
        <ThemedText type="title">Available Order</ThemedText>
        <ThemedText style={styles.orderCount}>
          ({Array.isArray(pendingOrders) ? pendingOrders.length : 0} orders)
        </ThemedText>
      </View>

      {error && (
        <View
          style={[
            styles.errorContainer,
            { backgroundColor: isDark ? '#3a1a1a' : '#ffebee' },
          ]}
        >
          <ThemedText style={{ color: '#d32f2f' }}>
            {typeof error === 'string' ? error : JSON.stringify(error)}
          </ThemedText>

        </View>
      )}

      {!Array.isArray(pendingOrders) || pendingOrders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>No orders available at the moment</ThemedText>
          <ThemedText style={styles.emptySubText}>
            Check back later for new orders
          </ThemedText>
        </View>
      ) : (
        <ScrollView
          style={styles.ordersList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        >
          {pendingOrders.map((order) => (
            <ThemedView
              key={order._id}
              style={[
                styles.orderCard,
                { backgroundColor: isDark ? '#1F2937' : '#F9FAFB' },
              ]}
            >
              <View style={styles.cardHeader}>
                <View>
                  <ThemedText type="subtitle" style={styles.customerName}>
                    {`${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`.trim() ||
                      'Customer'}
                  </ThemedText>
                  <ThemedText style={styles.orderId}>
                    {`Order #${order.orderNumber || 'N/A'}`}
                  </ThemedText>
                </View>
                <ThemedText style={[styles.price, { color: '#10B981' }]}>
                  ₹{Number(order.pricing?.total) || 0}
                </ThemedText>
              </View>

              <View style={styles.addressContainer}>
                <ThemedText style={styles.addressIcon}>📍</ThemedText>
                <ThemedText style={styles.address} numberOfLines={2}>
                  {(() => {
                    const street = order.deliveryAddress?.street || '';
                    const city = order.deliveryAddress?.city || '';
                    return `${street}${street && city ? ', ' : ''}${city}` || 'Address not available';
                  })()}
                </ThemedText>
              </View>

              <View style={styles.detailsRow}>
                <View style={styles.detailItem}>
                  <ThemedText style={styles.detailLabel}>Items</ThemedText>
                  <ThemedText style={styles.detailValue}>
                    {String(order.items?.length || 0)}
                  </ThemedText>
                </View>

                <View style={styles.detailItem}>
                  <ThemedText style={styles.detailLabel}>Status</ThemedText>
                  <ThemedText style={[styles.detailValue, { color: '#FF9800' }]}>
                    {String(order.status || 'pending')}
                  </ThemedText>
                </View>

                <View style={styles.detailItem}>
                  <ThemedText style={styles.detailLabel}>Time</ThemedText>
                  <ThemedText style={styles.detailValue}>
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'N/A'}
                  </ThemedText>
                </View>
              </View>

              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.acceptButton,
                    { opacity: acceptingId === order._id ? 0.6 : 1 },
                  ]}
                  onPress={() => {
                    console.log('🔵 Button clicked! Order ID:', order._id);
                    handleAccept(
                      order._id,
                      `${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`
                    );
                  }}
                  disabled={acceptingId === order._id}
                >
                  {acceptingId === order._id ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <ThemedText style={styles.buttonText}>✓ Accept Order</ThemedText>
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

  /* ✔ FIXED: Proper shadow for React Native */
  orderCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,

    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,

    // Android shadow
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

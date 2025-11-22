import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { orderService } from '@/services';
import { Order } from '@/types';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function MyOrdersScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [assignedOrders, setAssignedOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  // Fetch assigned orders directly from API
  const fetchAssignedOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔄 Fetching assigned orders...');
      const response = await orderService.getAssignedOrders();
      console.log('📦 API Response:', JSON.stringify(response, null, 2));
      
      // API returns orders in the 'message' field, not 'data'
      const orders = Array.isArray(response.message) ? response.message : 
                     Array.isArray(response.data) ? response.data : [];
      
      if (response.success && orders.length > 0) {
        console.log(`✅ Found ${orders.length} assigned orders`);
        setAssignedOrders(orders);
      } else {
        console.log('⚠️ No assigned orders available');
        setAssignedOrders([]);
      }
    } catch (err: any) {
      console.error('❌ Fetch error:', err);
      setError(err.message || 'Failed to fetch orders');
      setAssignedOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch orders every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log('📱 My Orders screen focused - fetching orders...');
      fetchAssignedOrders();
    }, [fetchAssignedOrders])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchAssignedOrders();
    } catch {
      Alert.alert('Error', 'Failed to refresh orders');
    } finally {
      setRefreshing(false);
    }
  };

  const handleAccept = async (orderId: string, customerName: string) => {
    Alert.alert(
      'Mark Delivered',
      `Mark order from ${customerName} as delivered?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Mark Delivered',
          onPress: async () => {
            try {
              setAcceptingId(orderId);
              const response = await orderService.markDelivered(orderId, 'Delivered successfully');
              if (response.success) {
                Alert.alert('Success', 'Order marked as delivered!');
                await fetchAssignedOrders();
              } else {
                Alert.alert('Error', response.message || 'Failed to mark as delivered');
              }
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Failed to mark as delivered');
            } finally {
              setAcceptingId(null);
            }
          },
        },
      ]
    );
  };

  // Colors
  const bgColor = isDark ? '#111827' : '#FFFFFF';
  const cardBg = isDark ? '#1F2937' : '#F9FAFB';
  const textColor = isDark ? '#F9FAFB' : '#111827';
  const textSecondary = isDark ? '#9CA3AF' : '#6B7280';
  const borderColor = isDark ? '#374151' : '#E5E7EB';

  if (isLoading && assignedOrders.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: bgColor }]}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={[styles.loadingText, { color: textSecondary }]}>Loading orders...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>My Orders</Text>
        <Text style={[styles.orderCount, { color: textSecondary }]}>
          {String(assignedOrders.length)} {assignedOrders.length === 1 ? 'order' : 'orders'}
        </Text>
      </View>

      {/* Error Message */}
      {error ? (
        <View style={[styles.errorContainer, { backgroundColor: isDark ? '#7F1D1D' : '#FEE2E2' }]}>
          <Text style={[styles.errorText, { color: isDark ? '#FCA5A5' : '#991B1B' }]}>
            {String(error)}
          </Text>
        </View>
      ) : null}

      {/* Empty State */}
      {assignedOrders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: textColor }]}>No assigned orders</Text>
          <Text style={[styles.emptySubText, { color: textSecondary }]}>
            Accept orders from the Orders tab
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={handleRefresh}
              tintColor="#10B981"
            />
          }
        >
          {assignedOrders
            .sort((a, b) => {
              // Sort: non-delivered orders first, delivered orders last
              const aDelivered = a.status === 'delivered' ? 1 : 0;
              const bDelivered = b.status === 'delivered' ? 1 : 0;
              return aDelivered - bDelivered;
            })
            .map((order: Order, index, sortedArray) => {
            // Safely extract values
            const firstName = String(order.customer?.firstName || '');
            const lastName = String(order.customer?.lastName || '');
            const customerName = `${firstName} ${lastName}`.trim() || 'Customer';
            
            const orderNum = String(order.orderNumber || 'N/A');
            const totalPrice = Number(order.pricing?.total) || 0;
            
            const street = String(order.deliveryAddress?.street || '');
            const city = String(order.deliveryAddress?.city || '');
            const address = `${street}${street && city ? ', ' : ''}${city}`.trim() || 'Address not available';
            
            const itemCount = Array.isArray(order.items) ? order.items.length : 0;
            const statusText = String(order.status || 'pending');

            const paymentMethod = String(order.paymentInfo?.method || 'N/A');
            const phone = String(order.contactInfo?.phone || 'N/A');
            
            // Check if we need to show "Completed" header
            const isDelivered = order.status === 'delivered';
            const prevOrder = index > 0 ? sortedArray[index - 1] : null;
            const showCompletedHeader = isDelivered && (!prevOrder || prevOrder.status !== 'delivered');
            
            return (
              <React.Fragment key={order._id}>
                {showCompletedHeader && (
                  <View style={styles.sectionHeader}>
                    <ThemedText style={styles.sectionHeaderText}>
                      Completed Orders
                    </ThemedText>
                  </View>
                )}
                <TouchableOpacity
                  activeOpacity={0.7}
                onPress={() => {
                  console.log('🔵 Order card clicked:', order._id);
                  router.push({
                    pathname: '/order-details',
                    params: { orderId: order._id }
                  });
                }}
              >
                <View
                  style={[styles.orderCard, { backgroundColor: cardBg, borderColor: borderColor }]}
                >
                {/* Header with Status Badge */}
                <View style={styles.cardHeader}>
                  <View style={styles.headerLeft}>
                    <Text style={[styles.customerName, { color: textColor }]}>
                      👤 {customerName}
                    </Text>
                    <Text style={[styles.orderId, { color: textSecondary }]}>
                      Order #{orderNum}
                    </Text>
                  </View>
                  <View style={styles.priceContainer}>
                    <Text style={styles.price}>₹{totalPrice.toFixed(2)}</Text>
                    <View style={[styles.statusBadgeContainer, { backgroundColor: isDark ? '#854D0E' : '#FEF3C7' }]}>
                      <Text style={[styles.statusBadge, { color: '#F59E0B' }]}>
                        {statusText.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Divider */}
                <View style={[styles.divider, { backgroundColor: borderColor }]} />

                {/* Address Section */}
                <View style={styles.section}>
                  <Text style={[styles.sectionLabel, { color: textSecondary }]}>
                    📍 DELIVERY ADDRESS
                  </Text>
                  <Text style={[styles.addressText, { color: textColor }]}>
                    {address}
                  </Text>
                </View>

                {/* Order Details Grid */}
                <View style={styles.detailsGrid}>
                  <View style={styles.detailBox}>
                    <Text style={[styles.detailLabel, { color: textSecondary }]}>Items</Text>
                    <Text style={[styles.detailValue, { color: textColor }]}>
                      🛍️ {String(itemCount)}
                    </Text>
                  </View>
                  <View style={styles.detailBox}>
                    <Text style={[styles.detailLabel, { color: textSecondary }]}>Payment</Text>
                    <Text style={[styles.detailValue, { color: textColor }]}>
                      {paymentMethod === 'cash-on-delivery' ? '💵 COD' : '💳 Online'}
                    </Text>
                  </View>
                  <View style={styles.detailBox}>
                    <Text style={[styles.detailLabel, { color: textSecondary }]}>Contact</Text>
                    <Text style={[styles.detailValue, { color: textColor }]}>
                      📞 {phone}
                    </Text>
                  </View>
                </View>

                {/* Mark Delivered Button - Only show for non-delivered orders */}
                {order.status !== 'delivered' && (
                  <TouchableOpacity
                    style={[
                      styles.acceptButton,
                      acceptingId === order._id && styles.acceptButtonDisabled
                    ]}
                    onPress={() => handleAccept(String(order._id), customerName)}
                    disabled={acceptingId === order._id}
                    activeOpacity={0.7}
                  >
                    {acceptingId === order._id ? (
                      <View style={styles.buttonContent}>
                        <ActivityIndicator size="small" color="#fff" />
                        <Text style={[styles.acceptButtonText, { marginLeft: 8 }]}>Processing...</Text>
                      </View>
                    ) : (
                      <Text style={styles.acceptButtonText}>✓ Mark Delivered</Text>
                    )}
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          </React.Fragment>
            );
          })}
        </ScrollView>
      )}
    </View>
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
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  orderCount: {
    fontSize: 14,
    marginTop: 2,
  },
  errorContainer: {
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
  },
  errorText: {
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  orderCard: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
    marginRight: 12,
  },
  customerName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  orderId: {
    fontSize: 13,
    opacity: 0.7,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 24,
    fontWeight: '800',
    color: '#10B981',
    marginBottom: 6,
  },
  statusBadgeContainer: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadge: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    marginVertical: 12,
    opacity: 0.2,
  },
  section: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  addressText: {
    fontSize: 15,
    lineHeight: 22,
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  detailBox: {
    flex: 1,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 11,
    marginBottom: 4,
    opacity: 0.7,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  acceptButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  acceptButtonDisabled: {
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: 8,
  },
  sectionHeaderText: {
    fontSize: 20,
    fontWeight: '700',
  },
});

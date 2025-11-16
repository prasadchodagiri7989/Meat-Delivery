
import { useOrders } from '@/context/order-context';
import { useEffect, useState } from 'react';

export default function MyOrdersScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { isAuthenticated, logout } = useAuth();
  const { 
    assignedOrders, 
    isLoading, 
    error, 
    fetchAssignedOrders,
    markOutForDelivery,
    markDelivered,
    selectOrder,
    clearError,
  } = useOrders();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAssignedOrders();
    }
  }, [isAuthenticated]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAssignedOrders();
    setRefreshing(false);
  };

  const handleStartDelivery = async (orderId: string) => {
    const success = await markOutForDelivery(orderId, 'Started delivery');
    if (success) {
      Alert.alert('Success', 'Order marked as out for delivery');
    }
  };

  const handleCompleteDelivery = async (orderId: string) => {
    Alert.prompt(
      'Delivery OTP',
      'Enter the OTP from customer:',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: async (otp) => {
            const success = await markDelivered(
              orderId,
              'Delivered successfully',
              otp
            );
            if (success) {
              Alert.alert('Success', 'Order marked as delivered');
            } else {
              Alert.alert('Error', error || 'Failed to mark delivery');
            }
          },
        },
      ],
      'plain-text'
    );
  };

  if (!isAuthenticated) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="title">Please login to view orders</ThemedText>
      </ThemedView>
    );
  }

  if (isLoading && assignedOrders.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" color={isDark ? '#fff' : '#000'} />
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={{ color: '#D32F2F' }}>
          Error
        </ThemedText>
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      showsVerticalScrollIndicator={false}
    >
      <ThemedView style={styles.header}>
        <ThemedText type="title">My Orders</ThemedText>
        <ThemedText style={styles.subtitle}>
          {assignedOrders.length} active order(s)
        </ThemedText>
      </ThemedView>

      {assignedOrders.length === 0 ? (
        <ThemedView style={styles.emptyState}>
          <ThemedText style={styles.emptyText}>No active deliveries</ThemedText>
          <ThemedText style={styles.emptySubtext}>
            Accept orders from the Orders tab to get started
          </ThemedText>
        </ThemedView>
      ) : (
        assignedOrders.map((order) => (
          <ThemedView
            key={order._id}
            style={[
              styles.orderCard,
              { backgroundColor: isDark ? '#1A1A1A' : '#F5F5F5' },
            ]}
          >
            {/* Order Header */}
            <View style={styles.orderHeader}>
              <View>
                <ThemedText type="subtitle">Order #{order.orderNumber}</ThemedText>
                <ThemedText style={styles.statusBadgeText}>
                  Status: {order.status.toUpperCase()}
                </ThemedText>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      order.status === 'out-for-delivery'
                        ? isDark
                          ? '#3A2E1E'
                          : '#FFF3E0'
                        : isDark
                        ? '#1E3A1E'
                        : '#E8F5E9',
                  },
                ]}
              >
                <ThemedText
                  style={{
                    color:
                      order.status === 'out-for-delivery' ? '#F57C00' : '#2E7D32',
                    fontSize: 12,
                    fontWeight: '600',
                  }}
                >
                  {order.status === 'out-for-delivery' ? '🚚' : '✓'}{' '}
                  {order.status}
                </ThemedText>
              </View>
            </View>

            {/* Customer Info */}
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Customer</ThemedText>
              <ThemedText style={styles.infoText}>
                {order.customer.firstName} {order.customer.lastName}
              </ThemedText>
              <ThemedText style={styles.infoText}>{order.customer.phone}</ThemedText>
            </View>

            {/* Delivery Address */}
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Delivery Address</ThemedText>
              <ThemedText style={styles.infoText}>
                {order.deliveryAddress.street}
              </ThemedText>
              <ThemedText style={styles.infoText}>
                {order.deliveryAddress.city}, {order.deliveryAddress.state}{' '}
                {order.deliveryAddress.zipCode}
              </ThemedText>
            </View>

            {/* Items */}
            <View style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Items</ThemedText>
              {order.items.map((item, index) => (
                <View key={index} style={styles.itemRow}>
                  <ThemedText style={styles.itemName}>
                    {item.product.name} x{item.quantity}
                  </ThemedText>
                  <ThemedText style={styles.itemPrice}>₹{item.subtotal}</ThemedText>
                </View>
              ))}
              <View style={[styles.itemRow, { borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.1)', marginTop: 8, paddingTop: 8 }]}>
                <ThemedText style={{ fontWeight: '600' }}>Total</ThemedText>
                <ThemedText style={{ fontWeight: '600', color: '#2E7D32' }}>
                  ₹{order.pricing.total}
                </ThemedText>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              {order.status === 'confirmed' && (
                <View style={[styles.button, { backgroundColor: '#FF9800' }]}>
                  <ThemedText
                    style={styles.buttonText}
                    onPress={() => handleStartDelivery(order._id)}
                  >
                    Start Delivery
                  </ThemedText>
                </View>
              )}

              {order.status === 'out-for-delivery' && (
                <View style={[styles.button, { backgroundColor: '#4CAF50' }]}>
                  <ThemedText
                    style={styles.buttonText}
                    onPress={() => handleCompleteDelivery(order._id)}
                  >
                    Mark Delivered
                  </ThemedText>
                </View>
              )}
            </View>
          </ThemedView>
        ))
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
  header: {
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
  orderCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    opacity: 0.8,
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    marginBottom: 2,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  itemName: {
    fontSize: 13,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '600',
  },
  actions: {
    marginTop: 16,
    gap: 8,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.6,
  },
  bottomPadding: {
    height: 20,
  },
});

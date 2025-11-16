


export default function PendingOrdersScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { isAuthenticated } = useAuth();
  const { pendingOrders, isLoading, error, fetchPendingOrders, acceptOrder, clearError } = useOrders();

  useEffect(() => {
    if (isAuthenticated) {
      fetchPendingOrders();
    }
  }, [isAuthenticated]);

  const handleAcceptOrder = async (orderId: string) => {
    const success = await acceptOrder(orderId);
    if (success) {
      Alert.alert('Success', 'Order accepted successfully');
    } else {
      Alert.alert('Error', 'Failed to accept order');
    }
  };

  if (!isAuthenticated) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="title">Please login to view orders</ThemedText>
      </ThemedView>
    );
  }

  if (isLoading && pendingOrders.length === 0) {
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
        <View style={styles.button}>
          <ThemedText onPress={clearError} style={styles.buttonText}>
            Retry
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (pendingOrders.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="title">No Pending Orders</ThemedText>
        <ThemedText style={styles.subtitle}>
          No orders available for delivery right now
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.header}>
        Available Orders ({pendingOrders.length})
      </ThemedText>

      {pendingOrders.map((order) => (
        <ThemedView
          key={order._id}
          style={[
            styles.orderCard,
            { backgroundColor: isDark ? '#1A1A1A' : '#F5F5F5' },
          ]}
        >
          <ThemedText type="subtitle" style={styles.orderNumber}>
            Order #{order.orderNumber}
          </ThemedText>

          <View style={styles.orderInfo}>
            <ThemedText style={styles.label}>Customer:</ThemedText>
            <ThemedText style={styles.value}>
              {order.customer.firstName} {order.customer.lastName}
            </ThemedText>
          </View>

          <View style={styles.orderInfo}>
            <ThemedText style={styles.label}>Location:</ThemedText>
            <ThemedText style={styles.value}>
              {order.deliveryAddress.street}, {order.deliveryAddress.city}
            </ThemedText>
          </View>

          <View style={styles.orderInfo}>
            <ThemedText style={styles.label}>Items:</ThemedText>
            <ThemedText style={styles.value}>{order.items.length} item(s)</ThemedText>
          </View>

          <View style={styles.orderInfo}>
            <ThemedText style={styles.label}>Total:</ThemedText>
            <ThemedText style={[styles.value, { color: '#2E7D32', fontWeight: '600' }]}>
              ₹{order.pricing.total}
            </ThemedText>
          </View>

          <View style={styles.button}>
            <ThemedText
              style={styles.buttonText}
              onPress={() => handleAcceptOrder(order._id)}
            >
              Accept Order
            </ThemedText>
          </View>
        </ThemedView>
      ))}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 20,
    fontSize: 20,
    fontWeight: '700',
  },
  orderCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  orderNumber: {
    marginBottom: 12,
    fontSize: 16,
    fontWeight: '600',
  },
  orderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    alignItems: 'center',
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
    backgroundColor: '#1976D2',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  errorText: {
    marginTop: 12,
    color: '#D32F2F',
  },
  subtitle: {
    marginTop: 8,
    opacity: 0.7,
  },
});

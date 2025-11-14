import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

// Sample orders data
const sampleOrders = [
  {
    id: 1,
    customerName: 'John Doe',
    address: '123 Main St, Apt 4B, Downtown',
    price: 250,
    distance: 2.5,
    items: 3,
    time: '15 mins',
    status: 'available',
  },
  {
    id: 2,
    customerName: 'Sarah Smith',
    address: '456 Oak Ave, Suite 200, Midtown',
    price: 380,
    distance: 4.2,
    items: 5,
    time: '22 mins',
    status: 'available',
  },
  {
    id: 3,
    customerName: 'Mike Johnson',
    address: '789 Pine Rd, Building C, Uptown',
    price: 180,
    distance: 1.8,
    items: 2,
    time: '12 mins',
    status: 'available',
  },
  {
    id: 4,
    customerName: 'Emma Wilson',
    address: '321 Elm St, Floor 5, East Side',
    price: 450,
    distance: 5.1,
    items: 6,
    time: '28 mins',
    status: 'available',
  },
  {
    id: 5,
    customerName: 'David Brown',
    address: '654 Maple Ave, Near Park, West End',
    price: 320,
    distance: 3.5,
    items: 4,
    time: '20 mins',
    status: 'available',
  },
];

export default function OrdersScreen() {
  const [orders, setOrders] = useState(sampleOrders);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleAccept = (orderId: number, customerName: string) => {
    Alert.alert('Order Accepted', `You accepted ${customerName}'s order`, [
      {
        text: 'OK',
        onPress: () => {
          setOrders(orders.filter(order => order.id !== orderId));
        },
      },
    ]);
  };

  const handleReject = (orderId: number, customerName: string) => {
    Alert.alert('Order Rejected', `You rejected ${customerName}'s order`, [
      {
        text: 'OK',
        onPress: () => {
          setOrders(orders.filter(order => order.id !== orderId));
        },
      },
    ]);
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Available Orders</ThemedText>
        <ThemedText style={styles.orderCount}>({orders.length} orders)</ThemedText>
      </View>

      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>No orders available at the moment</ThemedText>
          <ThemedText style={styles.emptySubText}>Check back later for new orders</ThemedText>
        </View>
      ) : (
        <ScrollView 
          style={styles.ordersList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {orders.map((order) => (
            <ThemedView 
              key={order.id} 
              style={[
                styles.orderCard,
                { backgroundColor: isDark ? '#1F2937' : '#F9FAFB' }
              ]}
            >
              {/* Header */}
              <View style={styles.cardHeader}>
                <ThemedText type="subtitle" style={styles.customerName}>
                  {order.customerName}
                </ThemedText>
                <ThemedText style={[styles.price, { color: '#10B981' }]}>
                  ₹{order.price}
                </ThemedText>
              </View>

              {/* Address */}
              <View style={styles.addressContainer}>
                <ThemedText style={styles.addressIcon}>📍</ThemedText>
                <ThemedText style={styles.address}>{order.address}</ThemedText>
              </View>

              {/* Details Row */}
              <View style={styles.detailsRow}>
                <View style={styles.detailItem}>
                  <ThemedText style={styles.detailLabel}>Distance</ThemedText>
                  <ThemedText style={styles.detailValue}>{order.distance} km</ThemedText>
                </View>
                <View style={styles.detailItem}>
                  <ThemedText style={styles.detailLabel}>Items</ThemedText>
                  <ThemedText style={styles.detailValue}>{order.items}</ThemedText>
                </View>
                <View style={styles.detailItem}>
                  <ThemedText style={styles.detailLabel}>Est. Time</ThemedText>
                  <ThemedText style={styles.detailValue}>{order.time}</ThemedText>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.rejectButton]}
                  onPress={() => handleReject(order.id, order.customerName)}
                >
                  <ThemedText style={styles.rejectButtonText}>✕ Reject</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.acceptButton]}
                  onPress={() => handleAccept(order.id, order.customerName)}
                >
                  <ThemedText style={styles.acceptButtonText}>✓ Accept</ThemedText>
                </TouchableOpacity>
              </View>
            </ThemedView>
          ))}
          <View style={styles.bottomPadding} />
        </ScrollView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    marginBottom: 16,
  },
  orderCount: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 4,
  },
  ordersList: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    opacity: 0.6,
  },
  orderCard: {
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
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
    flex: 1,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  addressContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.08)',
  },
  addressIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  address: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.85,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  detailItem: {
    flex: 1,
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
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
  },
  rejectButton: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  rejectButtonText: {
    color: '#DC2626',
    fontWeight: '600',
    fontSize: 14,
  },
  acceptButton: {
    backgroundColor: '#D1FAE5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  acceptButtonText: {
    color: '#059669',
    fontWeight: '600',
    fontSize: 14,
  },
  bottomPadding: {
    height: 20,
  },
});

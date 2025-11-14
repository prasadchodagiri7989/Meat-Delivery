import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

// Sample orders data for reference
const allOrders = [
  {
    id: 1,
    orderNumber: '#ORD001',
    customerName: 'John Doe',
    address: '123 Main St, Apt 4B, Downtown',
    price: 250,
    distance: 2.5,
    status: 'in_progress',
    date: '2025-11-11',
    time: '2:30 PM',
    rating: 0,
    phone: '+1-234-567-8900',
    instructions: 'Ring doorbell twice',
    items: 3,
    latitude: 40.7128,
    longitude: -74.0060,
  },
  {
    id: 2,
    orderNumber: '#ORD002',
    customerName: 'Sarah Smith',
    address: '456 Oak Ave, Suite 200, Midtown',
    price: 380,
    distance: 4.2,
    status: 'in_progress',
    date: '2025-11-11',
    time: '1:15 PM',
    rating: 0,
    phone: '+1-234-567-8901',
    instructions: 'Leave at door',
    items: 5,
    latitude: 40.7580,
    longitude: -73.9855,
  },
];

export default function OrderDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [isDelivered, setIsDelivered] = useState(false);

  // Get order data from params
  const orderId = Array.isArray(params.id) ? params.id[0] : params.id;
  const order = allOrders.find(o => o.id === parseInt(orderId || '1'));

  if (!order) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Order not found</ThemedText>
      </ThemedView>
    );
  }

  const handleStartRide = async () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${order.latitude},${order.longitude}&travelmode=driving`;
    
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Google Maps is not installed');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not open Google Maps');
    }
  };

  const handleCallCustomer = () => {
    const phoneUrl = `tel:${order.phone}`;
    Linking.openURL(phoneUrl).catch(() => {
      Alert.alert('Error', 'Could not make call');
    });
  };

  const handleMarkDelivered = () => {
    Alert.alert(
      'Confirm Delivery',
      'Mark this order as delivered?',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            setIsDelivered(true);
            Alert.alert('Success', 'Order marked as delivered!', [
              { text: 'OK', onPress: () => router.back() },
            ]);
          },
          style: 'default',
        },
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header with Back Button */}
        <View style={styles.headerSection}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ThemedText style={styles.backButtonText}>← Back</ThemedText>
          </TouchableOpacity>
          <ThemedText type="title" style={styles.orderTitle}>
            {order.orderNumber}
          </ThemedText>
        </View>

        {/* Status Section */}
        <ThemedView
          style={[
            styles.statusSection,
            { backgroundColor: isDark ? '#1E3A1E' : '#E8F5E9' },
          ]}
        >
          <ThemedText style={[styles.statusLabel, { color: '#2E7D32' }]}>
            ⏳ In Progress
          </ThemedText>
          <ThemedText style={styles.statusTime}>{order.date} • {order.time}</ThemedText>
        </ThemedView>

        {/* Customer Information */}
        <ThemedView style={[styles.section, { backgroundColor: isDark ? '#1F2937' : '#F9FAFB' }]}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Customer Information
          </ThemedText>

          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Name</ThemedText>
            <ThemedText style={styles.infoValue}>{order.customerName}</ThemedText>
          </View>

          <View style={[styles.infoRow, styles.borderTop]}>
            <ThemedText style={styles.infoLabel}>Phone</ThemedText>
            <TouchableOpacity onPress={handleCallCustomer}>
              <ThemedText style={[styles.infoValue, { color: '#0a7ea4' }]}>
                {order.phone} 📞
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>

        {/* Delivery Address */}
        <ThemedView style={[styles.section, { backgroundColor: isDark ? '#1F2937' : '#F9FAFB' }]}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Delivery Address
          </ThemedText>

          <View style={styles.addressBox}>
            <ThemedText style={styles.addressIcon}>📍</ThemedText>
            <ThemedText style={styles.addressText}>{order.address}</ThemedText>
          </View>

          {order.instructions && (
            <View style={[styles.instructionsBox, { backgroundColor: isDark ? '#3A2E1E' : '#FFF3E0' }]}>
              <ThemedText style={styles.instructionsLabel}>Special Instructions</ThemedText>
              <ThemedText style={styles.instructionsText}>{order.instructions}</ThemedText>
            </View>
          )}
        </ThemedView>

        {/* Order Details */}
        <ThemedView style={[styles.section, { backgroundColor: isDark ? '#1F2937' : '#F9FAFB' }]}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Order Details
          </ThemedText>

          <View style={styles.detailGrid}>
            <View style={styles.detailGridItem}>
              <ThemedText style={styles.detailGridLabel}>Items</ThemedText>
              <ThemedText style={styles.detailGridValue}>{order.items}</ThemedText>
            </View>
            <View style={styles.detailGridItem}>
              <ThemedText style={styles.detailGridLabel}>Distance</ThemedText>
              <ThemedText style={styles.detailGridValue}>{order.distance} km</ThemedText>
            </View>
            <View style={styles.detailGridItem}>
              <ThemedText style={styles.detailGridLabel}>Amount</ThemedText>
              <ThemedText style={[styles.detailGridValue, { color: '#10B981' }]}>
                ₹{order.price}
              </ThemedText>
            </View>
          </View>
        </ThemedView>

        {/* Action Buttons */}
        {!isDelivered && (
          <View style={styles.buttonsSection}>
            <TouchableOpacity
              style={[styles.button, styles.startRideButton]}
              onPress={handleStartRide}
            >
              <ThemedText style={styles.startRideButtonText}>🗺️ Start Ride (Google Maps)</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.deliveredButton]}
              onPress={handleMarkDelivered}
            >
              <ThemedText style={styles.deliveredButtonText}>✓ Mark as Delivered</ThemedText>
            </TouchableOpacity>
          </View>
        )}

        {isDelivered && (
          <ThemedView style={[styles.deliveredBanner, { backgroundColor: isDark ? '#1E3A1E' : '#E8F5E9' }]}>
            <ThemedText style={[styles.deliveredText, { color: '#2E7D32' }]}>
              ✓ Order Delivered Successfully!
            </ThemedText>
          </ThemedView>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerSection: {
    marginBottom: 16,
  },
  backButton: {
    marginBottom: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: '#0a7ea4',
    fontWeight: '600',
  },
  orderTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  statusSection: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  statusTime: {
    fontSize: 13,
    opacity: 0.7,
  },
  section: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.08)',
  },
  infoLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  addressBox: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    borderRadius: 8,
    marginBottom: 12,
  },
  addressIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  addressText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  instructionsBox: {
    padding: 12,
    borderRadius: 8,
  },
  instructionsLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  instructionsText: {
    fontSize: 13,
    fontWeight: '500',
  },
  detailGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  detailGridItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    borderRadius: 8,
  },
  detailGridLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  detailGridValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonsSection: {
    gap: 12,
    marginBottom: 16,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startRideButton: {
    backgroundColor: '#0a7ea4',
  },
  startRideButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deliveredButton: {
    backgroundColor: '#D1FAE5',
    borderWidth: 2,
    borderColor: '#10B981',
  },
  deliveredButtonText: {
    color: '#059669',
    fontSize: 16,
    fontWeight: '600',
  },
  deliveredBanner: {
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  deliveredText: {
    fontSize: 16,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 40,
  },
});

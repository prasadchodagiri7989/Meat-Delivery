import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Alert, Dimensions, Linking, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

const screenWidth = Dimensions.get('window').width;

// Sample orders data
const sampleOrders = [
  {
    id: 1,
    orderNumber: '#ORD001',
    customerName: 'John Doe',
    address: '123 Main St, Apt 4B',
    price: 250,
    distance: 2.5,
    status: 'in_progress',
    date: '2025-11-11',
    time: '2:30 PM',
    rating: 0,
    latitude: 40.7128,
    longitude: -74.0060,
  },
  {
    id: 2,
    orderNumber: '#ORD002',
    customerName: 'Sarah Smith',
    address: '456 Oak Ave, Suite 200',
    price: 380,
    distance: 4.2,
    status: 'in_progress',
    date: '2025-11-11',
    time: '1:15 PM',
    rating: 0,
    latitude: 40.7580,
    longitude: -73.9855,
  },
  {
    id: 3,
    orderNumber: '#ORD003',
    customerName: 'Mike Johnson',
    address: '789 Pine Rd, Building C',
    price: 180,
    distance: 1.8,
    status: 'delivered',
    date: '2025-11-10',
    time: '10:45 AM',
    rating: 4.6,
  },
  {
    id: 4,
    orderNumber: '#ORD004',
    customerName: 'Emma Wilson',
    address: '321 Elm St, Floor 5',
    price: 450,
    distance: 5.1,
    status: 'delivered',
    date: '2025-11-09',
    time: '3:20 PM',
    rating: 4.8,
  },
  {
    id: 5,
    orderNumber: '#ORD005',
    customerName: 'David Brown',
    address: '654 Maple Ave, Near Park',
    price: 320,
    distance: 3.5,
    status: 'pending',
    date: '2025-11-09',
    time: '11:30 AM',
    rating: 0,
  },
  {
    id: 6,
    orderNumber: '#ORD006',
    customerName: 'Lisa Anderson',
    address: '987 Birch St, Downtown',
    price: 280,
    distance: 2.8,
    status: 'cancelled',
    date: '2025-11-08',
    time: '4:00 PM',
    rating: 0,
  },
  {
    id: 7,
    orderNumber: '#ORD007',
    customerName: 'Robert Garcia',
    address: '159 Cedar Ln, Midtown',
    price: 520,
    distance: 6.2,
    status: 'delivered',
    date: '2025-11-08',
    time: '2:45 PM',
    rating: 4.9,
  },
];

const FILTER_OPTIONS = ['All', 'Delivered', 'Pending', 'Cancelled'];

export default function MyOrdersScreen() {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();

  // Get in-progress orders
  const inProgressOrders = useMemo(() => {
    return sampleOrders.filter(order => order.status === 'in_progress');
  }, []);

  // Filter orders based on selected status
  const filteredOrders = useMemo(() => {
    const otherOrders = sampleOrders.filter(order => order.status !== 'in_progress');
    
    if (selectedFilter === 'All') {
      return otherOrders;
    }
    return otherOrders.filter(
      order => order.status.toLowerCase() === selectedFilter.toLowerCase()
    );
  }, [selectedFilter]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return { bg: isDark ? '#1E3A1E' : '#E8F5E9', text: '#2E7D32' };
      case 'pending':
        return { bg: isDark ? '#3A3A1E' : '#FFF3E0', text: '#F57C00' };
      case 'cancelled':
        return { bg: isDark ? '#3A1E1E' : '#FFEBEE', text: '#D32F2F' };
      default:
        return { bg: isDark ? '#1F2937' : '#F3F4F6', text: '#6B7280' };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return '✓';
      case 'pending':
        return '⏳';
      case 'cancelled':
        return '✕';
      default:
        return '◦';
    }
  };

  const handleStartRide = (lat: number, lon: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}&travelmode=driving`;
    
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Google Maps is not installed');
      }
    });
  };

  const handleStartDelivery = (orderId: number) => {
    router.push({
      pathname: '/order-details',
      params: { id: orderId }
    });
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">My Orders</ThemedText>
      </View>

      <ScrollView 
        style={styles.mainContent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* In Progress Section */}
        {inProgressOrders.length > 0 && (
          <View style={styles.inProgressSection}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              🚚 In Progress ({inProgressOrders.length})
            </ThemedText>
            
            {inProgressOrders.map((order) => (
              <ThemedView 
                key={order.id} 
                style={[
                  styles.inProgressCard,
                  { backgroundColor: isDark ? '#1E3A2E' : '#E8F5E9' }
                ]}
              >
                <View style={styles.inProgressHeader}>
                  <View style={styles.inProgressInfo}>
                    <ThemedText style={styles.inProgressOrderNumber}>
                      {order.orderNumber}
                    </ThemedText>
                    <ThemedText style={styles.inProgressCustomer}>
                      {order.customerName}
                    </ThemedText>
                  </View>
                  <ThemedText style={[styles.inProgressPrice, { color: '#10B981' }]}>
                    ₹{order.price}
                  </ThemedText>
                </View>

                <View style={styles.inProgressAddress}>
                  <ThemedText style={styles.addressIcon}>📍</ThemedText>
                  <ThemedText style={styles.inProgressAddressText} numberOfLines={2}>
                    {order.address}
                  </ThemedText>
                </View>

                <View style={styles.inProgressDetails}>
                  <View style={styles.inProgressDetail}>
                    <ThemedText style={styles.inProgressDetailLabel}>Distance</ThemedText>
                    <ThemedText style={styles.inProgressDetailValue}>{order.distance} km</ThemedText>
                  </View>
                  <View style={styles.inProgressDetail}>
                    <ThemedText style={styles.inProgressDetailLabel}>Est. Time</ThemedText>
                    <ThemedText style={styles.inProgressDetailValue}>{order.time}</ThemedText>
                  </View>
                </View>

                <View style={styles.inProgressButtons}>
                  <TouchableOpacity
                    style={[styles.inProgressButton, styles.mapsButton]}
                    onPress={() => handleStartRide(order.latitude || 0, order.longitude || 0)}
                  >
                    <ThemedText style={styles.mapsButtonText}>🗺️ Start Ride</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.inProgressButton, styles.detailsButton]}
                    onPress={() => handleStartDelivery(order.id)}
                  >
                    <ThemedText style={styles.detailsButtonText}>📋 Start Delivery</ThemedText>
                  </TouchableOpacity>
                </View>
              </ThemedView>
            ))}
          </View>
        )}

        {/* Divider */}
        {inProgressOrders.length > 0 && <View style={styles.divider} />}

        {/* Filter Buttons - Responsive Grid */}
        <View style={styles.filterGrid}>
          {FILTER_OPTIONS.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                selectedFilter === filter
                  ? styles.filterButtonActive
                  : styles.filterButtonInactive,
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <ThemedText
                style={[
                  styles.filterButtonText,
                  selectedFilter === filter && styles.filterButtonTextActive,
                ]}
              >
                {filter}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.orderCountContainer}>
          <ThemedText style={styles.orderCountText}>
            ({filteredOrders.length} {selectedFilter.toLowerCase() === 'all' ? 'orders' : `${selectedFilter.toLowerCase()} orders`})
          </ThemedText>
        </View>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>
              No {selectedFilter.toLowerCase() === 'all' ? '' : selectedFilter.toLowerCase()} orders
            </ThemedText>
            <ThemedText style={styles.emptySubText}>
              {selectedFilter === 'All'
                ? 'Your orders will appear here'
                : `You don't have any ${selectedFilter.toLowerCase()} orders`}
            </ThemedText>
          </View>
        ) : (
          <>
            {filteredOrders.map((order) => {
              const statusColor = getStatusColor(order.status);
              const statusIcon = getStatusIcon(order.status);

              return (
                <ThemedView 
                  key={order.id} 
                  style={[
                    styles.orderCard,
                    { backgroundColor: isDark ? '#1F2937' : '#F9FAFB' }
                  ]}
                >
                  {/* Top Row - Order Number and Status */}
                  <View style={styles.cardTopRow}>
                    <ThemedText style={styles.orderNumber}>{order.orderNumber}</ThemedText>
                    <View style={[styles.statusBadge, { backgroundColor: statusColor.bg }]}>
                      <ThemedText style={[styles.statusIcon, { color: statusColor.text }]}>
                        {statusIcon}
                      </ThemedText>
                      <ThemedText style={[styles.statusText, { color: statusColor.text }]}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </ThemedText>
                    </View>
                  </View>

                  {/* Customer and Date */}
                  <View style={styles.customerRow}>
                    <ThemedText style={styles.customerName}>{order.customerName}</ThemedText>
                    <ThemedText style={styles.date}>{order.date}</ThemedText>
                  </View>

                  {/* Address */}
                  <View style={styles.addressContainer}>
                    <ThemedText style={styles.addressIcon}>📍</ThemedText>
                    <ThemedText style={styles.address} numberOfLines={2}>
                      {order.address}
                    </ThemedText>
                  </View>

                  {/* Details Row */}
                  <View style={styles.detailsRow}>
                    <View style={styles.detailItem}>
                      <ThemedText style={styles.detailLabel}>Price</ThemedText>
                      <ThemedText style={[styles.detailValue, { color: '#10B981' }]}>
                        ₹{order.price}
                      </ThemedText>
                    </View>
                    <View style={styles.detailItem}>
                      <ThemedText style={styles.detailLabel}>Distance</ThemedText>
                      <ThemedText style={styles.detailValue}>{order.distance} km</ThemedText>
                    </View>
                    {order.rating > 0 && (
                      <View style={styles.detailItem}>
                        <ThemedText style={styles.detailLabel}>Rating</ThemedText>
                        <ThemedText style={styles.detailValue}>⭐ {order.rating}</ThemedText>
                      </View>
                    )}
                  </View>

                  {/* Bottom Info */}
                  <View style={styles.bottomInfo}>
                    <ThemedText style={styles.time}>🕐 {order.time}</ThemedText>
                  </View>
                </ThemedView>
              );
            })}
          </>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
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
  mainContent: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  inProgressSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#10B981',
  },
  inProgressCard: {
    marginBottom: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#10B981',
  },
  inProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  inProgressInfo: {
    flex: 1,
  },
  inProgressOrderNumber: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.8,
    marginBottom: 2,
  },
  inProgressCustomer: {
    fontSize: 14,
    fontWeight: '600',
  },
  inProgressPrice: {
    fontSize: 16,
    fontWeight: '700',
  },
  inProgressAddress: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.08)',
  },
  inProgressAddressText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
  },
  inProgressDetails: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
  },
  inProgressDetail: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    borderRadius: 8,
  },
  inProgressDetailLabel: {
    fontSize: 10,
    opacity: 0.6,
    marginBottom: 2,
  },
  inProgressDetailValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  inProgressButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  inProgressButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapsButton: {
    backgroundColor: '#0a7ea4',
  },
  mapsButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  detailsButton: {
    backgroundColor: '#FFF3E0',
    borderWidth: 1,
    borderColor: '#F57C00',
  },
  detailsButtonText: {
    color: '#F57C00',
    fontWeight: '600',
    fontSize: 13,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginVertical: 20,
  },
  filterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 12,
  },
  filterButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    width: (screenWidth - 48) / 2,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#0a7ea4',
    borderColor: '#0a7ea4',
  },
  filterButtonInactive: {
    backgroundColor: 'transparent',
    borderColor: 'rgba(0, 0, 0, 0.2)',
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  orderCountContainer: {
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  orderCountText: {
    fontSize: 12,
    opacity: 0.6,
  },
  emptyContainer: {
    paddingVertical: 40,
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
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  orderNumber: {
    fontSize: 13,
    fontWeight: '600',
    opacity: 0.7,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  statusIcon: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  customerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  customerName: {
    fontSize: 14,
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
    opacity: 0.6,
  },
  addressContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.08)',
  },
  addressIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  address: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
    opacity: 0.8,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 10,
    opacity: 0.6,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  bottomInfo: {
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.08)',
  },
  time: {
    fontSize: 12,
    opacity: 0.7,
  },
  bottomPadding: {
    height: 20,
  },
});

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useState } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

// Sample delivery boy profile data
const profileData = {
  name: 'Raj Kumar',
  email: 'raj.kumar@example.com',
  phone: '+1-234-567-8900',
  address: '123 Oak Street, Apt 4B, Downtown City',
  city: 'New York',
  state: 'NY',
  zipCode: '10001',
  avatar: '👨‍💼',
  joinDate: 'January 15, 2023',
  vehicleType: 'Motorcycle',
  vehicleNumber: 'NY-2024-AB-1234',
  licenseNumber: 'DL123456789',
  bankAccount: '****5678',
  bankName: 'State Bank',
  ifsc: 'SBIN0001234',
  totalDeliveries: 1450,
  totalEarnings: 85400,
  averageRating: 4.8,
  completionRate: 98.5,
};

const statisticsData = [
  { label: 'Total Deliveries', value: profileData.totalDeliveries, icon: '📦' },
  { label: 'Total Earnings', value: `₹${profileData.totalEarnings}`, icon: '💰' },
  { label: 'Avg. Rating', value: profileData.averageRating, icon: '⭐' },
  { label: 'Completion Rate', value: `${profileData.completionRate}%`, icon: '✓' },
];

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [isEditing, setIsEditing] = useState(false);

  const handleCall = () => {
    Linking.openURL(`tel:${profileData.phone}`);
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${profileData.email}`);
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', onPress: () => {}, style: 'cancel' },
      {
        text: 'Logout',
        onPress: () => {
          Alert.alert('Logged Out', 'You have been logged out successfully');
        },
        style: 'destructive',
      },
    ]);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <View style={styles.headerSection}>
          <View style={[styles.avatarContainer, { backgroundColor: isDark ? '#1E3A3A' : '#E3F2FD' }]}>
            <ThemedText style={styles.avatar}>{profileData.avatar}</ThemedText>
          </View>
          <ThemedText type="title" style={styles.nameText}>
            {profileData.name}
          </ThemedText>
          <ThemedText style={styles.joinDateText}>
            Member since {profileData.joinDate}
          </ThemedText>
        </View>

        {/* Statistics Cards */}
        <View style={styles.statsGrid}>
          {statisticsData.map((stat, index) => (
            <ThemedView
              key={index}
              style={[
                styles.statCard,
                { backgroundColor: isDark ? '#1F2937' : '#F9FAFB' }
              ]}
            >
              <ThemedText style={styles.statIcon}>{stat.icon}</ThemedText>
              <ThemedText style={styles.statValue}>{stat.value}</ThemedText>
              <ThemedText style={styles.statLabel}>{stat.label}</ThemedText>
            </ThemedView>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <TouchableOpacity
            style={[styles.quickActionButton, styles.callButton]}
            onPress={handleCall}
          >
            <ThemedText style={styles.quickActionIcon}>📞</ThemedText>
            <ThemedText style={styles.quickActionText}>Call</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickActionButton, styles.emailButton]}
            onPress={handleEmail}
          >
            <ThemedText style={styles.quickActionIcon}>📧</ThemedText>
            <ThemedText style={styles.quickActionText}>Email</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickActionButton, styles.editButton]}
            onPress={() => setIsEditing(!isEditing)}
          >
            <ThemedText style={styles.quickActionIcon}>✏️</ThemedText>
            <ThemedText style={styles.quickActionText}>Edit</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Personal Information Section */}
        <ThemedView style={[styles.section, { backgroundColor: isDark ? '#1F2937' : '#F9FAFB' }]}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            📋 Personal Information
          </ThemedText>

          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Name</ThemedText>
            <ThemedText style={styles.infoValue}>{profileData.name}</ThemedText>
          </View>

          <View style={[styles.infoRow, styles.borderTop]}>
            <ThemedText style={styles.infoLabel}>Email</ThemedText>
            <ThemedText style={[styles.infoValue, { color: '#0a7ea4' }]}>
              {profileData.email}
            </ThemedText>
          </View>

          <View style={[styles.infoRow, styles.borderTop]}>
            <ThemedText style={styles.infoLabel}>Phone</ThemedText>
            <ThemedText style={styles.infoValue}>{profileData.phone}</ThemedText>
          </View>

          <View style={[styles.infoRow, styles.borderTop]}>
            <ThemedText style={styles.infoLabel}>Address</ThemedText>
            <ThemedText style={[styles.infoValue, styles.multilineText]}>
              {profileData.address}
            </ThemedText>
          </View>

          <View style={[styles.infoRow, styles.borderTop]}>
            <ThemedText style={styles.infoLabel}>City</ThemedText>
            <ThemedText style={styles.infoValue}>{profileData.city}</ThemedText>
          </View>

          <View style={[styles.infoRow, styles.borderTop]}>
            <ThemedText style={styles.infoLabel}>State</ThemedText>
            <ThemedText style={styles.infoValue}>{profileData.state}</ThemedText>
          </View>

          <View style={[styles.infoRow, styles.borderTop]}>
            <ThemedText style={styles.infoLabel}>Zip Code</ThemedText>
            <ThemedText style={styles.infoValue}>{profileData.zipCode}</ThemedText>
          </View>
        </ThemedView>

        {/* Vehicle Information Section */}
        <ThemedView style={[styles.section, { backgroundColor: isDark ? '#1F2937' : '#F9FAFB' }]}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            🚗 Vehicle Information
          </ThemedText>

          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Vehicle Type</ThemedText>
            <ThemedText style={styles.infoValue}>{profileData.vehicleType}</ThemedText>
          </View>

          <View style={[styles.infoRow, styles.borderTop]}>
            <ThemedText style={styles.infoLabel}>Vehicle Number</ThemedText>
            <ThemedText style={styles.infoValue}>{profileData.vehicleNumber}</ThemedText>
          </View>

          <View style={[styles.infoRow, styles.borderTop]}>
            <ThemedText style={styles.infoLabel}>License Number</ThemedText>
            <ThemedText style={styles.infoValue}>{profileData.licenseNumber}</ThemedText>
          </View>
        </ThemedView>

        {/* Bank Information Section */}
        <ThemedView style={[styles.section, { backgroundColor: isDark ? '#1F2937' : '#F9FAFB' }]}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            🏦 Bank Information
          </ThemedText>

          <View style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Bank Name</ThemedText>
            <ThemedText style={styles.infoValue}>{profileData.bankName}</ThemedText>
          </View>

          <View style={[styles.infoRow, styles.borderTop]}>
            <ThemedText style={styles.infoLabel}>Account Number</ThemedText>
            <ThemedText style={styles.infoValue}>{profileData.bankAccount}</ThemedText>
          </View>

          <View style={[styles.infoRow, styles.borderTop]}>
            <ThemedText style={styles.infoLabel}>IFSC Code</ThemedText>
            <ThemedText style={styles.infoValue}>{profileData.ifsc}</ThemedText>
          </View>
        </ThemedView>

        {/* Logout Button */}
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: isDark ? '#4B0000' : '#FFEBEE' }]}
          onPress={handleLogout}
        >
          <ThemedText style={[styles.logoutButtonText, { c olor: isDark ? '#FF6B6B' : '#D32F2F' }]}>
            🚪 Logout
          </ThemedText>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>
            Version 1.0.0
          </ThemedText>
          <ThemedText style={styles.footerText}>
            © 2025 Delivery Boy App. All rights reserved.
          </ThemedText>
        </View>

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
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatar: {
    fontSize: 50,
  },
  nameText: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  joinDateText: {
    fontSize: 13,
    opacity: 0.6,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    minWidth: 160,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    opacity: 0.6,
    textAlign: 'center',
  },
  quickActionsSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  quickActionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    gap: 4,
  },
  callButton: {
    backgroundColor: '#E3F2FD',
  },
  emailButton: {
    backgroundColor: '#FFF3E0',
  },
  editButton: {
    backgroundColor: '#E8F5E9',
  },
  quickActionIcon: {
    fontSize: 20,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
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
    marginBottom: 14,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.08)',
  },
  infoLabel: {
    fontSize: 13,
    opacity: 0.7,
    fontWeight: '500',
    flex: 0.4,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    flex: 0.6,
    textAlign: 'right',
  },
  multilineText: {
    textAlign: 'right',
    flexWrap: 'wrap',
  },
  logoutButton: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.08)',
  },
  footerText: {
    fontSize: 12,
    opacity: 0.5,
    marginVertical: 2,
  },
  bottomPadding: {
    height: 20,
  },
});

# Meat Delivery System - React Native API Integration Guide

## Overview

This guide explains how to use the integrated API services for the delivery boy app. The system provides complete authentication, order management, and profile updates.

## Architecture

### Directory Structure

```
services/
├── config.ts          # API configuration
├── api-client.ts      # HTTP client with auth handling
└── index.ts          # High-level API services

context/
├── auth-context.tsx  # Authentication state management
└── order-context.tsx # Order state management

types/
└── index.ts          # TypeScript type definitions

hooks/
├── use-api.ts        # Custom hooks for API operations
└── (existing hooks)

components/
├── login-screen.tsx      # Login UI component
├── pending-orders.tsx    # Pending orders display
└── (other components)
```

## Getting Started

### 1. Install Dependencies

```bash
npm install @react-native-async-storage/async-storage
```

### 2. Configure API Base URL

Edit `services/config.ts`:

```typescript
export const API_CONFIG = {
  DELIVERY_BASE: 'http://your-backend-url.com/api/delivery',
  // ... other configs
};
```

For local development on Android/iOS emulator, you may need to use `10.0.2.2` instead of `localhost`:

```typescript
// Android Emulator
DELIVERY_BASE: 'http://10.0.2.2:5000/api/delivery',

// iOS Simulator
DELIVERY_BASE: 'http://localhost:5000/api/delivery',
```

### 3. Wrap App with Providers

Update your root `_layout.tsx`:

```typescript
import { AuthProvider } from '@/context/auth-context';
import { OrderProvider } from '@/context/order-context';

export default function RootLayout() {
  return (
    <AuthProvider>
      <OrderProvider>
        {/* Your app content */}
      </OrderProvider>
    </AuthProvider>
  );
}
```

## Usage Examples

### Authentication

#### Login

```typescript
import { useAuth } from '@/context/auth-context';

export default function LoginScreen() {
  const { login, isLoading, error } = useAuth();

  const handleLogin = async () => {
    const success = await login('john@example.com', 'password123');
    if (success) {
      // Navigate to home screen
    }
  };

  return (
    // UI code
  );
}
```

#### Register

```typescript
const { register } = useAuth();

const handleRegister = async () => {
  const success = await register({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'secure123',
    phone: '+919876543210',
    licenseNumber: 'DL1234567890',
    licenseExpiryDate: '2026-12-31',
    vehicleType: 'two-wheeler',
    vehicleRegistration: 'DL01AB1234',
    vehicleModel: 'Honda Activa',
    address: '123 Main Street',
    city: 'Delhi',
    state: 'Delhi',
    zipCode: '110001',
  });
};
```

#### Logout

```typescript
const { logout } = useAuth();

const handleLogout = async () => {
  await logout();
  // User will be logged out and contexts cleared
};
```

### Profile Management

#### Get Current Profile

```typescript
import { useAuth } from '@/context/auth-context';
import { useEffect } from 'react';

export default function ProfileScreen() {
  const { profile, fetchProfile } = useAuth();

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!profile) return <ThemedText>Loading...</ThemedText>;

  return (
    <ThemedView>
      <ThemedText>{profile.firstName} {profile.lastName}</ThemedText>
      <ThemedText>Email: {profile.email}</ThemedText>
      <ThemedText>Rating: ⭐ {profile.rating}</ThemedText>
    </ThemedView>
  );
}
```

#### Update Availability

```typescript
const { updateAvailability } = useAuth();

// Set as available
await updateAvailability('available');

// Set as busy
await updateAvailability('busy');

// Set as offline
await updateAvailability('offline');
```

#### Update Location

```typescript
const { updateLocation } = useAuth();

const success = await updateLocation(28.6139, 77.2090);
```

### Order Management

#### Get Pending Orders

```typescript
import { useOrders } from '@/context/order-context';
import { useEffect } from 'react';

export default function OrdersScreen() {
  const { pendingOrders, fetchPendingOrders, isLoading } = useOrders();

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  return (
    <ThemedView>
      {pendingOrders.map((order) => (
        <OrderCard key={order._id} order={order} />
      ))}
    </ThemedView>
  );
}
```

#### Accept Order

```typescript
const { acceptOrder } = useOrders();

const handleAccept = async (orderId: string) => {
  const success = await acceptOrder(orderId);
  if (success) {
    // Order accepted, navigate to delivery screen
  }
};
```

#### Get Assigned Orders

```typescript
const { assignedOrders, fetchAssignedOrders } = useOrders();

useEffect(() => {
  fetchAssignedOrders();
}, []);
```

#### Mark Out For Delivery

```typescript
const { markOutForDelivery } = useOrders();

const handleStartDelivery = async (orderId: string) => {
  const success = await markOutForDelivery(orderId, 'Picked up from store');
  if (success) {
    // Order marked as out for delivery
  }
};
```

#### Mark Delivered

```typescript
const { markDelivered } = useOrders();

const handleCompleteDelivery = async (orderId: string) => {
  const success = await markDelivered(
    orderId,
    'Delivered in good condition',
    '1234' // OTP
  );
  if (success) {
    // Order marked as delivered
  }
};
```

### Get Statistics

```typescript
import { useOrders } from '@/context/order-context';
import { useEffect } from 'react';

export default function StatsScreen() {
  const { stats, fetchStats } = useOrders();

  useEffect(() => {
    fetchStats();
  }, []);

  if (!stats) return null;

  return (
    <ThemedView>
      <ThemedText>Total Deliveries: {stats.totalDeliveries}</ThemedText>
      <ThemedText>Completed: {stats.completedDeliveries}</ThemedText>
      <ThemedText>Rating: ⭐ {stats.rating}</ThemedText>
      <ThemedText>Avg Time: {stats.averageDeliveryTime} min</ThemedText>
    </ThemedView>
  );
}
```

## Real-Time Location Tracking

### Manual Location Updates

If you need to send location updates periodically, you can call the location update endpoint:

```typescript
import { useAuth } from '@/context/auth-context';
import { useEffect } from 'react';

export default function DeliveryScreen() {
  const { updateLocation } = useAuth();

  useEffect(() => {
    const interval = setInterval(async () => {
      // Get device location (implement with expo-location)
      // const location = await getDeviceLocation();
      
      // Update backend
      // await updateLocation(location.latitude, location.longitude);
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);
}
```

### Implementing Device Location (Optional)

For real GPS tracking, install and use `expo-location`:

```bash
npm install expo-location
```

Then implement in your component:

```typescript
import * as Location from 'expo-location';

const getDeviceLocation = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.error('Permission denied');
      return null;
    }

    const location = await Location.getCurrentPositionAsync({});
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error('Location error:', error);
    return null;
  }
};
```

## Handling Errors

All API calls return an `ApiResponse` object with a `success` property:

```typescript
const { login, error } = useAuth();

const handleLogin = async () => {
  const success = await login(email, password);
  
  if (!success) {
    console.log('Error:', error);
    // Show error to user
  }
};
```

## Error Types

- **401 Unauthorized**: Token expired or invalid - user will be logged out automatically
- **400 Bad Request**: Validation error - check request data
- **403 Forbidden**: Account not approved or suspended
- **404 Not Found**: Resource doesn't exist
- **500 Server Error**: Backend error

## Complete Workflow Example

```typescript
import { useAuth } from '@/context/auth-context';
import { useOrders } from '@/context/order-context';
import { useEffect } from 'react';

export default function DeliveryWorkflow() {
  const { user, updateAvailability, logout } = useAuth();
  const { 
    pendingOrders, 
    assignedOrders,
    acceptOrder,
    markOutForDelivery,
    markDelivered,
    fetchPendingOrders,
  } = useOrders();

  useEffect(() => {
    // Step 1: Logged in, set availability to available
    updateAvailability('available');
    
    // Step 2: Fetch pending orders
    fetchPendingOrders();
  }, []);

  const handleAcceptAndDeliver = async (orderId: string) => {
    // Step 3: Accept order
    const accepted = await acceptOrder(orderId);
    if (!accepted) return;

    // Step 4: Mark as out for delivery
    const outForDelivery = await markOutForDelivery(orderId);
    if (!outForDelivery) return;

    // Step 5: Update location periodically (every 30 seconds)
    // ... implement location tracking

    // Step 6: Mark as delivered
    const delivered = await markDelivered(orderId, 'Notes', 'OTP');
    
    if (delivered) {
      // Delivery complete, availability automatically set to "available"
    }
  };

  const handleLogout = async () => {
    await updateAvailability('offline');
    await logout();
  };

  return (
    // UI code
  );
}
```

## Best Practices

1. **Error Handling**: Always check the `success` property and handle errors gracefully
2. **Loading States**: Use `isLoading` to disable buttons and show spinners during API calls
3. **Token Management**: Tokens are automatically saved to device storage
4. **Permissions**: Request necessary permissions (location, etc.) before using features
5. **Network Awareness**: Handle network errors and timeout gracefully
6. **Data Validation**: Validate input before sending to API

## Debugging

### Check Current Token

```typescript
import { useAuth } from '@/context/auth-context';

const { token } = useAuth();
console.log('Current token:', token);
```

### Enable API Logging

Add to `services/api-client.ts`:

```typescript
const response = await fetch(url, options);
console.log(`[API] ${method} ${endpoint}:`, response.status);
```

### Test API Connection

```typescript
import { apiClient } from '@/services/api-client';

// Test connection
const response = await apiClient.get('/me');
console.log('API Response:', response);
```

## Troubleshooting

### "Network error" or Timeout

- Check API base URL in `services/config.ts`
- Ensure backend server is running
- For emulator, use `10.0.2.2` for Android or `localhost` for iOS
- Check device network connectivity

### "Invalid credentials" on Login

- Verify email and password are correct
- Check if account is approved by admin
- Account might be suspended

### "Unauthorized" (401) Errors

- Token has expired - user needs to login again
- Token is cleared automatically

### Location Updates Not Working

- Check location permissions are granted
- Implement device location service (expo-location)
- Ensure valid latitude (-90 to 90) and longitude (-180 to 180)

## API Reference Summary

### Authentication
- `POST /register` - Register new delivery boy
- `POST /login` - Login with email/password
- `POST /logout` - Logout and set offline

### Profile
- `GET /me` - Get current profile
- `PUT /availability` - Update availability status
- `PUT /location` - Update current location
- `GET /stats` - Get performance statistics

### Orders
- `GET /orders/pending` - Get available orders
- `GET /orders/assigned` - Get assigned orders
- `POST /orders/:orderId/accept` - Accept order
- `PUT /orders/:orderId/out-for-delivery` - Mark out for delivery
- `PUT /orders/:orderId/delivered` - Mark as delivered

For detailed API documentation, refer to the main API documentation file.

# Meat Delivery System - Complete Setup Guide

## Quick Start

This document guides you through setting up the React Native delivery boy app with backend API integration.

## Prerequisites

- Node.js 16+ and npm
- Expo CLI
- Backend API running at `http://localhost:5000/api/delivery` (or your custom URL)
- Android/iOS simulator or physical device

## Installation Steps

### 1. Install Dependencies

```bash
cd d:\Prasad\Meat-Delivery
npm install
```

This will install all required packages including:
- `@react-native-async-storage/async-storage` - For persistent token storage
- All other existing dependencies

### 2. Update API Configuration

Edit `services/config.ts` to match your backend URL:

```typescript
export const API_CONFIG = {
  // For local development
  DELIVERY_BASE: 'http://localhost:5000/api/delivery',
  
  // OR for Android emulator
  DELIVERY_BASE: 'http://10.0.2.2:5000/api/delivery',
  
  // OR for production
  DELIVERY_BASE: 'https://your-backend-domain.com/api/delivery',
};
```

### 3. Update Root Layout

Update `app/_layout.tsx` to wrap your app with auth and order providers:

```typescript
import { AuthProvider } from '@/context/auth-context';
import { OrderProvider } from '@/context/order-context';

export default function RootLayout() {
  return (
    <AuthProvider>
      <OrderProvider>
        <Stack>
          {/* Your layout content */}
        </Stack>
      </OrderProvider>
    </AuthProvider>
  );
}
```

### 4. Implement Screen Components

Replace your existing screen components with the provided implementations:

- `app/(tabs)/index.tsx` - Use dashboard from existing code
- `app/(tabs)/orders.tsx` - Use `PendingOrdersScreen` component
- `app/(tabs)/my-orders.tsx` - Use `MyOrdersScreen` component  
- `app/(tabs)/profile.tsx` - Use `ProfileScreen` component

Or import and use the components:

```typescript
import PendingOrdersScreen from '@/components/pending-orders';
import MyOrdersScreen from '@/components/my-orders-screen';
import ProfileScreen from '@/components/profile-screen';
import LoginScreen from '@/components/login-screen';
```

## File Structure

```
d:/Prasad/Meat-Delivery/
├── services/
│   ├── config.ts              # API base URL configuration
│   ├── api-client.ts          # HTTP client with auth handling
│   └── index.ts               # API service methods
├── context/
│   ├── auth-context.tsx       # Authentication state & logic
│   └── order-context.tsx      # Order management state & logic
├── types/
│   └── index.ts               # TypeScript type definitions
├── hooks/
│   └── use-api.ts             # Custom React hooks
├── components/
│   ├── login-screen.tsx       # Login UI
│   ├── pending-orders.tsx     # Available orders list
│   ├── my-orders-screen.tsx   # Active orders
│   └── profile-screen.tsx     # User profile & settings
├── app/
│   ├── _layout.tsx            # Root layout with providers
│   └── (tabs)/
│       ├── index.tsx          # Dashboard
│       ├── orders.tsx         # Pending orders tab
│       ├── my-orders.tsx      # My orders tab
│       └── profile.tsx        # Profile tab
└── API_INTEGRATION_GUIDE.md   # Detailed usage guide
```

## Running the App

### Development

```bash
# Start Expo
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web
npm run web
```

### Production Build

```bash
# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

## Testing the Integration

### Test Login

1. Start the app
2. Navigate to the login screen
3. Enter valid credentials (from your backend)
4. You should see the dashboard with orders

### Test Order Acceptance

1. Login successfully
2. Go to "Orders" tab
3. See pending orders
4. Tap "Accept Order"
5. Check "My Orders" tab to see accepted order

### Test Order Delivery

1. Accept an order
2. In "My Orders", tap "Start Delivery"
3. Tap "Mark Delivered" and enter OTP
4. Check profile for updated stats

## Configuration Options

### API Timeout

Edit `services/config.ts`:

```typescript
export const API_CONFIG = {
  TIMEOUT: 30000, // 30 seconds (default)
};
```

### Location Tracking Interval

Edit components to adjust how often location is sent:

```typescript
// Every 30 seconds (default)
const interval = 30000;
```

### Refresh Rate for Orders

```typescript
// Adjust in useOrderRefresh hook
interval={30000} // in milliseconds
```

## Common Issues & Solutions

### "Network error" or "Cannot connect to backend"

**Problem**: App can't reach the API

**Solutions**:
1. Check backend server is running
2. Verify URL in `services/config.ts`
3. For emulator:
   - Android: Use `10.0.2.2` instead of `localhost`
   - iOS: Use `localhost`
4. Check firewall isn't blocking port 5000
5. Verify CORS is enabled on backend

### "Invalid credentials" on login

**Problem**: Login fails with valid email/password

**Solutions**:
1. Verify credentials are correct
2. Check backend is running
3. Ensure delivery boy account is approved by admin
4. Check account isn't suspended

### Token/Auth errors

**Problem**: Getting 401 unauthorized errors

**Solutions**:
1. Token might be expired - login again
2. Clear app storage and logout
3. Check token is being sent correctly in headers
4. Verify JWT secret matches between frontend and backend

### Location not updating

**Problem**: Location updates not working

**Solutions**:
1. Check app has location permissions
2. Implement actual device location (expo-location)
3. Verify latitude (-90 to 90) and longitude (-180 to 180)
4. Check backend accepts location updates

### Orders not showing

**Problem**: No orders appear in pending/assigned list

**Solutions**:
1. Verify you're logged in
2. Check backend has orders in database
3. Verify delivery boy status is "active"
4. Check availability is "available"
5. Try refreshing the screen

## Architecture Overview

### Authentication Flow

```
Login → API Call → Save Token → Update Context → Navigate to Home
```

### Order Workflow

```
View Pending → Accept Order → Start Delivery → Mark Delivered → Complete
```

### State Management

**AuthContext** manages:
- User data
- Authentication token
- Login/logout operations
- Profile updates

**OrderContext** manages:
- Pending orders
- Assigned orders
- Order operations (accept, mark delivered, etc.)
- Statistics

### API Client Pattern

All API calls go through `apiClient`:
1. Request is made with token in headers
2. If 401 error, token is cleared automatically
3. Response includes `success` flag for easy error handling

## Security Considerations

1. **Token Storage**: Tokens are stored in AsyncStorage (secure on device)
2. **HTTPS**: Use HTTPS in production
3. **Token Expiry**: Implement token refresh if needed
4. **Data Validation**: Always validate user input before sending to API
5. **Error Messages**: Don't expose sensitive API errors to users

## Performance Tips

1. Use pagination for large order lists
2. Cache profile data and update on demand
3. Debounce location updates
4. Implement proper loading states
5. Use optimistic UI updates for better UX
6. Lazy load images and data

## Extending the System

### Adding New Endpoints

1. Add types to `types/index.ts`
2. Create service function in `services/index.ts`
3. Add context method if needed
4. Use in components

Example:

```typescript
// In services/index.ts
export const customService = {
  async getSomething(): Promise<ApiResponse<Something>> {
    return apiClient.get<Something>('/endpoint');
  }
};
```

### Implementing Location Tracking

Install and setup expo-location:

```bash
npm install expo-location
```

Then implement in your component:

```typescript
import * as Location from 'expo-location';

const getDeviceLocation = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') return null;
  
  const location = await Location.getCurrentPositionAsync({});
  return location.coords;
};
```

## Backend Requirements

Your backend must:

1. Expose endpoints at `/api/delivery/*`
2. Return JSON responses with `success`, `message`, `data`
3. Support JWT Bearer token authentication
4. Validate all input data
5. Return appropriate HTTP status codes
6. Support CORS for web/cross-origin requests

## Support & Troubleshooting

### Check Logs

In VS Code terminal or emulator logs:
```bash
# React Native logs
npx react-native log-android  # Android
npx react-native log-ios      # iOS

# API debugging
console.log(response);
```

### Debug Mode

Add logging to API client:

```typescript
// In api-client.ts
console.log(`[API] ${method} ${endpoint}:`, response.status);
```

### Test API Directly

Use Postman or curl to test endpoints:

```bash
curl -X POST http://localhost:5000/api/delivery/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

## Next Steps

1. ✅ Install dependencies
2. ✅ Update API configuration
3. ✅ Add providers to root layout
4. ✅ Implement screen components
5. ✅ Test login flow
6. ✅ Test order operations
7. ✅ Add location tracking (optional)
8. ✅ Deploy to production

## Resources

- [API Integration Guide](./API_INTEGRATION_GUIDE.md)
- [Type Definitions](./types/index.ts)
- [API Services](./services/index.ts)
- [Context Usage](./context/)

## Support

For issues or questions:
1. Check the API_INTEGRATION_GUIDE.md
2. Review component examples
3. Check browser/emulator console for errors
4. Verify backend is running and accessible

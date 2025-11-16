# Quick Reference - API Integration

## 🚀 Getting Started (30 seconds)

```bash
npm install @react-native-async-storage/async-storage
```

Update `services/config.ts`:
```typescript
DELIVERY_BASE: 'http://your-backend-url.com/api/delivery'
```

Wrap app with providers in `app/_layout.tsx`:
```typescript
<AuthProvider>
  <OrderProvider>
    {/* your app */}
  </OrderProvider>
</AuthProvider>
```

## 🔐 Authentication

### Login
```typescript
const { login, isLoading, error } = useAuth();
await login('email@example.com', 'password');
```

### Register
```typescript
const { register } = useAuth();
await register({
  firstName, lastName, email, password, phone,
  licenseNumber, licenseExpiryDate, vehicleType,
  vehicleRegistration, vehicleModel,
  address, city, state, zipCode
});
```

### Logout
```typescript
const { logout } = useAuth();
await logout();
```

### Get Current User
```typescript
const { user, profile } = useAuth();
// user: DeliveryBoy
// profile: DeliveryBoyProfile
```

## 📦 Orders

### View Pending Orders
```typescript
const { pendingOrders, fetchPendingOrders } = useOrders();
useEffect(() => { fetchPendingOrders(); }, []);
```

### Accept Order
```typescript
const { acceptOrder, isLoading } = useOrders();
const success = await acceptOrder(orderId);
```

### View Assigned Orders
```typescript
const { assignedOrders, fetchAssignedOrders } = useOrders();
```

### Start Delivery
```typescript
const { markOutForDelivery } = useOrders();
await markOutForDelivery(orderId, 'Picked up order');
```

### Complete Delivery
```typescript
const { markDelivered } = useOrders();
await markDelivered(orderId, 'Delivered successfully', '1234');
```

## 👤 Profile

### Get Profile
```typescript
const { profile, fetchProfile } = useAuth();
await fetchProfile();
```

### Update Availability
```typescript
const { updateAvailability } = useAuth();
// 'available' | 'busy' | 'offline'
await updateAvailability('available');
```

### Update Location
```typescript
const { updateLocation } = useAuth();
await updateLocation(latitude, longitude);
// latitude: -90 to 90
// longitude: -180 to 180
```

### Get Stats
```typescript
const { stats, fetchStats } = useOrders();
await fetchStats();
// stats: { totalDeliveries, completedDeliveries, rating, averageDeliveryTime }
```

## 🎨 UI Components

### Login Screen
```typescript
import LoginScreen from '@/components/login-screen';
<LoginScreen onLoginSuccess={() => navigate('home')} />
```

### Pending Orders
```typescript
import PendingOrdersScreen from '@/components/pending-orders';
<PendingOrdersScreen />
```

### My Orders
```typescript
import MyOrdersScreen from '@/components/my-orders-screen';
<MyOrdersScreen />
```

### Profile Screen
```typescript
import ProfileScreen from '@/components/profile-screen';
<ProfileScreen />
```

## 🔄 Common Patterns

### Auto-refresh Orders
```typescript
const { refreshAll } = useOrders();
useEffect(() => {
  const interval = setInterval(refreshAll, 30000); // Every 30s
  return () => clearInterval(interval);
}, []);
```

### Handle Loading State
```typescript
const { isLoading } = useAuth();
{isLoading ? <Spinner /> : <Content />}
```

### Error Handling
```typescript
const { error, clearError } = useAuth();
{error && <ErrorMessage>{error}</ErrorMessage>}
<Button onPress={clearError}>Dismiss</Button>
```

### Check Authentication
```typescript
const { isAuthenticated } = useAuth();
if (!isAuthenticated) return <LoginScreen />;
return <Dashboard />;
```

## 📊 Data Types

### Order
```typescript
{
  _id: string
  orderNumber: string
  customer: { firstName, lastName, email, phone }
  items: [{ product: { name, price }, quantity, subtotal }]
  deliveryAddress: { street, city, state, zipCode }
  pricing: { subtotal, deliveryFee, tax, total }
  status: 'pending' | 'confirmed' | 'out-for-delivery' | 'delivered'
}
```

### DeliveryBoy
```typescript
{
  _id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  status: 'active' | 'inactive'
  availability: 'available' | 'busy' | 'offline'
  totalDeliveries: number
  completedDeliveries: number
  rating: number
}
```

### Stats
```typescript
{
  totalDeliveries: number
  completedDeliveries: number
  rating: number
  averageDeliveryTime: number
  availability: string
  status: string
}
```

## 🔧 Configuration

### Change API URL
```typescript
// services/config.ts
DELIVERY_BASE: 'http://10.0.2.2:5000/api/delivery' // Android
DELIVERY_BASE: 'http://localhost:5000/api/delivery' // iOS
```

### Change Timeout
```typescript
// services/config.ts
TIMEOUT: 30000 // milliseconds
```

## 🚨 Error Codes

| Code | Meaning | Solution |
|------|---------|----------|
| 400 | Bad Request | Check input data |
| 401 | Unauthorized | Login again |
| 403 | Forbidden | Account not approved |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Check backend |

## ✅ Checklist

- [ ] Install async-storage
- [ ] Update API URL in config.ts
- [ ] Add providers to root layout
- [ ] Implement screen components
- [ ] Test login flow
- [ ] Test order acceptance
- [ ] Test delivery completion
- [ ] Verify error handling
- [ ] Add location tracking (optional)
- [ ] Test on device

## 📚 Files Reference

| File | Purpose |
|------|---------|
| `services/config.ts` | API configuration |
| `services/api-client.ts` | HTTP client |
| `services/index.ts` | API services |
| `context/auth-context.tsx` | Auth state |
| `context/order-context.tsx` | Order state |
| `types/index.ts` | TypeScript types |
| `hooks/use-api.ts` | Custom hooks |

## 💡 Tips

1. Always check `success` property on API responses
2. Use `isLoading` to disable buttons during requests
3. Clear errors when user starts a new action
4. Handle 401 errors by redirecting to login
5. Validate input before API calls
6. Show loading spinners for better UX
7. Debounce rapid API calls
8. Cache frequently accessed data

## 🔗 Complete Example

```typescript
import { useAuth } from '@/context/auth-context';
import { useOrders } from '@/context/order-context';

export default function DeliveryFlow() {
  const { updateAvailability, logout } = useAuth();
  const { 
    pendingOrders, 
    acceptOrder, 
    markOutForDelivery,
    markDelivered 
  } = useOrders();

  return (
    <View>
      {/* Step 1: Set available */}
      <Button 
        onPress={() => updateAvailability('available')}
        title="Go Available"
      />

      {/* Step 2: See orders */}
      {pendingOrders.map(order => (
        <Button 
          key={order._id}
          onPress={() => acceptOrder(order._id)}
          title={`Accept: ${order.orderNumber}`}
        />
      ))}

      {/* Step 3: Complete delivery */}
      <Button 
        onPress={() => markDelivered(orderId, '', '1234')}
        title="Mark Delivered"
      />

      {/* Step 4: Logout */}
      <Button onPress={logout} title="Logout" />
    </View>
  );
}
```

---

**For detailed documentation, see:**
- `API_INTEGRATION_GUIDE.md` - Complete usage guide
- `SETUP_GUIDE.md` - Installation & configuration
- `INTEGRATION_SUMMARY.md` - Overview & features

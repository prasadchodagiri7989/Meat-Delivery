# Debugging API Calls Guide

## 🔍 How to Debug API Calls

### 1. Check Console Logs
The app logs all API responses. Open your terminal/console to see:
```
API Call: POST /login
Response: {...}
Error: {...}
```

### 2. Network Tab in Browser (for Web)
If running on web:
1. Open DevTools (F12)
2. Go to Network tab
3. Filter by XHR/Fetch
4. Trigger an action (login, accept order, etc.)
5. Click on the request to see full details

### 3. Enable Network Debugging (React Native)
Add this to see network logs:
```javascript
// In your services/api-client.ts, uncomment console.logs
console.log('📡 API Request:', method, url, data);
console.log('📡 API Response:', response);
console.error('📡 API Error:', error);
```

## 🛠️ Common Issues & Solutions

### Issue: "Cannot find module '@/context/auth-context'"
**Solution:** Check that the context files exist in the correct path:
```
d:\Prasad\Meat-Delivery\context\
  ├── auth-context.tsx
  └── order-context.tsx
```

### Issue: "useAuth must be used within AuthProvider"
**Solution:** Ensure app/_layout.tsx wraps the entire app:
```tsx
<AuthProvider>
  <OrderProvider>
    <RootLayoutContent />
  </OrderProvider>
</AuthProvider>
```

### Issue: "Cannot POST /login"
**Solution:** Check your backend:
1. Ensure backend is running: `http://localhost:5000`
2. Check API_CONFIG in `services/config.ts`
3. Verify endpoint path: `POST /api/delivery/login`
4. Check backend error logs

### Issue: "Failed to fetch - CORS"
**Solution:** Your backend needs CORS enabled:
```javascript
// Backend should have:
app.use(cors({
  origin: '*', // or specify your app's origin
  credentials: true
}));
```

### Issue: "401 Unauthorized"
**Solution:** 
1. Token might be invalid/expired
2. Check AsyncStorage is saving token correctly
3. Verify Bearer token format: `Authorization: Bearer <token>`

## 🔧 API Call Checklist

Before making any API call, verify:

### ✓ Backend Running
```bash
# Terminal where backend is running
npm start  # or yarn start
```

### ✓ Correct API Base URL
```typescript
// services/config.ts
BASE_URL: 'http://localhost:5000/api'  // Must match your backend
```

### ✓ Endpoint Exists
Check backend API documentation for:
- Correct HTTP method (GET, POST, PUT, etc.)
- Correct URL path
- Required request body
- Expected response format

### ✓ Authentication Required
Check if endpoint needs token:
- Public endpoints: `/login`, `/register`
- Protected endpoints: `/me`, `/orders/*`, `/stats`

### ✓ Token Stored
Verify token is saved after login:
```javascript
// Add to auth-context.tsx for debugging
const token = authService.getToken();
console.log('Stored Token:', token);
```

## 📝 Manual Testing Steps

### Test Login Flow
1. Open app
2. See login page ✓
3. Enter test credentials:
   - Email: `deliveryboy@example.com`
   - Password: `password123`
4. Click Login
5. Should see dashboard ✓

### Test Dashboard API Calls
1. After login, wait for data to load
2. Should see:
   - Real delivery counts
   - Real earnings
   - Real ratings
   - Active order list
3. Pull down to refresh
4. Should fetch fresh data ✓

### Test Orders Page
1. Navigate to Orders tab
2. Should see list of pending orders from backend
3. Click "Accept" on an order
4. Should see success message
5. Order should disappear from list (or status change)
6. Pull down to refresh
7. Accepted order should not appear ✓

### Test My Orders Page
1. Navigate to My Orders tab
2. Should see your accepted orders
3. Status should show current delivery status
4. Click "Start" to mark as out_for_delivery
5. Should see success message
6. Status should update ✓
7. Click "Complete" with OTP
8. Order should move to delivered ✓

### Test Profile Page
1. Navigate to Profile tab
2. Should see your real user information
3. Should see availability toggle
4. Change availability status
5. Should see success message
6. Click phone/email to make calls
7. Click logout to log out ✓

## 🐛 Debug Mode

### Add Debug Logging to Any Page
```typescript
import { useEffect } from 'react';

// In your component:
useEffect(() => {
  console.log('📱 Component mounted');
  console.log('User:', user);
  console.log('Stats:', stats);
  console.log('Orders:', assignedOrders);
}, [user, stats, assignedOrders]);
```

### Check API Client
```typescript
// In services/api-client.ts, uncomment:
console.log('🔐 Token:', this.token);
console.log('📡 Request Headers:', headers);
console.log('📦 Request Body:', body);
```

### Monitor Context Changes
```typescript
// In auth-context.tsx, add:
useEffect(() => {
  console.log('🔐 Auth State Changed:', {
    user,
    isAuthenticated,
    token,
    isLoading,
    error
  });
}, [user, isAuthenticated, token, isLoading, error]);
```

## 🚀 Testing with Postman

### Test Backend Without App
1. Open Postman
2. Set up requests for your API endpoints
3. Test each endpoint manually
4. Verify responses match what app expects

### Example: Test Login
```
Method: POST
URL: http://localhost:5000/api/delivery/login
Headers:
  Content-Type: application/json
Body:
{
  "email": "deliveryboy@example.com",
  "password": "password123"
}

Expected Response:
{
  "success": true,
  "data": {
    "id": "...",
    "email": "...",
    "firstName": "..."
  },
  "token": "eyJ..."
}
```

## 📊 Monitoring Network Requests

### Enable Network Logging
```typescript
// In services/api-client.ts
private async request<T>(
  method: string,
  endpoint: string,
  data?: any,
  requiresAuth: boolean = true
): Promise<ApiResponse<T>> {
  const startTime = Date.now();
  console.log(`🚀 [${method}] ${endpoint}`);
  
  try {
    // ... rest of implementation
    const duration = Date.now() - startTime;
    console.log(`✅ [${method}] ${endpoint} (${duration}ms)`);
    return response;
  } catch (error) {
    console.error(`❌ [${method}] ${endpoint}`);
    console.error(error);
    throw error;
  }
}
```

## ✅ Verification Checklist

- [ ] Login page shows correctly
- [ ] Can login with test credentials
- [ ] Dashboard loads real data
- [ ] Pull-to-refresh works
- [ ] Orders page shows pending orders
- [ ] Can accept orders
- [ ] My Orders shows assigned orders
- [ ] Can start and complete deliveries
- [ ] Profile shows user information
- [ ] Availability toggle works
- [ ] Logout works and returns to login
- [ ] All API calls complete in < 5 seconds
- [ ] Error messages display on failures

## 🎯 Performance Tips

1. **Avoid Too Many API Calls**
   - Use useEffect dependencies correctly
   - Don't call API on every render

2. **Implement Caching**
   - Cache order list locally
   - Update cache when status changes

3. **Use Pull-to-Refresh Wisely**
   - Refresh only when needed
   - Show loading indicator

4. **Optimize Images**
   - Compress profile pictures
   - Use appropriate image sizes

## 📞 Need Help?

If API calls fail:
1. Check console logs for error messages
2. Verify backend is running
3. Check network connectivity
4. Verify API endpoints exist in backend
5. Check request/response formats match
6. Test with Postman first
7. Check token validity
8. Review error logs on backend

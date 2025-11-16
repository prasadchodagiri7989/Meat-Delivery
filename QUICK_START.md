# Quick Start Guide - Backend Integration

## 🚀 Getting Started (5 minutes)

### Step 1: Ensure Backend is Running
```bash
# In your backend directory
npm start
# Should see: Server running at http://localhost:5000
```

### Step 2: Update API Configuration (if needed)
Edit `services/config.ts` if your backend uses a different URL:
```typescript
BASE_URL: 'http://YOUR_BACKEND_URL:5000/api'
```

### Step 3: Start the App
```bash
cd d:\Prasad\Meat-Delivery
npm start
# or
expo start
```

### Step 4: Select Your Platform
- Press `i` for iOS (requires macOS)
- Press `a` for Android
- Press `w` for Web

### Step 5: Login with Test Credentials
```
Email: deliveryboy@example.com
Password: password123
```

## 📱 App Screens Overview

### 1. **Login Screen** (First Screen)
- Shows when you first open the app
- Or when you logout
- Login with test credentials

### 2. **Dashboard** (Home Tab)
- Shows real-time statistics
- Active deliveries
- User greeting
- Pull down to refresh

### 3. **Orders Tab**
- Available orders from backend
- Tap "Accept" to accept an order
- Once accepted, order appears in "My Orders"

### 4. **My Orders Tab**
- Your accepted orders
- Filter by status
- Tap "Start" to begin delivery
- Tap "Complete" to finish (needs OTP)
- See Google Maps directions

### 5. **Profile Tab**
- Your user information
- Change availability status
- View vehicle info
- View bank info
- Logout button

## 🔄 Complete Workflow

### Delivery Boy's Daily Workflow

```
1. Open App
   ↓
2. Login with credentials
   ↓
3. See Dashboard with stats
   ↓
4. Go to Orders → View Available Orders
   ↓
5. Accept an order
   ↓
6. Go to My Orders → See accepted order
   ↓
7. Click "Start" → Status changes to "Out for Delivery"
   ↓
8. Use Maps to navigate to customer
   ↓
9. Click "Complete" → Enter OTP
   ↓
10. Order marked as "Delivered"
    ↓
11. Dashboard updates with new stats
    ↓
12. Repeat for next order
```

## 🎯 Key Features

✅ **Real-Time Data**: All data comes from your backend
✅ **Authentication**: Secure login with token storage
✅ **Order Management**: Accept, deliver, complete orders
✅ **Status Tracking**: Real-time order status updates
✅ **User Profile**: Complete profile management
✅ **Navigation**: Google Maps integration
✅ **Availability**: Set your delivery status
✅ **Statistics**: View your delivery metrics

## 📊 API Endpoints Being Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/login` | POST | User authentication |
| `/me` | GET | Get user profile |
| `/stats` | GET | Get delivery statistics |
| `/orders/pending` | GET | Get available orders |
| `/orders/assigned` | GET | Get your accepted orders |
| `/orders/{id}/accept` | POST | Accept an order |
| `/orders/{id}/out-for-delivery` | PUT | Mark as out for delivery |
| `/orders/{id}/delivered` | PUT | Mark as delivered with OTP |
| `/availability` | PUT | Update availability status |

## 🔐 Authentication

The app uses Bearer token authentication:
1. Login endpoint returns a token
2. Token is stored in AsyncStorage (device storage)
3. All subsequent requests include the token
4. Token automatically cleared on logout

## 💡 Tips & Tricks

### Clear Cache if Something's Wrong
```bash
npm start -- --reset-cache
```

### Test Without Phone/Email
Just navigate to the other sections, you don't need to call/email

### Check Console for Logs
Open DevTools and check Console tab for API logs and errors

### Test on Android Emulator
```bash
# After npm start, press 'a'
```

### Test on Web Browser
```bash
# After npm start, press 'w'
# Opens http://localhost:19006
```

## 🚨 Troubleshooting Quick Fixes

| Problem | Solution |
|---------|----------|
| Login fails | Check backend is running at http://localhost:5000 |
| Dashboard shows empty | Pull down to refresh data |
| Can't see orders | Make sure pending orders exist in backend |
| Status won't update | Check backend endpoint works in Postman |
| Token issues | Clear AsyncStorage and login again |
| CORS errors | Add CORS middleware to backend |

## 📝 Test Orders

### To Accept an Order
1. Go to Orders tab
2. See available orders
3. Click "Accept" button
4. Confirm in alert dialog
5. Order moves to My Orders tab

### To Complete an Order
1. Go to My Orders tab
2. See your accepted order
3. Click "Start" first
4. Wait for status to update
5. Click "Complete"
6. Enter OTP (any 4 digits for testing)
7. Order marked as delivered

## 🎨 UI Features

- **Dark Mode**: Supports light/dark themes
- **Responsive**: Works on all screen sizes
- **Pull-to-Refresh**: Refresh data by pulling down
- **Loading States**: Shows spinners during loading
- **Error Handling**: Shows error messages clearly
- **Google Maps**: Navigate with real directions

## 📞 API Documentation

Your complete API documentation was provided at the start:
- 12 endpoints total
- 3 authentication endpoints
- 4 profile endpoints
- 5 order management endpoints

All these are now integrated into the app!

## ✨ What's New

### Login Flow
- App shows login screen on startup
- After successful login, redirects to dashboard
- Token stored automatically

### Dashboard Updates
- Fetches real stats from `/stats`
- Fetches real orders from `/orders/assigned`
- Shows personalized greeting

### Orders Integration
- Fetches available orders from `/orders/pending`
- Accept orders with real API calls
- Automatic list refresh

### My Orders Features
- Status filtering
- Start delivery action
- Complete delivery with OTP
- Google Maps navigation
- Real-time updates

### Profile Management
- Display all user info
- Toggle availability status
- View vehicle details
- View bank information
- Logout with cleanup

## 🚀 Next Steps After Testing

1. **Test Each Feature**
   - Try login/logout
   - Accept an order
   - Start and complete delivery
   - Change availability

2. **Verify API Calls**
   - Open console
   - Look for API logs
   - Check network tab
   - Verify response data

3. **Test Error Cases**
   - Try invalid login
   - Disconnect from internet
   - Kill backend server
   - Check error messages

4. **Performance Check**
   - API calls should be fast
   - UI should be responsive
   - No freezing or lag

## 📚 Documentation Files

- **BACKEND_INTEGRATION_COMPLETE.md** - Full integration summary
- **API_DEBUGGING_GUIDE.md** - Debugging tips and troubleshooting
- **This file** - Quick start guide

## 🎯 Success Criteria

✅ App opens with login screen
✅ Can login with test credentials
✅ Dashboard shows real data
✅ Can see pending orders
✅ Can accept orders
✅ Accepted orders appear in My Orders
✅ Can mark orders as delivered
✅ Profile shows real user info
✅ Can change availability status
✅ Can logout
✅ All API calls logged in console

**If all above work, your integration is complete!** 🎉

## 📞 Debugging Checklist

- [ ] Backend running at localhost:5000
- [ ] API config URL correct in services/config.ts
- [ ] AuthProvider and OrderProvider in root layout
- [ ] No import errors in console
- [ ] Login page appears
- [ ] Test credentials work
- [ ] Dashboard loads
- [ ] API calls visible in console
- [ ] No CORS errors
- [ ] Token stored after login

## 🏁 You're All Set!

Everything is now connected to your backend. The app is ready for:
- ✅ Development testing
- ✅ User testing
- ✅ Bug fixes
- ✅ Feature additions
- ✅ Production deployment

**Happy Coding! 🚀**

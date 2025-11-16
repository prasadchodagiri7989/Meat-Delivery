/**
 * Example Root Layout Implementation
 * 
 * This shows how to properly wrap your app with the authentication and order providers.
 * Copy this pattern to your app/_layout.tsx file.
 * 
 * Import and use any of the screen components from components/ directory
 */


import { OrderProvider } from '@/context/order-context';
import { apiClient } from '@/services/api-client';

// Prevent the splash screen from auto hiding
SplashScreen.preventAutoHideAsync();

/**
 * Navigation component that handles auth state changes
 */
function NavigationContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [isNavigationReady, setIsNavigationReady] = React.useState(false);

  React.useEffect(() => {
    if (!isNavigationReady) return;

    // Redirect based on auth state
    const inAuthGroup = segments[0] === '(auth)';

    if (!isLoading) {
      if (!isAuthenticated && !inAuthGroup) {
        // Not logged in, go to login
        router.replace('/(auth)/login');
      } else if (isAuthenticated && inAuthGroup) {
        // Logged in, go to home
        router.replace('/(tabs)/');
      }
    }
  }, [isAuthenticated, isLoading, isNavigationReady, segments]);

  if (isLoading) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        // Authenticated user screens
        <>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="order-details" />
        </>
      ) : (
        // Unauthenticated user screens
        <>
          <Stack.Screen 
            name="(auth)/login" 
            options={{ 
              headerShown: false,
              animationEnabled: false,
            }} 
          />
          <Stack.Screen 
            name="(auth)/register" 
            options={{ 
              headerShown: false,
              animationEnabled: false,
            }} 
          />
        </>
      )}
    </Stack>
  );
}

/**
 * Root Layout Component
 * This is the main entry point of your app
 */
export default function RootLayout() {
  const [isReady, setIsReady] = React.useState(false);

  // Initialize API client and prepare app
  React.useEffect(() => {
    async function prepare() {
      try {
        // Initialize API client (loads saved token if exists)
        await apiClient.initialize();
      } catch (e) {
        console.warn('Error preparing app:', e);
      } finally {
        // Tell the splash screen to hide after we've done our async work
        await SplashScreen.hideAsync();
        setIsReady(true);
      }
    }

    prepare();
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <AuthProvider>
      <OrderProvider>
        <NavigationContent />
      </OrderProvider>
    </AuthProvider>
  );
}

/**
 * SETUP INSTRUCTIONS:
 * 
 * 1. Create the following directory structure:
 *    app/
 *    ├── _layout.tsx (this file)
 *    ├── (auth)/
 *    │   ├── _layout.tsx
 *    │   ├── login.tsx
 *    │   └── register.tsx
 *    ├── (tabs)/
 *    │   ├── _layout.tsx
 *    │   ├── index.tsx (dashboard)
 *    │   ├── orders.tsx
 *    │   ├── my-orders.tsx
 *    │   └── profile.tsx
 *    └── order-details.tsx
 * 
 * 2. For (auth)/login.tsx:
 *    import LoginScreen from '@/components/login-screen';
 *    export default LoginScreen;
 * 
 * 3. For (tabs)/orders.tsx:
 *    import PendingOrdersScreen from '@/components/pending-orders';
 *    export default PendingOrdersScreen;
 * 
 * 4. For (tabs)/my-orders.tsx:
 *    import MyOrdersScreen from '@/components/my-orders-screen';
 *    export default MyOrdersScreen;
 * 
 * 5. For (tabs)/profile.tsx:
 *    import ProfileScreen from '@/components/profile-screen';
 *    export default ProfileScreen;
 * 
 * 6. Create (tabs)/_layout.tsx with bottom tab navigation:
 * 
 *    import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
 *    import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
 *    import { Tabs } from 'expo-router';
 *    import { useColorScheme } from '@/hooks/use-color-scheme';
 * 
 *    const Tab = createBottomTabNavigator();
 * 
 *    export default function TabsLayout() {
 *      const colorScheme = useColorScheme();
 * 
 *      return (
 *        <Tabs
 *          screenOptions={{
 *            tabBarActiveTintColor: '#1976D2',
 *            tabBarInactiveTintColor: 'gray',
 *          }}
 *        >
 *          <Tabs.Screen
 *            name="index"
 *            options={{
 *              title: 'Dashboard',
 *              headerShown: false,
 *            }}
 *          />
 *          <Tabs.Screen
 *            name="orders"
 *            options={{
 *              title: 'Orders',
 *              headerShown: false,
 *            }}
 *          />
 *          <Tabs.Screen
 *            name="my-orders"
 *            options={{
 *              title: 'My Orders',
 *              headerShown: false,
 *            }}
 *          />
 *          <Tabs.Screen
 *            name="profile"
 *            options={{
 *              title: 'Profile',
 *              headerShown: false,
 *            }}
 *          />
 *        </Tabs>
 *      );
 *    }
 * 
 * 7. Create (auth)/_layout.tsx:
 * 
 *    import { Stack } from 'expo-router';
 *    
 *    export default function AuthLayout() {
 *      return (
 *        <Stack screenOptions={{ headerShown: false }}>
 *          <Stack.Screen name="login" />
 *          <Stack.Screen name="register" />
 *        </Stack>
 *      );
 *    }
 * 
 * 8. Update your app.json to ensure proper routing:
 * 
 *    "scheme": "meat-delivery",
 *    "plugins": ["expo-router"]
 * 
 * That's it! Your app is now integrated with the API backend.
 */

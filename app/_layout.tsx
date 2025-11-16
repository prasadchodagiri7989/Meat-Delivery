import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRootNavigationState, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { AuthProvider, useAuth } from '@/context/auth-context';
import { OrderProvider } from '@/context/order-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ActivityIndicator, View } from 'react-native';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutContent() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();
  const [hasNavigated, setHasNavigated] = useState(false);

  // Handle navigation when authentication state changes
useEffect(() => {
  if (!rootNavigationState?.key) return;

  console.log("[Router] Auth changed =>", isAuthenticated, "Loading:", isLoading);

  if (!isLoading) {
    router.replace(isAuthenticated ? "/(tabs)" : "/login");
  }
}, [isAuthenticated, isLoading, rootNavigationState?.key]);


  // Show splash screen while checking authentication
  if (isLoading) {
    return (
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colorScheme === 'dark' ? '#fff' : '#000'} />
        </View>
        <StatusBar style="auto" />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen 
          name="login" 
          options={{ 
            headerShown: false,
            gestureEnabled: false 
          }} 
        />
        <Stack.Screen 
          name="(tabs)" 
          options={{ 
            headerShown: false
          }} 
        />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <OrderProvider>
        <RootLayoutContent />
      </OrderProvider>
    </AuthProvider>
  );
}
